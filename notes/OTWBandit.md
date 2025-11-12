+++
date = '2024-05-10T21:15:10-08:00'
draft = false
title = 'Over The Wire Bandit (In Progress)'
toc = true
tocBorder = true
+++
# In Progress

## Level 0
The goal of this level is for you to log into the game using SSH. The host to which you need to connect is **bandit.labs.overthewire.org**, on port 2220. The username is **bandit0** and the password is **bandit0**.

```bash
ssh bandit.labs.overthewire.org -p 2220 -l bandit0
```
### Further Info on Login
```bash
* USERNAMES are somegame0, somegame1, ...
* Most LEVELS are stored in /somegame/.
* PASSWORDS for each level are stored in /etc/somegame_pass/.

Write-access to homedirectories is disabled. It is advised to create a
working directory with a hard-to-guess name in /tmp/.

You can use the command "mktemp -d" in order to generate a random and hard to guess directory in /tmp/.
```
## Level 0->1
The password for the next level is stored in a file called **readme** located in the home directory. Use this password to log into bandit1 using SSH. Whenever you find a password for a level, use SSH (on port 2220) to log into that level and continue the game.
```bash
bandit0@bandit:~$ ls
readme
bandit0@bandit:~$ cat readme
Congratulations on your first steps into the bandit game!!
Please make sure you have read the rules at https://overthewire.org/rules/
If you are following a course, workshop, walkthrough or other educational activity,
please inform the instructor about the rules as well and encourage them to
contribute to the OverTheWire community so we can keep these games free!

The password you are looking for is: ZjLjTmM6FvvyRnrb2rfNWOZOTa6ip5If
```

```bash
ssh bandit.labs.overthewire.org -p 2220 -l bandit1
bandit1@bandit.labs.overthewire.org's password: ZjLjTmM6FvvyRnrb2rfNWOZOTa6ip5If
```

## Level 1->2
The password for the next level is stored in a file called **-** located in the home directory
```bash
bandit1@bandit:~$ ls -la
total 24
-rw-r-----  1 bandit2 bandit1   33 Sep 19 07:08 -
drwxr-xr-x  2 root    root    4096 Sep 19 07:08 .
drwxr-xr-x 70 root    root    4096 Sep 19 07:09 ..
-rw-r--r--  1 root    root     220 Mar 31  2024 .bash_logout
-rw-r--r--  1 root    root    3771 Mar 31  2024 .bashrc
-rw-r--r--  1 root    root     807 Mar 31  2024 .profile
bandit1@bandit:~$ cat ./-
263JGJPfgU6LtdEvgfWU1XP5yac29mFx
```

```bash
ssh bandit.labs.overthewire.org -p 2220 -l bandit2
bandit1@bandit.labs.overthewire.org's password: 263JGJPfgU6LtdEvgfWU1XP5yac29mFx
```

## Level 2->3
The password for the next level is stored in a file called **spaces in this filename** located in the home directory
```bash
bandit2@bandit:~$ ls -la
total 24
drwxr-xr-x  2 root    root    4096 Sep 19 07:08 .
drwxr-xr-x 70 root    root    4096 Sep 19 07:09 ..
-rw-r--r--  1 root    root     220 Mar 31  2024 .bash_logout
-rw-r--r--  1 root    root    3771 Mar 31  2024 .bashrc
-rw-r--r--  1 root    root     807 Mar 31  2024 .profile
-rw-r-----  1 bandit3 bandit2   33 Sep 19 07:08 spaces in this filename
bandit2@bandit:~$ cat spaces\ in\ this\ filename
MNk8KNH3Usiio41PRUEoDFPqfxLPlSmx
```

```bash
ssh bandit.labs.overthewire.org -p 2220 -l bandit3
bandit1@bandit.labs.overthewire.org's password: MNk8KNH3Usiio41PRUEoDFPqfxLPlSmx
```

## Level 3->4
The password for the next level is stored in a hidden file in the **inhere** directory.
```bash
bandit3@bandit:~$ ls
inhere
bandit3@bandit:~$ cd inhere/
bandit3@bandit:~/inhere$ ls
bandit3@bandit:~/inhere$ ls -la
total 12
drwxr-xr-x 2 root    root    4096 Sep 19 07:08 .
drwxr-xr-x 3 root    root    4096 Sep 19 07:08 ..
-rw-r----- 1 bandit4 bandit3   33 Sep 19 07:08 ...Hiding-From-You
bandit3@bandit:~/inhere$ cat ...Hiding-From-You
2WmrDFRmJIq3IPxneAaMGhap0pFhF3NJ
```

```bash
ssh bandit.labs.overthewire.org -p 2220 -l bandit4
bandit1@bandit.labs.overthewire.org's password: 2WmrDFRmJIq3IPxneAaMGhap0pFhF3NJ
```

## Level 4->5
The password for the next level is stored in the only human-readable file in the **inhere** directory. Tip: if your terminal is messed up, try the “reset” command
```bash
bandit4@bandit:~$ cd inhere/
bandit4@bandit:~/inhere$ ls -la
total 48
drwxr-xr-x 2 root    root    4096 Sep 19 07:08 .
drwxr-xr-x 3 root    root    4096 Sep 19 07:08 ..
-rw-r----- 1 bandit5 bandit4   33 Sep 19 07:08 -file00
-rw-r----- 1 bandit5 bandit4   33 Sep 19 07:08 -file01
-rw-r----- 1 bandit5 bandit4   33 Sep 19 07:08 -file02
-rw-r----- 1 bandit5 bandit4   33 Sep 19 07:08 -file03
-rw-r----- 1 bandit5 bandit4   33 Sep 19 07:08 -file04
-rw-r----- 1 bandit5 bandit4   33 Sep 19 07:08 -file05
-rw-r----- 1 bandit5 bandit4   33 Sep 19 07:08 -file06
-rw-r----- 1 bandit5 bandit4   33 Sep 19 07:08 -file07
-rw-r----- 1 bandit5 bandit4   33 Sep 19 07:08 -file08
-rw-r----- 1 bandit5 bandit4   33 Sep 19 07:08 -file09
bandit4@bandit:~/inhere$ find . -type f -exec sh -c 'echo "\n{}"; cat {}; echo' \;

./-file08
nS
��]
We˥mO�D

./-file02
3��Ʈ#Y-6cIR-��:

./-file09
2g�?�`>5HYA��8g`0$`

./-file01
i�,Λ�Y��%A�B��

./-file00
p��y,�jo.at:uf^@

./-file05
}���W>�#lk���yE�

./-file07
4oQYVPkxZOOEOO5pTW81FB8j8lxXGUQw


./-file03
�/
  ��qGi�,2Yb�
             d

./-file06
6�]�\$1%��o@�b/��

./-file04
rOx��0~ey
�c~���1
bandit4@bandit:~/inhere$
```

```bash
ssh bandit.labs.overthewire.org -p 2220 -l bandit5
bandit1@bandit.labs.overthewire.org's password: 4oQYVPkxZOOEOO5pTW81FB8j8lxXGUQw
```

## Level 5->6
The password for the next level is stored in a file somewhere under the **inhere** directory and has all of the following properties:
- human-readable
- 1033 bytes in size
- not executable
```bash
bandit5@bandit:~$ ls
inhere
bandit5@bandit:~$ cd inhere/
bandit5@bandit:~/inhere$ ls -la
total 88
drwxr-x--- 22 root bandit5 4096 Sep 19 07:08 .
drwxr-xr-x  3 root root    4096 Sep 19 07:08 ..
drwxr-x---  2 root bandit5 4096 Sep 19 07:08 maybehere00
drwxr-x---  2 root bandit5 4096 Sep 19 07:08 maybehere01
drwxr-x---  2 root bandit5 4096 Sep 19 07:08 maybehere02
drwxr-x---  2 root bandit5 4096 Sep 19 07:08 maybehere03
drwxr-x---  2 root bandit5 4096 Sep 19 07:08 maybehere04
drwxr-x---  2 root bandit5 4096 Sep 19 07:08 maybehere05
drwxr-x---  2 root bandit5 4096 Sep 19 07:08 maybehere06
drwxr-x---  2 root bandit5 4096 Sep 19 07:08 maybehere07
drwxr-x---  2 root bandit5 4096 Sep 19 07:08 maybehere08
drwxr-x---  2 root bandit5 4096 Sep 19 07:08 maybehere09
drwxr-x---  2 root bandit5 4096 Sep 19 07:08 maybehere10
drwxr-x---  2 root bandit5 4096 Sep 19 07:08 maybehere11
drwxr-x---  2 root bandit5 4096 Sep 19 07:08 maybehere12
drwxr-x---  2 root bandit5 4096 Sep 19 07:08 maybehere13
drwxr-x---  2 root bandit5 4096 Sep 19 07:08 maybehere14
drwxr-x---  2 root bandit5 4096 Sep 19 07:08 maybehere15
drwxr-x---  2 root bandit5 4096 Sep 19 07:08 maybehere16
drwxr-x---  2 root bandit5 4096 Sep 19 07:08 maybehere17
drwxr-x---  2 root bandit5 4096 Sep 19 07:08 maybehere18
drwxr-x---  2 root bandit5 4096 Sep 19 07:08 maybehere19
bandit5@bandit:~/inhere$ find . -size 1033c
./maybehere07/.file2
bandit5@bandit:~/inhere$ cat maybehere07/.file2
HWasnPhtq9AVKe0dmk45nxy20cvUa6EG
```

```bash
ssh bandit.labs.overthewire.org -p 2220 -l bandit6
bandit1@bandit.labs.overthewire.org's password: HWasnPhtq9AVKe0dmk45nxy20cvUa6EG
```
## Level 6->7
The password for the next level is stored **somewhere on the server** and has all of the following properties:
- owned by user bandit7
- owned by group bandit6
- 33 bytes in size
```bash
bandit6@bandit:~$ ls
bandit6@bandit:~$ ls -la
total 20
drwxr-xr-x  2 root root 4096 Sep 19 07:08 .
drwxr-xr-x 70 root root 4096 Sep 19 07:09 ..
-rw-r--r--  1 root root  220 Mar 31  2024 .bash_logout
-rw-r--r--  1 root root 3771 Mar 31  2024 .bashrc
-rw-r--r--  1 root root  807 Mar 31  2024 .profile
bandit6@bandit:~$ cd /
bandit6@bandit:/$ find . -size 33c -user bandit7 -group bandit6 2>/dev/null
./var/lib/dpkg/info/bandit7.password
bandit6@bandit:/$ cat var/lib/dpkg/info/ba
bandit7.password           base-files.preinst         base-passwd.postrm         bash-completion.postinst   bash.postinst
base-files.conffiles       base-files.prerm           base-passwd.preinst        bash-completion.postrm     bash.postrm
base-files.list            base-files.triggers        base-passwd.templates      bash-completion.preinst    bash.prerm
base-files.md5sums         base-passwd.list           bash-completion.conffiles  bash.conffiles
base-files.postinst        base-passwd.md5sums        bash-completion.list       bash.list
base-files.postrm          base-passwd.postinst       bash-completion.md5sums    bash.md5sums
bandit6@bandit:/$ cat var/lib/dpkg/info/bandit7.password
morbNTDkSW6jIlUc0ymOdMaLnOlFVAaj
```

```bash
ssh bandit.labs.overthewire.org -p 2220 -l bandit7
bandit1@bandit.labs.overthewire.org's password: morbNTDkSW6jIlUc0ymOdMaLnOlFVAaj
```
## Level 7->8
The password for the next level is stored in the file **data.txt** next to the word **millionth**
```bash
bandit7@bandit:~$ grep -nRHi millionth
data.txt:1457:millionth	dfwvzFQi4mU0wfNbFOe9RoWskMLg7eEc
```

```bash
ssh bandit.labs.overthewire.org -p 2220 -l bandit8
bandit1@bandit.labs.overthewire.org's password: dfwvzFQi4mU0wfNbFOe9RoWskMLg7eEc
```
## Level 8->9
The password for the next level is stored in the file **data.txt** and is the only line of text that occurs only once
```bash
bandit8@bandit:~$ ls
data.txt
bandit8@bandit:~$ sort data.txt | uniq -u
4CKMh1JI91bUIZZPXDqGanal4xvAg0JM
```

```bash
ssh bandit.labs.overthewire.org -p 2220 -l bandit9
bandit1@bandit.labs.overthewire.org's password: 4CKMh1JI91bUIZZPXDqGanal4xvAg0JM
```
## Level 9->10
The password for the next level is stored in the file **data.txt** in one of the few human-readable strings, preceded by several ‘=’ characters.
> First time, I ran cat on the file can could see the password lol but I added 2 ways to find it
```bash
bandit9@bandit:~$ grep -nRHi --text "===="
data.txt:7:D]�
              �h#!���J�s�Vzl7�POl%Y]�a^�vToD�@T�N��8g�b}?
Q#g�m1x}========== theѦ+�id��)F1>)٘SK�PZ�t&xs肉WB/2ÜB�	Ź/Bjɢ��<���<���/d|
                                                                          -��
data.txt:29:#i�u=
                 7֣�)�ջش�5bBKK�}x>}:4Rl_7gH��:274��Fy
�6��&�zB�$l_G�p�qI.X��0�H��Tw�m⧫�3m�0���L�JprD========== passwordi	L�~ˏ<@Ȅh$�%Q5�Dk |3
~��f;�9��P#t+Pe�΢쵟s4:���#U\
OqDf�.��zmnf&v�:FX �g�K�b�
                  �I�Bi>�Y
Еk�	$nXT=~}*4a2?TO"'�&J~fDV3========== isd5z(�#�s!10&p��q�
n���F                                                         data.txt:67:
�éT:k��A�2�cɐ�#g+;YA_ekr�X53|f8+e9�bR+�̊~&Oiu?Vh�M�}^�Qp^�==6�!��T:��ʨ"u���-t\fg
 ]󈍅(.ۍg:7n�np��� ���D`v�SQ�<]`�@�H Uum�BiA�堵�O���D9========== FGUW5ilLVJrxX9kMYMmlN4MgbpfMiqey

or

bandit9@bandit:~$ strings data.txt | grep "==="
}========== the
3JprD========== passwordi
~fDV3========== is
D9========== FGUW5ilLVJrxX9kMYMmlN4MgbpfMiqey
```

```bash
ssh bandit.labs.overthewire.org -p 2220 -l bandit10
bandit1@bandit.labs.overthewire.org's password: FGUW5ilLVJrxX9kMYMmlN4MgbpfMiqey
```
## Level 10->11
The password for the next level is stored in the file **data.txt**, which contains base64 encoded data
```bash
bandit10@bandit:~$ cat data.txt | base64 -d
The password is dtR173fZKb0RRsDFSGsg2RWnpNVj3qRr
```

```bash
ssh bandit.labs.overthewire.org -p 2220 -l bandit11
bandit1@bandit.labs.overthewire.org's password: dtR173fZKb0RRsDFSGsg2RWnpNVj3qRr
```
## Level 11->12
The password for the next level is stored in the file **data.txt**, where all lowercase (a-z) and uppercase (A-Z) letters have been rotated by 13 positions

From Wikipedia (https://en.wikipedia.org/wiki/ROT13):
```bash
to encrypt the string "Pack My Box With Five Dozen Liquor Jugs" in ROT13:
$ # Map upper case A-Z to N-ZA-M and lower case a-z to n-za-m
$ tr 'A-Za-z' 'N-ZA-Mn-za-m' <<< "Pack My Box With Five Dozen Liquor Jugs"
Cnpx Zl Obk Jvgu Svir Qbmra Yvdhbe Whtf
```

```bash
bandit11@bandit:~$ cat data.txt
Gur cnffjbeq vf 7k16JArUVv5LxVuJfsSVdbbtaHGlw9D4
bandit11@bandit:~$ cat data.txt | tr 'A-Za-z' 'N-ZA-Mn-za-m'
The password is 7x16WNeHIi5YkIhWsfFIqoognUTyj9Q4
```

```bash
ssh bandit.labs.overthewire.org -p 2220 -l bandit12
bandit1@bandit.labs.overthewire.org's password: 7x16WNeHIi5YkIhWsfFIqoognUTyj9Q4
```
## Level 12->13
The password for the next level is stored in the file **data.txt**, which is a hexdump of a file that has been repeatedly compressed. For this level it may be useful to create a directory under /tmp in which you can work. Use mkdir with a hard to guess directory name. Or better, use the command “mktemp -d”. Then copy the datafile using cp, and rename it using mv (read the manpages!)

```bash
mktemp -d
cd /tmp/tmp.WVILYB5ezd
# convert the hexdump back into binary
andit12@bandit:/tmp/tmp.WVILYB5ezd$ xxd -r data.txt > output.bin
bandit12@bandit:/tmp/tmp.WVILYB5ezd$ file output.bin
output.bin: gzip compressed data, was "data2.bin", last modified: Thu Sep 19 07:08:15 2024, max compression, from Unix, original size modulo 2^32 574

# now it turns into an annoying decompression cycle
# the main things to understand
- For gzip: `gzip -d file.gz`
- For bzip2: `bzip2 -d file.bz2`
- For tar: `tar xf file.tar`

# So you'll have a binary output that is gzip, bzip2, or tar compressed data
# You need to mv the binary into a file with the matching compression extension
# Decompress the file and continue until you get it down to the file with a password
# I've added the last cycle as example
bandit12@bandit:/tmp/tmp.WVILYB5ezd$ ls
data5.tar  data6.tar  data8.bin  data.txt  output.tar
bandit12@bandit:/tmp/tmp.WVILYB5ezd$ file data8.bin
data8.bin: gzip compressed data, was "data9.bin", last modified: Thu Sep 19 07:08:15 2024, max compression, from Unix, original size modulo 2^32 49
bandit12@bandit:/tmp/tmp.WVILYB5ezd$ mv data8.bin data8.gz
bandit12@bandit:/tmp/tmp.WVILYB5ezd$ gzip -d data8.gz
bandit12@bandit:/tmp/tmp.WVILYB5ezd$ ls
data5.tar  data6.tar  data8  data.txt  output.tar
bandit12@bandit:/tmp/tmp.WVILYB5ezd$ ls -la
total 13632
drwx------ 2 bandit12 bandit12     4096 Nov 23 02:14 .
drwxrwx-wt 1 root     root     13897728 Nov 23 02:14 ..
-rw-r--r-- 1 bandit12 bandit12    10240 Sep 19 07:08 data5.tar
-rw-r--r-- 1 bandit12 bandit12    10240 Sep 19 07:08 data6.tar
-rw-r--r-- 1 bandit12 bandit12       49 Sep 19 07:08 data8
-rw-r----- 1 bandit12 bandit12     2583 Nov 23 01:58 data.txt
-rw-rw-r-- 1 bandit12 bandit12    20480 Nov 23 02:10 output.tar
bandit12@bandit:/tmp/tmp.WVILYB5ezd$ cat data8
The password is FO5dwFsc0cbaIiH0h8J2eUks2vdTDwAn
```

```bash
ssh bandit.labs.overthewire.org -p 2220 -l bandit13
bandit1@bandit.labs.overthewire.org's password: FO5dwFsc0cbaIiH0h8J2eUks2vdTDwAn
```
## Level 13->14
The password for the next level is stored in **/etc/bandit_pass/bandit14 and can only be read by user bandit14**. For this level, you don’t get the next password, but you get a private SSH key that can be used to log into the next level. **Note:** **localhost** is a hostname that refers to the machine you are working on

```bash
# From https://help.ubuntu.com/community/SSH/OpenSSH/Keys#Generating_RSA_Keys
To securely communicate using key-based authentication, one needs to create a key pair, securely store the private key on the computer one wants to log in from, and store the public key on the computer one wants to log in to.

bandit13@bandit:~$ ls
sshkey.private
bandit13@bandit:~$ exit
logout

❯ scp -P 2220 bandit13@bandit.labs.overthewire.org:sshkey.private .
❯ ssh bandit.labs.overthewire.org -p 2220 -l bandit14 -i sshkey.private
                         _                     _ _ _
                        | |__   __ _ _ __   __| (_) |_
                        | '_ \ / _` | '_ \ / _` | | __|
                        | |_) | (_| | | | | (_| | | |_
                        |_.__/ \__,_|_| |_|\__,_|_|\__|


                      This is an OverTheWire game server.
            More information on http://www.overthewire.org/wargames

@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@         WARNING: UNPROTECTED PRIVATE KEY FILE!          @
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
Permissions 0640 for 'sshkey.private' are too open.
It is required that your private key files are NOT accessible by others.
This private key will be ignored.
Load key "sshkey.private": bad permissions
bandit14@bandit.labs.overthewire.orgs password:


# Permission denied (publickey)
# If you're sure you've correctly configured sshd_config, copied your ID, and have your private key in the .ssh directory, and still getting this error:
# Chances are, your /home/<user> or ~/.ssh/authorized_keys permissions are too open by OpenSSH standards. You can get rid of this problem by issuing the following commands:
# chmod go-w ~/
# chmod 700 ~/.ssh
# chmod 600 ~/.ssh/authorized_keys

❯ chmod 700 sshkey.private
❯ ssh bandit.labs.overthewire.org -p 2220 -l bandit14 -i sshkey.private
# good to go

```

```bash
cd /Projects/CTFs/OTW_bandit/bandit13_14
ssh bandit.labs.overthewire.org -p 2220 -l bandit14 -i sshkey.private
```
## Level 14->15
The password for the next level can be retrieved by submitting the password of the current level to **port 30000 on localhost**.
```bash
# PASSWORDS for each level are stored in /etc/somegame_pass/
bandit14@bandit:~$ cat /etc/bandit_pass/bandit14
MU4VWeTyJk8ROof1qqmcBPaLh7lDCPvS
bandit14@bandit:~$ echo "MU4VWeTyJk8ROof1qqmcBPaLh7lDCPvS" | nc localhost 30000
Correct!
8xCjnmgoKbGLhHFAZlGE5Tmu4M2tKJQo
```

```bash
ssh bandit.labs.overthewire.org -p 2220 -l bandit15
bandit1@bandit.labs.overthewire.org's password: 8xCjnmgoKbGLhHFAZlGE5Tmu4M2tKJQo
```
## Level 15->16
The password for the next level can be retrieved by submitting the password of the current level to **port 30001 on localhost** using SSL/TLS encryption.
> Probably could have done this cleaner but i was too lazy to read
```bash
bandit15@bandit:~$ openssl s_client -crlf -connect localhost:30001
CONNECTED(00000003)
Can't use SSL_get_servername
depth=0 CN = SnakeOil
verify error:num=18:self-signed certificate
verify return:1
depth=0 CN = SnakeOil
verify return:1
---
Certificate chain
 0 s:CN = SnakeOil
   i:CN = SnakeOil
   a:PKEY: rsaEncryption, 4096 (bit); sigalg: RSA-SHA256
   v:NotBefore: Jun 10 03:59:50 2024 GMT; NotAfter: Jun  8 03:59:50 2034 GMT
---
Server certificate
-----BEGIN CERTIFICATE-----
MIIFBzCCAu+gAwIBAgIUBLz7DBxA0IfojaL/WaJzE6Sbz7cwDQYJKoZIhvcNAQEL
BQAwEzERMA8GA1UEAwwIU25ha2VPaWwwHhcNMjQwNjEwMDM1OTUwWhcNMzQwNjA4
MDM1OTUwWjATMREwDwYDVQQDDAhTbmFrZU9pbDCCAiIwDQYJKoZIhvcNAQEBBQAD
ggIPADCCAgoCggIBANI+P5QXm9Bj21FIPsQqbqZRb5XmSZZJYaam7EIJ16Fxedf+
jXAv4d/FVqiEM4BuSNsNMeBMx2Gq0lAfN33h+RMTjRoMb8yBsZsC063MLfXCk4p+
09gtGP7BS6Iy5XdmfY/fPHvA3JDEScdlDDmd6Lsbdwhv93Q8M6POVO9sv4HuS4t/
jEjr+NhE+Bjr/wDbyg7GL71BP1WPZpQnRE4OzoSrt5+bZVLvODWUFwinB0fLaGRk
GmI0r5EUOUd7HpYyoIQbiNlePGfPpHRKnmdXTTEZEoxeWWAaM1VhPGqfrB/Pnca+
vAJX7iBOb3kHinmfVOScsG/YAUR94wSELeY+UlEWJaELVUntrJ5HeRDiTChiVQ++
wnnjNbepaW6shopybUF3XXfhIb4NvwLWpvoKFXVtcVjlOujF0snVvpE+MRT0wacy
tHtjZs7Ao7GYxDz6H8AdBLKJW67uQon37a4MI260ADFMS+2vEAbNSFP+f6ii5mrB
18cY64ZaF6oU8bjGK7BArDx56bRc3WFyuBIGWAFHEuB948BcshXY7baf5jjzPmgz
mq1zdRthQB31MOM2ii6vuTkheAvKfFf+llH4M9SnES4NSF2hj9NnHga9V08wfhYc
x0W6qu+S8HUdVF+V23yTvUNgz4Q+UoGs4sHSDEsIBFqNvInnpUmtNgcR2L5PAgMB
AAGjUzBRMB0GA1UdDgQWBBTPo8kfze4P9EgxNuyk7+xDGFtAYzAfBgNVHSMEGDAW
gBTPo8kfze4P9EgxNuyk7+xDGFtAYzAPBgNVHRMBAf8EBTADAQH/MA0GCSqGSIb3
DQEBCwUAA4ICAQAKHomtmcGqyiLnhziLe97Mq2+Sul5QgYVwfx/KYOXxv2T8ZmcR
Ae9XFhZT4jsAOUDK1OXx9aZgDGJHJLNEVTe9zWv1ONFfNxEBxQgP7hhmDBWdtj6d
taqEW/Jp06X+08BtnYK9NZsvDg2YRcvOHConeMjwvEL7tQK0m+GVyQfLYg6jnrhx
egH+abucTKxabFcWSE+Vk0uJYMqcbXvB4WNKz9vj4V5Hn7/DN4xIjFko+nREw6Oa
/AUFjNnO/FPjap+d68H1LdzMH3PSs+yjGid+6Zx9FCnt9qZydW13Miqg3nDnODXw
+Z682mQFjVlGPCA5ZOQbyMKY4tNazG2n8qy2famQT3+jF8Lb6a4NGbnpeWnLMkIu
jWLWIkA9MlbdNXuajiPNVyYIK9gdoBzbfaKwoOfSsLxEqlf8rio1GGcEV5Hlz5S2
txwI0xdW9MWeGWoiLbZSbRJH4TIBFFtoBG0LoEJi0C+UPwS8CDngJB4TyrZqEld3
rH87W+Et1t/Nepoc/Eoaux9PFp5VPXP+qwQGmhir/hv7OsgBhrkYuhkjxZ8+1uk7
tUWC/XM0mpLoxsq6vVl3AJaJe1ivdA9xLytsuG4iv02Juc593HXYR8yOpow0Eq2T
U5EyeuFg5RXYwAPi7ykw1PW7zAPL4MlonEVz+QXOSx6eyhimp1VZC11SCg==
-----END CERTIFICATE-----
subject=CN = SnakeOil
issuer=CN = SnakeOil
---
No client certificate CA names sent
Peer signing digest: SHA256
Peer signature type: RSA-PSS
Server Temp Key: X25519, 253 bits
---
SSL handshake has read 2103 bytes and written 373 bytes
Verification error: self-signed certificate
---
New, TLSv1.3, Cipher is TLS_AES_256_GCM_SHA384
Server public key is 4096 bit
Secure Renegotiation IS NOT supported
Compression: NONE
Expansion: NONE
No ALPN negotiated
Early data was not sent
Verify return code: 18 (self-signed certificate)
---
---
Post-Handshake New Session Ticket arrived:
SSL-Session:
    Protocol  : TLSv1.3
    Cipher    : TLS_AES_256_GCM_SHA384
    Session-ID: BC9929630BF0AF060B5BF2A8E82ACF4B3E05B0ABED4405F69033B611B789A075
    Session-ID-ctx:
    Resumption PSK: 8D6DD110A0BB24AE85C1078761DEF47FE1C09C7FCB1090532006A1DFB9087072A6085E75CD3D1A8B7BE063A13FCE1CD8
    PSK identity: None
    PSK identity hint: None
    SRP username: None
    TLS session ticket lifetime hint: 300 (seconds)
    TLS session ticket:
    0000 - bf 3f 8a a0 79 ae 50 18-07 9d e0 da 81 56 b3 fb   .?..y.P......V..
    0010 - 03 9e 7d 63 48 18 13 b8-3e 73 88 c9 dc cc 25 cf   ..}cH...>s....%.
    0020 - b2 6b e0 d5 7f ed 04 48-9f 6e 69 a3 8c fe 1c cf   .k.....H.ni.....
    0030 - 5a d1 d8 3d e9 0c 24 8a-fa fe 69 ca 5f a0 0d 90   Z..=..$...i._...
    0040 - 4d 72 db f1 4d 4b 75 2c-a5 03 4d 44 56 19 0b 1d   Mr..MKu,..MDV...
    0050 - c8 e5 31 1d 10 a7 1e 1b-a6 88 7f 84 ff 20 31 f6   ..1.......... 1.
    0060 - dc dd ed e6 34 54 eb 5b-5a fb 69 5e 9c 88 0c 55   ....4T.[Z.i^...U
    0070 - 46 b4 70 6a 4c 3b 60 c9-b2 3b f2 92 47 0e ac 26   F.pjL;`..;..G..&
    0080 - 43 6d 60 4d b4 3a 9c 0c-68 32 eb 4f 9f bf 72 3a   Cm`M.:..h2.O..r:
    0090 - 24 88 90 51 bf 3d 0f 0a-22 ed 52 cd d7 6b 18 6a   $..Q.=..".R..k.j
    00a0 - f3 e5 6a 40 fc c0 aa 14-e9 01 e2 c5 b4 24 c2 17   ..j@.........$..
    00b0 - 33 a6 84 43 5f ce 17 bb-a8 89 ac e0 e0 c8 cb 03   3..C_...........
    00c0 - 6d a9 4c 2b ea 36 39 44-cf 10 03 7c de ad 67 2c   m.L+.69D...|..g,
    00d0 - ef 79 14 90 6c 87 77 0e-47 e6 a8 22 bd 0c 21 38   .y..l.w.G.."..!8

    Start Time: 1732607060
    Timeout   : 7200 (sec)
    Verify return code: 18 (self-signed certificate)
    Extended master secret: no
    Max Early Data: 0
---
read R BLOCK
---
Post-Handshake New Session Ticket arrived:
SSL-Session:
    Protocol  : TLSv1.3
    Cipher    : TLS_AES_256_GCM_SHA384
    Session-ID: AF6544C520B2D327FC6866C869F9B2E25F4D55399A337A076B07B0205101A33F
    Session-ID-ctx:
    Resumption PSK: D67260E674B91DECEA4E73FCD5ECF71DA5522C3FF033CD8D4D9F8563190028726DF1317C15D3950EE2490C129CC83F14
    PSK identity: None
    PSK identity hint: None
    SRP username: None
    TLS session ticket lifetime hint: 300 (seconds)
    TLS session ticket:
    0000 - bf 3f 8a a0 79 ae 50 18-07 9d e0 da 81 56 b3 fb   .?..y.P......V..
    0010 - 87 fb f1 2d d7 35 4d 6a-6e ca 4c 1a 25 ee bf 16   ...-.5Mjn.L.%...
    0020 - 3b c5 2e a2 6c 9c bb c1-9e 2c 2a 2f ed 11 3f be   ;...l....,*/..?.
    0030 - 67 06 15 91 7f 07 f8 db-48 fc 45 eb f4 24 97 c6   g.......H.E..$..
    0040 - 53 8c 1b 83 00 7b a8 b6-37 14 b6 6f 3e 33 91 22   S....{..7..o>3."
    0050 - 36 c6 32 eb 23 69 fb 2a-6b 51 28 28 72 1e d8 fc   6.2.#i.*kQ((r...
    0060 - 00 21 b1 d2 41 77 12 98-00 6e af e3 16 d5 cd b7   .!..Aw...n......
    0070 - 7f 8f 12 03 4b d0 ac b9-6e b7 c8 6c 66 b3 de 84   ....K...n..lf...
    0080 - 71 bf fd 44 81 ca bf e3-8f da f9 95 1b 41 78 c9   q..D.........Ax.
    0090 - f7 09 9a 52 30 37 b8 ef-13 94 cb 59 bf 59 bf 54   ...R07.....Y.Y.T
    00a0 - 89 63 e2 11 ad 15 9f 4c-44 cf 1c 32 81 5a c3 70   .c.....LD..2.Z.p
    00b0 - 1a c1 57 e1 d1 fa b7 97-02 7d 9b c9 67 c2 8a ac   ..W......}..g...
    00c0 - dc 67 17 3f 4c e3 18 32-4d 6c e4 8f 23 e9 d7 9d   .g.?L..2Ml..#...
    00d0 - 20 db 55 cf 02 93 9b d1-96 ae 54 33 0c 4c 54 39    .U.......T3.LT9

    Start Time: 1732607060
    Timeout   : 7200 (sec)
    Verify return code: 18 (self-signed certificate)
    Extended master secret: no
    Max Early Data: 0
---
read R BLOCK
8xCjnmgoKbGLhHFAZlGE5Tmu4M2tKJQo
Correct!
kSkvUpMQ7lBYyCM4GBPvCvT1BfWRy0Dx
```

```bash
ssh bandit.labs.overthewire.org -p 2220 -l bandit16
bandit1@bandit.labs.overthewire.org's password: kSkvUpMQ7lBYyCM4GBPvCvT1BfWRy0Dx
```
## Level 16->17
The credentials for the next level can be retrieved by submitting the password of the current level to **a port on localhost in the range 31000 to 32000**. First find out which of these ports have a server listening on them. Then find out which of those speak SSL/TLS and which don’t. There is only 1 server that will give the next credentials, the others will simply send back to you whatever you send to it.

```bash
```

```bash
ssh bandit.labs.overthewire.org -p 2220 -l bandit
bandit1@bandit.labs.overthewire.org's password:
```
## Level 17->18

```bash
```

```bash
ssh bandit.labs.overthewire.org -p 2220 -l bandit
bandit1@bandit.labs.overthewire.org's password:
```
## Level 18->19

```bash
```

```bash
ssh bandit.labs.overthewire.org -p 2220 -l bandit
bandit1@bandit.labs.overthewire.org's password:
```
## Level 19->20

```bash
```

```bash
ssh bandit.labs.overthewire.org -p 2220 -l bandit
bandit1@bandit.labs.overthewire.org's password:
```
## Level 20->21

```bash
```

```bash
ssh bandit.labs.overthewire.org -p 2220 -l bandit
bandit1@bandit.labs.overthewire.org's password:
```