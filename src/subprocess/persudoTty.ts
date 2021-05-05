'use strict';
import * as vscode from 'vscode';
import * as cp from 'child_process';
import { PathLike } from 'node:fs';

export interface TtyConfig {
    exePath : string; // exe运行路径
    xArgs : Array<string>; // exe运行参数
    workDir : string; // exe运行路径
    stdinCmd : string;
}

export class PersudoTty {        
    public tty : Object | null; // tty允许null类型
    public para : TtyConfig; // para允许null类型
    public name : string;
    public procHandle : cp.ChildProcessWithoutNullStreams;
    private writeEmitter : vscode.EventEmitter<string>;
    private colseEmitter : vscode.EventEmitter<vscode.TerminalDimensions>;
    private terminal : vscode.Terminal;

    constructor (name : string, para : TtyConfig) {
        this.tty = null;
        this.para = para;
        this.name = name;
        this.procHandle = <cp.ChildProcessWithoutNullStreams>{};
        this.writeEmitter = new vscode.EventEmitter<string>();
        this.colseEmitter = new vscode.EventEmitter<vscode.TerminalDimensions>();
        this.terminal = <any>null;
    }

    public startProc() : void {
        this.procHandle = cp.spawn(this.para.exePath, this.para.xArgs, {
            cwd : this.para.workDir,
            env : process.env,
            stdio : ['pipe','pipe', 'pipe']
        });
        const pty =  this.genTtyOption();
        if (this.terminal === null || this.terminal.exitStatus === undefined) {
            this.terminal = vscode.window.createTerminal({ name: `${this.name}`, pty});
        }
		(this.terminal).show();
        // stdin/out
        this.procHandle.stdout.on("data", (data : string) => {
            console.log(data);
            this.writeEmitter.fire(`${data}`);
        });
        this.procHandle.stderr.on("data", (data : string) => {
            if (`${data}`.endsWith('\n')) {
                let showStr : string;
                showStr = data.slice(0, data.length -1);
                this.writeEmitter.fire(`\x1b[41m${showStr}\x1b[0m\n`);
                return;
            }
            this.writeEmitter.fire(`\x1b[41m${data}\x1b[0m\n`);
        });
        setTimeout(() => {this.procHandle.stdin._write(this.para.stdinCmd, 'utf-8', () => {});}, 1000);
    }

    public genTtyOption() : any {
        const writeEmitter = this.writeEmitter;
        const closeEmitter = this.colseEmitter;
        let line = '';
        const pty = {
                onDidWrite: writeEmitter.event,
                onDidClose: closeEmitter.event,
                open: () => writeEmitter.fire('Wellcome to CLI ENV\r\n\r\n'),
                close: () => { 

                },
                handleInput: (data: string) => {                    
                    console.log(data);
                    if (data === '\r') { // Enter
                        writeEmitter.fire(`\r\n`);
                        this.ttyInputProc(line);
                        line = '';
                        return;
                    }
                    if (data === '\x7f') { // Backspace
                        if (line.length === 0) {
                            return;
                        }
                        line = line.substr(0, line.length - 1);
                        // Move cursor backward
                        writeEmitter.fire('\x1b[D');
                        // Delete character
                        writeEmitter.fire('\x1b[P');
                        return;
                    }
                    if (data === '\x1b[A') // UP-key
                    {
                        return;
                    }
                    if (data === '\x1b[B') // Down-key
                    {
                        return;
                    }
                    if (data === '\x1b[C') // Right-key
                    {
                        return;
                    }
                    if (data === '\x1b[D') // Left-key
                    {
                        return;
                    }
                    line += data;
                    writeEmitter.fire(data);
                },
        };
        return pty;
    }

    //
    public ttyInputProc(line : string) : void {
        if (this.procHandle != null) {
            this.procHandle.stdin._write(line+"\n", 'utf-8', () => {});
        }
        return;
    }

}