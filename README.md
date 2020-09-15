# Toggle Test File README

This is a vscode extension, which helps you switch between source files and test files.
The current version only supports **Ruby**, but the file-endings can be costumized, as well as a testing file suffix.

## Features

When a source file is opened in vscode, trigger the **Toggle Test File** command and the extension will search for the corresponding source/test file and open it.

When source files with the same name exist (in different directories), the user can select the right one.

Copy test commands to the clipboard.

## Requirements

For now only ruby is supported.

## Extension Settings

* Default file ending can be changed
* A test file suffix (e.g. "_spec") can be specified