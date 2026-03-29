# No Keyboard or Mouse at Login - Arch Linux (Cinnamon) Fix

Recently decided to do some spring cleaning and get the dust out of my PC. After cleaning, I booted my jawn back up to find I could not input mouse or keyboard commands at my Cinnamon login screen or even change to another TTY. Great..

## TLDR

Updated system using live USB and rebuilt initramfs. Still not entirely sure what caused the issue.

## Hardware

I immediately unplugged all my USB devices and prayed my new Chinese USB extender with an external 5V didn't somehow backpower into my MOBO and cause a mess (very low chance btw unless your MOBO manufacturer doesn't believe in diodes). <br><br>
Tried front panel USB 3.0 -> no good

Tried front panel USB 2.0 -> no good

Tried back panel USB 3.0 -> no good

Tried back panel USB 2.0 -> no good

Tried keyboard to known USB extender to back panel USB 2.0 -> worth a shot <br><br>

At least my keyboard lights up

## BIOS

Easy check: Reboot the PC without the keyboard plugged in (or not) and see if the BIOS reports no keyboard <br><br>

Dank, BIOS can still identify the keyboard. Entered into my BIOS on next boot and checked my settings to make sure legacy USB is supported -> All good (or I guess bad since no solution) 

## GRUB

Keyboard works in GRUB! Let me just try to run a backup LTS kernel...<br><br>
Guess what I don't have

## Live USB to the Rescue

> I love liveUSBs btw. I have like 5 of em. 

Game plan now:

<center>

Mount my root and boot partitions

chroot

update my system

rebuild my initramfs

5 big booms

</center>

## Clonezilla

I forgot to label my USBs so Clonezilla just so happened to be the lucky gal

### 1) Enter BIOS and force boot into USB
### 2) Get Clonezilla into the shell
### 3) Get a lay of the land

```bash
$ lsblk
...
nvme0n1     259:0    0 931.5G  0 disk
├─nvme0n1p1 259:1    0     1G  0 part 
├─nvme0n1p2 259:2    0     4G  0 part
└─nvme0n1p3 259:3    0 910.9G  0 part 
```

My p3 is root/ and p1 is my boot/efi

(yes i only have 1TB, im poor)

### 4) Setup up networking before I forget

```bash
$ ocs-live-netcfg
dhcp
```

### 5) Mount the root and boot partoots

```bash
$ sudo mount /dev/nvme0n1p3 /mnt
$ sudo mount /dev/nvme0n1p1 /mnt/boot/efi
```

### 6) Remount dev, sys, & proc

```bash
$ sudo mount --bind /dev /mnt/dev
$ sudo mount --bind /sys /mnt/sys
$ sudo mount --bind /proc /mnt/proc
```

### 7) i am chroot 

```bash
$ sudo chroot /mnt
```

### 8) Fix the damn thing

```bash
$ mkinitcpio -P
```

### 9) Reboot and Profit

Didn't work lol

### 10) Do 1-7 again then update the system

```bash
$ pacman -Sy archlinux-keyring && pacman -Syu
```

### 9) Reboot and Profit

worked (never a doubt), now i can go back to writing subpar code!!

My chinese USB extender w/ 5V external input works great by the way.

