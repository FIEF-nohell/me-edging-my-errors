import * as vscode from 'vscode';
import * as path from 'path';

export function activate(context: vscode.ExtensionContext) {
    // This will hold the reference to our webview panel
    let webviewPanel: vscode.WebviewPanel | undefined;

    // Function to create a new webview panel
    function createWebviewPanel() {
        if (webviewPanel) {
            webviewPanel.reveal(vscode.ViewColumn.One);
        } else {
            webviewPanel = vscode.window.createWebviewPanel(
                'errorImage',
                'Error Image Display',
                vscode.ViewColumn.One,
                {
                    // Enable scripts in the webview
                    enableScripts: true,
                    // Restrict the webview to only loading content from our extension's `media` directory.
                    localResourceRoots: [vscode.Uri.file(path.join(context.extensionPath, 'media'))]
                }
            );
            webviewPanel.onDidDispose(() => {
                // When the panel is closed, set its reference to undefined
                webviewPanel = undefined;
            });
        }
        return webviewPanel;
    }

    // Update the webview content based on the current error count
    function updateWebviewContent(errorCount: number) {
        if (!webviewPanel) {
            webviewPanel = createWebviewPanel();
        }
        const imageUrl = getImageForErrors(webviewPanel.webview, errorCount);
        webviewPanel.webview.html = getWebviewContent(imageUrl, errorCount);
    }

    // Function to update the error count and the webview content
    function updateErrorCountAndContent() {
        const allDiagnostics = vscode.languages.getDiagnostics();
        let errorCount = 0;
        allDiagnostics.forEach(([uri, diagnostics]) => {
            diagnostics.forEach(diagnostic => {
                if (diagnostic.severity === vscode.DiagnosticSeverity.Error) {
                    errorCount++;
                }
            });
        });
        updateWebviewContent(errorCount);
    }

    // Register a command to manually refresh the error image display
    let disposable = vscode    .commands.registerCommand('extension.refreshErrorImage', updateErrorCountAndContent);

    context.subscriptions.push(disposable);

    // Listen for any change in the diagnostics and update the error count and content
    vscode.languages.onDidChangeDiagnostics(updateErrorCountAndContent);

    // Initial update on activation
    updateErrorCountAndContent();
}

// Function to get the image URL based on the error count
function getImageForErrors(webview: vscode.Webview, errorCount: number): string {
    let imageUrl: string;

    if (errorCount === 0) {
        imageUrl = 'https://s9.gifyu.com/images/SUsqq.gif';
    } else if (errorCount >= 1 && errorCount <= 3) {
        imageUrl = 'https://s9.gifyu.com/images/SUsqq.gif';
    } else if (errorCount >= 4 && errorCount <= 6) {
        imageUrl = 'https://s9.gifyu.com/images/SUsqv.gif';
    } else if (errorCount >= 7 && errorCount <= 9) {
        imageUrl = 'https://s9.gifyu.com/images/SUsqk.gif';
    } else if (errorCount >= 10 && errorCount <= 12) {
        imageUrl = 'https://s9.gifyu.com/images/SUsq7.gif';
    } else if (errorCount >= 13 && errorCount <= 15) {
        imageUrl = 'https://s9.gifyu.com/images/SUsqm.gif';
    } else {
        imageUrl = 'https://j.gifs.com/OMOZMG.gif';
    }

    // Check if the imageUrl is a local path and convert it to a webview Uri, otherwise, return the external link directly
    if (imageUrl.startsWith('https://')) {
        return imageUrl;
    } else {
        const imagePath = vscode.Uri.file(path.join(__dirname, imageUrl));
        return webview.asWebviewUri(imagePath).toString();
    }
}


// Function to generate the webview HTML content
function getWebviewContent(imageUrl: string, errorCount: number): string {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Error Image Display</title>
</head>
<body>
    <h1>Error Count: ${errorCount}</h1>
    <img src="${imageUrl}" alt="Error Image"/>
</body>
</html>`;
}

