# RP2040-Zero Experience

## Links

- https://www.waveshare.com/wiki/RP2040-Zero
- https://files.waveshare.com/upload/4/4c/RP2040_Zero.pdf

## Overview

The RP2040-Zero microcontroller is a dual-core ARM Cortex M0+ processor
designed by Raspberry Pi. It supports a clock speed up to 133MHz and contains
264KB of SRAM and 2MB Flash (QSPI Flash) in a super small package which is the
exact length of my tip of my finger. It also comes with a USB-C connector
which is nice. 

I actually have one of the counterfeit products listed on the waveshare page
that has whiteout on one of the logos lol. I think I got this from Aliexpress a
while ago but oh well.

The waveshare schematic doesn't actually show which pins aren't brought out but
I know the debugging pins are not exposed for SWD. 

The board has 29 GPIO pins (GP0-15,26-29) brought out on the pin headers and
then 9 can be brought out through soldering on the bottom. GPIO 16 is used for
the RGB LED.

The board has (with overlap of course)
- 2x SPI
- 2x I2C
- 2x UART
- 4x 12-bit ADC
- 16x controllable PWM channels
- clock and timer on chip
- temp sensor
- on chip floating point lib
- 9x PIO state machines for custom peripheral support

## First Date

First thing about this board thats unique is the design. Super small form
factor which is probably great for sized constrained projects but the addition
of the pins at the bottom of the board prevent usage with a breadboard which
leaves test circuits a floating DuPont mess.

Most of the guides suggest using the Raspberry Pi Pico extension in vscode
which I'm definitely not gonna do (AI SLOP + BLOATWARE). Following the pico-sdk
github and documentation, it wasn't very hard to get up and running.

### Arch Setup

```bash
yay -S cmake python3 base-devel arm-none-eabi picotool
cd ~/0_programming/embedded/pico
git clone https://github.com/raspberrypi/pico-sdk.git
cd pico-sdk
export PICO_SDK_PATH=${PWD}
git submodule update --init
cd ..
mkdir basic_setup && cd basic_setup
touch CMakeLists.txt hello_world.c
```

#### CMakeLists.txt
```txt
cmake_minimum_required(VERSION 3.13)

include (pico_sdk_import.cmake)
project(basic_setup)
pico_sdk_init()

add_executable(hello_world
    hello_world.c
)

target_link_libraries(hello_world pico_stdlib)
pico_add_extra_outputs(hello_world)
```

#### hello_world.c
```c
#include <stdio.h>
#include "pico/stdlib.h"

#define DELAY_MS 2000

int main()
{
    stdio_init_all();
    for(;;) {
        printf("Hello, world!\n");
        sleep_ms(DELAY_MS);
    }
    return 0;
}
```

```bash
cmake -S . -B build
cmake --build build --target hello_world
// Opened up a seperate terminal, RPI2040 Zero connected to USB to TTL converter
tio /dev/ttyUSB0
```

Flashing the board is a bit annoying. I have to hold down the bootsel button,
unplug and plugback in the usb-c to get it into 'USB Mass Storage Mode'. Since
I have to do that manual rigamarole and there are no debug pins, the picotool
is kinda pointless as I just directly copy the uf2 output file into the media
directory that appears.

```bash
cp build/hello_world.uf2 /run/media/eli/RPI-RP2
```

### Checking out the build dir

The linker script `pico_flash_region.ld`, defines our flash region of 2MB which
conveniently matches our board.
```c
FLASH(rx) : ORIGIN = 0x10000000, LENGTH = (2 * 1024 * 1024)
```

From the datasheet

> External Flash is accessed via the QSPI interface using the execute-in-place (XIP) hardware. This allows an external flash memory to be addressed and accessed by the system as though it were internal memory...etc reads to a 16MB memory window starting at 0x10000000 are translated into a serial flash transfer... etc etc

The build also outputs the dissassembly which is interesting.

## Let's hook up a BMP390

For some reason, I failed to see Waveshares and Bosch's BMP390 libraries and
thought only the BME280 lib existed which is silly. So, continuing in my failed
logic, I decided to spend the next hour reading the BMP390 datasheet and
porting up the BME280 library I found but I'll keep this focused on the pico
code.

The CMakeLists.txt pretty much is the same as before but I just added the
hardware_i2c lib to the target_link_libraries:

#### CMakeLists.txt
```txt
cmake_minimum_required(VERSION 3.13)

include (pico_sdk_import.cmake)
project(bmp_test)
pico_sdk_init()

add_executable(bmp_390
    bmp_390.c
)

target_link_libraries(bmp_390 pico_stdlib hardware_i2c)
pico_add_extra_outputs(bmp_390)
```

#### bmp c
In my c file, I just added `#include "hardware/i2c.h"` and I was off and
setting up the I2C was not difficult either:
```c
gpio_set_function(PICO_DEFAULT_I2C_SDA_PIN, GPIO_FUNC_I2C);
gpio_set_function(PICO_DEFAULT_I2C_SCL_PIN, GPIO_FUNC_I2C);
gpio_pull_up(PICO_DEFAULT_I2C_SDA_PIN);
gpio_pull_up(PICO_DEFAULT_I2C_SCL_PIN);
```

## Overall

Eh

I think for projects which require a small form factor (model rockets,
wearables) and not a lot of processing, this is a nice and extremely cheap
solution. I was very impressed by RPi's documentation, the SDK and datasheet
were both very easy to read and find the necessary information. Having to hold
the bootsel to reprogram the board is pain but theres probably a way to get
around it using the picotool. 
