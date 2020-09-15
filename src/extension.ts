// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as path from 'path';
import { Uri } from 'vscode';
import * as copy from 'copy-paste';
import { IWorkspaceConfig } from './models/IWorkspaceConfig';

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

    // skip when no file is selected or file is new and unsaved
    let currentlyOpenTabfilePath = vscode.window.activeTextEditor!.document.fileName;
    if(isValidFileOpen(currentlyOpenTabfilePath)){

      let currentlyOpenTabfileName = path.basename(currentlyOpenTabfilePath).split('.')[0];

      // load configs
      let config: IWorkspaceConfig = loadConfig();

      // is the current file a test file? If so, adjust search pattern
      let searchPattern : string = currentlyOpenTabfileName.includes(config.testFileSuffix) ?
        `app/**/${currentlyOpenTabfileName.replace(config.testFileSuffix, '') + config.fileEnding}` :
        `spec/**/${currentlyOpenTabfileName + config.testFileSuffix + config.fileEnding}`;

      // find file according to pattern
      vscode.workspace.findFiles(searchPattern).then(result => {
        if(result.length == 0){
          vscode.window.showInformationMessage('No associated file found..');
        }else if(result.length > 1){
          vscode.window.showQuickPick(result.map(res => res.path)).then(item =>{
            if(!item){
              vscode.window.showInformationMessage('No File selected!'); 
            }else{
              openFile(Uri.parse(item))
            }
          });
        }else {
          openFile(result[0]);
        }
      });
      
    }else{
      vscode.window.showInformationMessage('No File selected!');
    }    
  });
  
  let runTestFile = vscode.commands.registerCommand('extension.runTestFile', () => {
    copyTestCommand('rspec')
  });
  
  let runTesstFileSpring = vscode.commands.registerCommand('extension.runTestFileSpring', () => {
    copyTestCommand('bundle exec spring rspec')
  });

  context.subscriptions.push(disposable);
  context.subscriptions.push(runTestFile);
  context.subscriptions.push(runTesstFileSpring);
}

function copyTestCommand(prefix: string) {
  let currentlyOpenTabfilePath = vscode.window.activeTextEditor!.document.fileName;
  if(isValidFileOpen(currentlyOpenTabfilePath)){

    let currentlyOpenTabfileName = path.basename(currentlyOpenTabfilePath).split('.')[0];

    let config: IWorkspaceConfig = loadConfig();

    if(isValidFileOpen(currentlyOpenTabfileName) && currentlyOpenTabfileName.includes(config.testFileSuffix)){
      let command = `${prefix} ${currentlyOpenTabfilePath}`;
      copy.copy(command);
      vscode.window.showInformationMessage('Test command copied!',)
    }else{
      vscode.window.showInformationMessage('No valid testing File selected!');
    }
  }
}

function isValidFileOpen(currentlyOpenTabfilePath: string): boolean{
  let currentlyOpenTabfileName = path.basename(currentlyOpenTabfilePath).split('.')[0];

  return currentlyOpenTabfilePath != 'rendererLog' && !currentlyOpenTabfileName.includes('Untitled-')
}

function loadConfig():IWorkspaceConfig{
  let config = {} as IWorkspaceConfig;
  config.workspaceConfig = vscode.workspace.getConfiguration('toggleTestFile')
  config.fileEnding = config.workspaceConfig.get('fileEnding') || '.rb';
  config.testFileSuffix = config.workspaceConfig.get('testFileSuffix') || '_spec';
  return config;
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
