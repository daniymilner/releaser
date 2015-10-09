# Releaser
Module for release project. This package works with bower.json and package.json

## Install

```
npm i -g git+ssh://git@github.com:daniymilner/releaser.git
```

## Usage

```
release [type] [branch] [options]
```

### Types

 * `--patch`, `--minor`, `--major` - Increase specific version

### Branch

 * `--branch [name]` - Set local branch name

### Options

 * `--tag` - Create git tag
 * `--push` - Push to remote repo
 * `--master` - Merge changes to master
