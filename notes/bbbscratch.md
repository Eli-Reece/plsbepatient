## My System Info
- 6.11.6-arch1-1
## Install your cross-compiler
```bash
❯ yay -S crosstool-ng
// crosstool-ng-1.26.0-1
```
## Build your cross-compiler
> I was unable to compile gdb due to a missing the libgmp package so I just removed it since I wasn't gonna use it anyways
```bash
❯ cd <whereever u want to build> // this dir will have build log, etc
❯ ct-ng arm-cortex_a8-linux-gnueabi
❯ ct-ng menuconfig
	[ ] render the toolchain read-only
	Floating point: (hardware (FPU))
	Use specific FPU (neon)
	[ ] gdb
	Version of linux (5.15.118)
❯ ct-ng build
// toolchain should be @ ~/x-tools/arm-cortex_a8-linux-gnueabihf
```
## (Optional) Setup easy env
```bash
// in your .bashrc or .zshrc (me)
bbb_set() {
	export PATH=~/x-tools/arm-cortex_a8-linux-gnueabihf/bin:$PATH
    export CROSS_COMPILE=arm-cortex_a8-linux-gnueabihf-
    export CC=arm-cortex_a8-linux-gnueabihf-
    export ARCH=arm
    echo "BBB cross-compile environment activated"
}

bbb_unset() {
    PATH=$(echo $PATH | sed 's|~/x-tools/arm-cortex_a8-linux-gnueabi/bin:||')
    unset CROSS_COMPILE
    unset CC
    unset ARCH
}
```
## (Optional) Test your new toolchain
```bash
// after adding to path and setting up variable(s)
❯ ${CC}gcc --version
arm-cortex_a8-linux-gnueabihf-gcc (crosstool-NG 1.26.0) 13.2.0
Copyright (C) 2023 Free Software Foundation, Inc.
This is free software; see the source for copying conditions.  There is NO
warranty; not even for MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.

// hello world in test.c
❯ ${CC}gcc test.c -o test

// if u rlly, rlly want proof
❯ ${CC}readelf -a test
```
## Build U-Boot
```bash
❯ git clone git://git.denx.de/u-boot.git
❯ cd u-boot
❯ git checkout v2021.01
❯ make ARCH=${ARCH} CROSS_COMPILE=${CC} distclean
❯ make ARCH=${ARCH} CROSS_COMPILE=${CC} am335x_evm_defconfig
❯ make ARCH=${ARCH} CROSS_COMPILE=${CC}
// Setup a images dir at the root of your proj for ez access
❯ cp MLO u-boot.img ../images
```

## Build the Kernel
```bash
❯ wget https://cdn.kernel.org/pub/linux/kernel/v5.x/linux-5.15.118.tar.gz
❯ tar -xvf linux-5.15.118.tar.gz
❯ make ARCH=${ARCH} CROSS_COMPILE=${CC} distclean
❯ make ARCH=${ARCH} CROSS_COMPILE=${CC} omap2plus_defconfig
❯ make ARCH=${ARCH} CROSS_COMPILE=${CC}
❯ cp /arch/arm/boot/zImage ~/<proj>/images
❯ cp /arch/arm/boot/dts/am335x-boneblack.dtb ~/<proj>/images
```
## Build the RFS
- TODO: Add
### RFS ncurses fix for menuconfig
- from: https://aur.archlinux.org/packages/esp8266-rtos-sdk
> The file location for me is: `scripts/kconfig/lxdialog/check-lxdialog.sh`
```
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

## Format SD card
- TODO: Add
### U-boot arguments
```bash
setenv bootargs console=ttyO0,115200 root=/dev/mmcblk0p2 rw rootwait
setenv bootcmd 'fatload mmc 0:1 0x80200000 zImage; fatload mmc 0:1 0x80F00000 am335x-boneblack.dtb; bootz 0x80200000 - 0x80F00000'
saveenv
boot
```

```bash
uboot.env
bootargs=console=ttyO0,115200n8 root=/dev/mmcblk0p2 rw rootwait
uenvcmd=fatload mmc 0:1 0x80200000 zImage; fatload mmc 0:1 0x80f00000 am335x-boneblack.dtb; fatload mmc 0:1 0x82000000 initramfs.cpio.gz; bootz 0x80200000 0x82000000 0x80f00000

```
