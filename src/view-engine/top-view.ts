'use strict';
import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
export class TopView {
    public context : vscode.ExtensionContext;
    public htmlPath : string;
    constructor (context: vscode.ExtensionContext)
    {
        this.context = context;
        this.htmlPath = "./media/webview-demo/index.html";
    }

    /**
     * name
     */
    public createMainView() {     
        console.log('demo hello world');
		const panel = vscode.window.createWebviewPanel(
            'catCoding',
            'Cat Coding',
            vscode.ViewColumn.One,
            {
                // Enable scripts in the webview
                enableScripts: true,
                retainContextWhenHidden: true
            }
        );

        panel.webview.html = getWebViewContent(this.context, this.htmlPath);
    }

}

function getWebViewContent(context : vscode.ExtensionContext, templatePath:string) {
	const resourcePath = path.join(context.extensionPath, templatePath);
	const dirPath = path.dirname(resourcePath);
	let html = fs.readFileSync(resourcePath, 'utf-8');
	// vscode不支持直接加载本地资源，需要替换成其专有路径格式，这里只是简单的将样式和JS的路径替换
	html = html.replace(/(<link.+?href="|<script.+?src="|<img.+?src=")(.+?)"/g, (m, $1, $2) => {
		return $1 + vscode.Uri.file(path.resolve(dirPath, $2)).with({ scheme: 'vscode-resource' }).toString() + '"';
	});
	return html;
}