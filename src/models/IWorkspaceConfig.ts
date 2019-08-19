import { WorkspaceConfiguration } from "vscode";

export interface IWorkspaceConfig{
  workspaceConfig: WorkspaceConfiguration;
  fileEnding: string,
  testFileSuffix: string
}