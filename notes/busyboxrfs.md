+++
date = '2024-06-08T21:00:34-08:00'
draft = false
title = 'BeagleBone BusyBox RFS'
toc = true
tocBorder = true
+++
> Using the toolchain I built previously in the `BeagleBone Black from Scratch`

## Clone Buildroot
```bash
git clone https://gitlab.com/buildroot.org/buildroot.git
git checkout -b 2024.02
```

## ncurses fix for menuconfig
- its not the exact file/location but you can infer
```diff
diff --git a/tools/kconfig/lxdialog/check-lxdialog.sh b/tools/kconfig/lxdialog/check-lxdialog.sh
index e9daa627..6408baae 100755
--- a/tools/kconfig/lxdialog/check-lxdialog.sh
+++ b/tools/kconfig/lxdialog/check-lxdialog.sh
@@ -63,7 +63,7 @@ trap "rm -f $tmp ${tmp%.tmp}.d" 0 1 2 3 15
 check() {
         $cc -x c - -o $tmp 2>/dev/null <<'EOF'
 #include CURSES_LOC
-main() {}
+int main() {}
 EOF
 	if [ $? != 0 ]; then
 	    echo " *** Unable to find the ncurses libraries or the"       1>&2
```
## Menuconfig
```
make menuconfig
```
### Target Options
- Target Architecture: Arm (little endian)
- Target Architecture Variant: cortex-A8
- Target ABI: EABIhf
- Floating Point Strategy: NEON
- ARM instruction set: ARM
- Target Binary Format: ELF
### Toolchain
- Toolchain type: External
- Toolchain: Custom toolchain
- Toolchain origin: Pre-installed toolchain
- Toolchain path: ../../x-tools/arm-cortex_a8-linux-gnueabihf
- External toolchain gcc version: 13.x
- External kernel headers series: 5.15.x
- SSP support & SSP strong support: y
- C++ support: y
### System Configuration
- set the hostname
- set the system banner
- enabled root login with password and run a getty after boot
### (Optional) Modify the busybox config
> If you want to make more specific changes to the RFS. You'll probably have to do the same ncurses fix if you're on Arch
```bash
make busybox-menuconfig
```
## Build
```bash
make
```

### libffi work around
> I had an issue building libffi 3.4.2 due to my gcc version being too high. Just updated its config with a new a newer package.
```diff
diff --git a/package/libffi/libffi.mk b/package/libffi/libffi.mk
index 6249023eae..d3e3e1e1a9 100644
--- a/package/libffi/libffi.mk
+++ b/package/libffi/libffi.mk
@@ -4,7 +4,7 @@
 #
 ################################################################################

-LIBFFI_VERSION = 3.4.4
+LIBFFI_VERSION = 3.4.6
 LIBFFI_SITE = \
 	https://github.com/libffi/libffi/releases/download/v$(LIBFFI_VERSION)
 LIBFFI_LICENSE = MIT
diff --git a/package/libffi/libffi.hash b/package/libffi/libffi.hash
index 8d2349ec21..a4326eb9cc 100644
--- a/package/libffi/libffi.hash
+++ b/package/libffi/libffi.hash
@@ -1,4 +1,5 @@
 # Locally calculated
 sha256  d66c56ad259a82cf2a9dfc408b32bf5da52371500b84745f7fb8b645712df676  libffi-3.4.4.tar.gz
+sha256  b0dea9df23c863a7a50e825440f3ebffabd65df1497108e5d437747843895a4e  libffi-3.4.6.tar.gz
 # License files, locally calculated
 sha256  2c9c2acb9743e6b007b91350475308aee44691d96aa20eacef8e199988c8c388  LICENSE
```

## Format the sd card bruh
> sdb is my sdcard
```bash
sudo cfdisk /dev/sdb
sdb1 (boot)
- 128M, FAT32, bootable flag
sdb2 (rfs)
- Rest of the storage space, Linux (ext4)
```
```bash
sudo mkfs.vfat -a -F 32 -n boot /dev/sdb1
sudo mkfs.ext4 -L rootfs -E nodiscard /dev/sdb2
```
> "-E nodiscard disables bad block discarding. While this should be a useful option for cards with bad blocks, skipping this step saves long minutes in SD cards" - nerds at bootlin

### Remove the sd card and plug it back in
> the `rootfs.tar` is located at busybox/output/images
```bash
sudo mkdir -p /mnt/boot
sudo mkdir -p /mnt/rootfs
sudo mount /dev/sdb1 /mnt/boot
sudo mount /dev/sdb2 /mnt/rootfs

cp MLO am335x-boneblack.dtb u-boot.img zImage /mnt/boot
sudo tar -C /mnt/rootfs -xf rootfs.tar
```
## Create extlinux.conf
```bash
mkdir /mnt/boot/extlinux
${EDITOR} /mnt/boot/extlinux/extlinux.conf
```
```bash
label buildroot
	kernel /zImage
	devicetree /am335x-boneblack-wireless.dtb
	append console=ttyO0,115200 root=/dev/mmcblk0p2 rootwait
```
## Boot
```bash
ifconfig eth0 up
ifconfig eth0 192.168.1.101
#host
sudo ip addr add 192.168.1.100/24 dev eno1
```