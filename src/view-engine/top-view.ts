'use strict'
import * as vscode from 'vscode';
import * as path from 'path';
const Highcharts = require('highcharts');

export class topView {
    public m_context : vscode.ExtensionContext;

    constructor (context: vscode.ExtensionContext)
    {
        this.m_context = context;
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
                enableScripts: true
            }
        );

        // Get path to resource on disk
        const onDiskPath = vscode.Uri.file(
            path.join(this.m_context.extensionPath, 'media/imgs', 'MCS.png')
        );
        const jsOnDiskPath = vscode.Uri.file(
            path.join(this.m_context.extensionPath, 'media/webview-demo', 'demo.js')
        );
        const highchartOnDiskPath =  vscode.Uri.file(
            path.join(this.m_context.extensionPath, 'node_modules/highcharts', 'highcharts.js')
        );

        // And get the special URI to use with the webview
        const iconSrc = panel.webview.asWebviewUri(onDiskPath);
        const jsSrc = panel.webview.asWebviewUri(jsOnDiskPath);
        const highChartSrc =  panel.webview.asWebviewUri(highchartOnDiskPath);
        panel.webview.html = `
        <!DOCTYPE html>
        <html lang="zh">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Cat Coding</title>
                <script src="http://cdn.hcharts.cn/jquery/jquery-1.8.3.min.js"></script>
            </head>
            <body>
                <img src="${iconSrc}" width="300" />
                <h1 id="lines-of-code-counter">WebView Demo</h1>    
                <div id="container"></div>     
                <script src="${highChartSrc}"></script>         
                <script src="${jsSrc}"></script>
            </body>
        </html>
        `;
    }

}