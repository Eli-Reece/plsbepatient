# Arch STM32 Build Guide

## Install the tools

- CubeMX
- GNU ARM Embedded Toolchain
	- arm-none-eabi-gcc
	- arm-none-eabi-gdb
	- arm-none-eabi-newlib
- GNU Make
- OpenOCD

This is using an ST-Link V2 or V3

## CubeMX Configuration

- Configure Project output to Makefile
```bash
Project Manager->Project->Toolchain/IDE
set to Makefile
```
- Set project to copy all used libraries to the project folder
```bash
Code Generator tab
enable 'Copy all use libraries into the project folder'
```
- Do whatever ever configuration then build
```bash
click 'GENERATE CODE'
```

## CLI

- Go into the project and build your code (make)
:::warning
You'll need to source your toolchain if not already on path
:::
- Create this `openocd.cfg` file in your project root
```
# Programmer, can be changed to several interfaces
source [find interface/stlink.cfg]

# Change to match your board (/usr/share/openocd/scripts/target)
source [find target/stm32f4x.cfg]
```
- Program your stm32
```bash
openocd -f ./openocd.cfg -c "program build/<program_name>.elf verify reset exit"
```
