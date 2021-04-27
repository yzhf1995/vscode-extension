'use strict'
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import {persudoTty, ttyConfig} from './subprocess/persudoTty';
import {topView} from './view-engine/top-view';
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
const ttyCfg : ttyConfig = {
	exePath : `D:\\TCL\\bin\\tclsh86t.exe`,
	xArgs : [],
	workDir : ".",
	stdinCmd : "set ::tcl_interactive 1;puts \"\";\n"
};

export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "webview-demo" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('webview-demo.helloWorld', () => {
		// The code you place here will be executed every time your command is executed

		// Display a message box to the user
		vscode.window.showInformationMessage('Welcome My First Extenstion');
	});
	context.subscriptions.push(disposable);

	let startChildProcess = vscode.commands.registerCommand('webview-demo.startChildProcess', () => {
		const extensionTty : persudoTty = new persudoTty("demo", ttyCfg);
		extensionTty.startProc();
		vscode.window.showInformationMessage('Start child process successfully!');
	})
	context.subscriptions.push(startChildProcess);

	let startWebView = vscode.commands.registerCommand('webview-demo.startWebview', () => {
		const view_demo : topView = new topView(context);
		view_demo.createMainView();
	})
	context.subscriptions.push(startWebView);
}

// this method is called when your extension is deactivated
export function deactivate() {}
