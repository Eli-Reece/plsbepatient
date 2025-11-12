### Install Packages

qemu-system-arm
	Emulation and virtualization
gcc-arm-none-eabi
	Cross compiler toolchain

```bash
yay -S qemu-system-arm gcc-arm-none-eabi base-devel bison flex cmake
```

### QEMU Run Command
```bash
qemu-system-arm -M vexpress-a9 -m 32M -no-reboot -nographic -serial pty -monitor telnet:127.0.0.1:1234,server,nowait

tio /dev/pts/3
```

## Create our first bin

### startup.s
```assembly
ldr r2, str1            @ Load str1 into register r2
b .                     @ Branch to current address (infinite loop)
str1: .word 0xCAFEBABE  @ str1 is "CAFEBABE"
```

```bash
# Compile object file of the assembly
arm-none-eabi-as -o startup.o startup.s
# Create the executable file from the object
arm-none-eabi-ld -o first-hang.elf startup.o
# Generate a binary from this elf since we don't have anything to load the elf
arm-none-eabi-objcopy -O binary first-hang.elf first-hang.bin
```

```bash
hexdump first-hang.bin
0000000 2000 e59f fffe eaff babe cafe          
000000c
```
