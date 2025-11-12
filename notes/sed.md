+++
date = '2023-12-11T20:27:14-08:00'
draft = false
title = 'Quick sed reference'
toc = true
tocBorder = true
+++

sed (stream editor) is a command-line utility for parsing and transforming text

## Usage
```bash
$ sed 'command' filename
```
## Substitution:
- Replaces the first occurrence on each line

Suppose you have a file named *names.txt*:
```txt
John Smith
Jane Doe
John Johnson
```
To replace the first occurrence of "John" with "Jonathan" on each line:
```bash
$ sed 's/John/Jonathan/' names.txt
```
Output:
```txt
Jonathan Smith
Jane Doe
Jonathan Johnson
```
## Global substitution:
- Replaces all occurrences of a pattern in each line

Using the same *names.txt* file:
```bash
$ sed 's/John/Jonathan/g' names.txt
```
Output:
```txt
Jonathan Smith
Jane Doe
Jonathan Jonathanson
```

## Delete lines:
Consider a log file *app.log*:
```txt
INFO: Application started
ERROR: Database connection failed
INFO: User logged in
ERROR: Invalid input
```

To remove all error lines:
```bash
$ sed '/ERROR/d' app.log
```
Output:
```txt
INFO: Application started
INFO: User logged in
```
## In-place editing:
- The `-i` option allows sed to modify files directly

Let's say you have a configuration file named `*config.txt*:
```txt
Server Configuration
HOST=localhost
PORT=8080
DEBUG=true
ENVIRONMENT=development
```
To change the development environment to production, you could use:
```bash
$ sed -i 's/development/production/' config.txt
```
After running this command, `*config.txt* will be modified directly:
```txt
# Server Configuration
HOST=localhost
PORT=8080
DEBUG=true
ENVIRONMENT=production
```
## Using find and exec with sed

The `find` command can be used together with `sed` to apply transformations=
 to multiple files in a directory structure. This is particularly useful wh=
en you need to make changes across many files at once.

Syntax:
```bash
$ find [path] [expression] -exec sed [sed_options] [sed_script] {} +
```

Example:

Let's say you have a project directory with multiple *.txt* files, and you =
want to replace all occurrences of "colour" with "color" in these files:

```bash
$ find . -name "*.txt" -exec sed -i 's/colour/color/g' {} +
```

Breakdown:
- `find .`: Start searching in the current directory
- `-name "*.txt"`: Look for files ending with .txt
- `-exec`: Execute a command on each file found
- `sed -i 's/colour/color/g'`: The sed command to run (in-place edit, globa=
l substitution)
- `{} +`: `{}` is replaced with the filename, and `+` tells find to pass as=
 many filenames as possible to one invocation of sed

More examples:

1. Replace "foo" with "bar" in all .c files, creating backups:
   ```bash
   $ find . -name "*.php" -exec sed -i.bak 's/foo/bar/g' {} +
   ```

2. Delete all lines containing "DEBUG" in .log files:
   ```bash
   $ find /var/log -name "*.log" -exec sed -i '/DEBUG/d' {} +
   ```

3. Add a new line after each line containing "START" in .conf files:
   ```bash
   $ find /etc -name "*.conf" -exec sed -i '/START/a\New line here' {} +
   ```

4. Combine multiple sed operations:
   ```bash
   $ find . -type f -exec sed -i -e 's/old/new/g' -e '/pattern/d' {} +