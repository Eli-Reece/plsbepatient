### My System Info

- Arch Linux x86_64
- 6.15.7-arch1-1

### Useful Links
- [AM335x Sitara Processor Datasheet](https://www.ti.com/lit/ds/symlink/am3358.pdf)

### Initial Project Setup

```bash
mkdir beaglebone && cd beaglebone
export PROJECT_DIR=${PWD}
mkdir images
mkdir toolchain && cd toolchain
```

### Install Cross-Compiler Toolchain

Get a toolchain from arm or build your own using crosstool if you want.

> https://developer.arm.com/downloads/-/arm-gnu-toolchain-downloads

The beaglebone black has the Sitara AM3358BZCZ100 which is an ARM Cortex-A8
32-bit Microprocessor.

So I need a x86_64 hosted cross toolchain for an
aarch32 GNU/Linux target with hard float (arm-none-linux-gnueabihf) 

```bash
tar -xvf arm-gnu-toolchain...
export PATH=${PROJECT_DIR}/toolchain/arm-gnu-.../bin:$PATH
export ARCH=arm
export CC=arm-none-linux-gnueabihf-
${CC}gcc --version
arm-none-linux-gnueabihf-gcc (Arm GNU Toolchain 14.3.Rel1 (Build arm-14.174)) 14.3.1 20250623
Copyright (C) 2024 Free Software Foundation, Inc.
This is free software; see the source for copying conditions.  There is NO
warranty; not even for MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.

cd ${PROJECT_DIR}
```

## Build U-Boot

Now we can build the bootloader thats gonna be able to control our flash
memory, load the kernel, device-tree blob, etc.

```bash
git clone --depth=1 https://github.com/u-boot/u-boot # or you can clone the whole source to easily see the tags
cd u-boot
git ls-remote --tags origin # looking for latest release (non-candidate)
git fetch --depth=1 origin tag v2025.07
git checkout v2025.07
```

Now, we're gonna use the AM335x Evaluation Module (evm) config in order to get
all of the necessary drivers and configuration to have a functioning U-boot.

```bash
# configs/am335x_evm_defconfig
make ARCH=${ARCH} CROSS_COMPILE=${CC} am335x_evm_defconfig
make ARCH=${ARCH} CROSS_COMPILE=${CC} -j$(nproc)
```

Once that sucessfully builds we need two files:
The MLO and u-boot.img which should be in the u-boot root dir.

```bash
cp MLO u-boot.img ../images
```

### BeagleBone First 3 Stages

On powerup, the firststage bootloader runs from the internal Boot ROM. This is
code written during the manufacturing process and cannot be altered. This code
reads the boot configuration pins to determine where to load the next
bootloader. The bootloader is going init minimal hardware and then access the
first partition (which must be in FAT format), loading the MLO.

The MLO (MMC Card Loader) is the second-stage bootloader. This mainly serves to
initialize the external DDR memory and set-up the boot process for u-boot.

Our third or tertiary bootloader is U-Boot which gives us command control over
the kernel environment.

### Build the Kernel

!!! info "Note:"
    I didn't really choose 6.15 for any particular reason other than it was
    recent

```bash
git clone --depth 1 -b v6.15 https://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git/

cd linux
make ARCH=${ARCH} CROSS_COMPILE=${CC} omap2plus_defconfig
make ARCH=${ARCH} CROSS_COMPILE=${CC} -j$(nproc)
cp /arch/arm/boot/zImage ~/<proj>/images
cp /arch/arm/boot/dts/am335x-boneblack.dtb ~/<proj>/images
```

### Get a RFS

```bash
yay -Syu debootstrap
```

### Format SD card

I forgot to take notes but its not hard

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

