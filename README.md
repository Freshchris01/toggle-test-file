# toggle-test-file README

This is a vscode extension, which helps you navigate to test files directly.
The current version only supports **Ruby** and doesn't provide the possibility for any configuration.

## Features

When a source file is opened in vscode, trigger the **Toggle Test File** command and the extension will search for the corresponding source/test file and open it.

When source files with the same name exist (in different directories), the user can select the right one.

## Requirements

For now only ruby is supported.

## Extension Settings

* Default file ending can be changed
* A test file suffix (e.g. "_spec") can be specified