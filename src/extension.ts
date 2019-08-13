// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as path from 'path';
import { Uri } from 'vscode';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Toggle Test File is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('extension.toggleTestFile', () => {
		// The code you place here will be executed every time your command is executed
    
    let currentlyOpenTabfilePath: string = vscode.window.activeTextEditor!.document.fileName;
    let currentlyOpenTabfileName = path.basename(currentlyOpenTabfilePath).split('.')[0];

    // skip when no file is selected or file is new and unsaved
    if(currentlyOpenTabfilePath != "rendererLog" && !currentlyOpenTabfileName.includes("Untitled-")){

      // is the current file a test file? If so, adjust search pattern
      let searchPattern : string = currentlyOpenTabfileName.includes('_spec') ?
        `app/**/${currentlyOpenTabfileName.replace('_spec', '')}.rb` :
        `spec/**/${currentlyOpenTabfileName}_spec.rb`;

      // find file according to pattern
      vscode.workspace.findFiles(searchPattern).then(result => {
        if(result.length == 0){
          vscode.window.showInformationMessage("No associated file found..");
        }else if(result.length > 1){
          vscode.window.showQuickPick(result.map(res => res.path)).then(item =>{
            if(!item){
              vscode.window.showInformationMessage("No File selected!"); 
            }else{
              openFile(Uri.parse(item))
            }
          });
        }else {
          openFile(result[0]);
        }
      });
      
    }else{
      vscode.window.showInformationMessage("No File selected!");
    }    
	});

	context.subscriptions.push(disposable);
}
function openFile(uriToFile: Uri){

          // check if file is already opened
          vscode.workspace.textDocuments.forEach(document =>{
            if(document.fileName === uriToFile.path){

              vscode.window.visibleTextEditors.map(editor => {
                if(editor.document.fileName === uriToFile.path){
                  vscode.window.showTextDocument(uriToFile, {viewColumn: editor.viewColumn});
                }
              });
            }
          });
          vscode.workspace.openTextDocument(uriToFile).then(doc => vscode.window.showTextDocument(doc))
        }

// this method is called when your extension is deactivated
export function deactivate() {}
