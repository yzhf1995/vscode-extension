'use strict'
import * as vscode from 'vscode';
import * as cp from 'child_process';
import { PathLike } from 'node:fs';

export interface ttyConfig {
    exePath : string; // exe运行路径
    xArgs : Array<string>; // exe运行参数
    workDir : string; // exe运行路径
    stdinCmd : string;
}

export class persudoTty {        
    public m_tty : Object | null; // tty允许null类型
    public m_para : ttyConfig; // para允许null类型
    public m_name : string;
    public m_proc_handle : cp.ChildProcessWithoutNullStreams;
    private m_write_emit : vscode.EventEmitter<string>;
    private m_colse_emit : vscode.EventEmitter<vscode.TerminalDimensions>;
    private m_terminal : vscode.Terminal;

    constructor (name : string, para : ttyConfig) {
        this.m_tty = null;
        this.m_para = para;
        this.m_name = name;
        this.m_proc_handle = <cp.ChildProcessWithoutNullStreams>{};
        this.m_write_emit = new vscode.EventEmitter<string>();
        this.m_colse_emit = new vscode.EventEmitter<vscode.TerminalDimensions>();
        this.m_terminal = <any>null;
    }

    public startProc() : void {
        this.m_proc_handle = cp.spawn(this.m_para.exePath, this.m_para.xArgs, {
            cwd : this.m_para.workDir,
            env : process.env,
            stdio : ['pipe','pipe', 'pipe']
        });
        const pty =  this.genTtyOption();
        if (this.m_terminal === null || this.m_terminal.exitStatus === undefined) {
            this.m_terminal = vscode.window.createTerminal({ name: `${this.m_name}`, pty});
        }
		(this.m_terminal).show();
        // stdin/out
        this.m_proc_handle.stdout.on("data", (data : string) => {
            console.log(data);
            this.m_write_emit.fire(`${data}`);
        });
        this.m_proc_handle.stderr.on("data", (data : string) => {
            if (`${data}`.endsWith('\n')) {
                let show_str : string;
                show_str = data.slice(0, data.length -1);
                this.m_write_emit.fire(`\x1b[41m${show_str}\x1b[0m\n`);
                return;
            }
            this.m_write_emit.fire(`\x1b[41m${data}\x1b[0m\n`);
        });
        setTimeout(() => {this.m_proc_handle.stdin._write(this.m_para.stdinCmd, 'utf-8', () => {})}, 1000);
    }

    public genTtyOption() : any {
        const writeEmitter = this.m_write_emit;
        const closeEmitter = this.m_colse_emit;
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
        if (this.m_proc_handle != null) {
            this.m_proc_handle.stdin._write(line+"\n", 'utf-8', () => {});
        }
        return;
    }

}