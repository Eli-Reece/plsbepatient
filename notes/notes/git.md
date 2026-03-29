+++
date = '2023-08-04T17:36:51-08:00'
title = 'Git'
toc = true
tocBorder = true
+++
Status: IP
## Creating and Cloning
### Creating a new repo
- `git init` creates .git locally
### Cloning an existing repo
- `git clone` will create a replica of an existing repository
## Local Changes
### Staged
- un-staged changes refer to changes that have been made to files in the working directory yet marked to be included in the next commit.
- staged changes refer to changes that have been marked to be included in the next commit.
### Add
- `git add` will add changes to the staging area
### Status
- `git status` to list all new or modified files
### Diff
- `git diff` to view changes between staged files and unstaged changes
- `git diff --cached` to view changes between staged files and the last commit
### Remove
- `git rm` to remove files from the working directory and staging area
### Commit
- `git commit -m "<msg>` to commit changes to the repository
### History
- `git log` to view commit history
### remotes
- remote repositories are versions of the repository that are hosted on the internet or network somewhere
- `git remote -v` to view remote repositories
### Pull
- `git pull` to fetch and merge changes from the remote repository
### Push
- `git push` to push changes to the remote repository
## Branches