+++
date = '2024-12-10T21:58:17-08:00'
draft = false
title = 'STM32 WAV Player'
toc = true
tocBorder = true
+++
## Hardware
STM32F411CEU6 (Blackpill)
- WeAct Aliexpress

ST-Link V2
- Amazon, Aliexpress

MicroSD card breakout board+
- https://www.adafruit.com/product/254
- Get a 4-bit SDIO supported version instead

PNY 32GB MicroSD card
- https://a.co/d/beuO1eM
- format as FATFS and place a wav file named 'test.wav'

HiLetgo PCM5102 DAC Module
- https://a.co/d/6E7AqkR

FT232RL
- https://a.co/d/0zQwKG9 or https://a.co/d/czLOEFI

A Reliable 5V supply
- https://a.co/d/8YocysH

### I2S - PCM5102 Soldering/Wiring
- Solder the PCM5102 H1-4L as follows:
| Pad | Signal | Level | Description |
|-----|--------|-------|-------------|
| H1L | FLT | GND | Normal Latency |
| H2L | DEMP | GND | De-emphasis control off |
| H3L | XMST | 3.3V | Soft un-mute |
| H4L | FMT | GND | I2S |
- Wire the PCM5102 as follows:
| STM32 | PCM5102 |
|-------|---------|
| WS  | LCK |
| CK  | BCK |
| SD  | DIN |
| GND | SCK |
- See [this link](https://macsbug.wordpress.com/wp-content/uploads/2021/02/pcm5102a_dac_schematic_600s-min.png) for more info on the PCM5102

## CubeMX
- See my [post](https://elishareece.com/posts/archstm32/) on my Arch STM32 workflow
### Clock Configuration
- Set it to 100MHz cus why not
### USART2 - Debug/Printf()
- 115200,8N1
![USART_config](/images/USART_config.png)
### SPI2 - SD Card
- 8 bit data size
- We'll set the prescaler in SW so it doesn't really matter
![SPI2](/images/SPI2_config.png)
- Pull-up MISO and MOSI lines
- Depending on your SD card module schematic you may not need to pullup the data lines
![SPIpins](/images/SPIPIN_config.png)
### SPI2 Chip Select
- I chose PB13 for its proximity, be sure to pull up the CS as well
![SPICS](/images/SPICS_config.png)
### I2S1 - DAC/Audio
- 16 bits data on 16 bits frame
- 44 KHz
- This is to match my wav file but you can also dynamically set this
![I2S](/images/I2S_config.png)
- Enable both global interrupts
![I2Snvic](/images/i2s_nvic.png)
- Half word data width (16 bit data)
- Circular mode, incrementing the memory address
![I2Sdma](/images/i2s_dma.png)
- No need to pull up these lines but set the output to high
![I2Sgpio](/images/i2s_gpio.png)

### Middleware - FATFS
- User Defined
- Make sure the min and max sector sizes are 512
![FATFS](/images/FATFS.png)

## Software
### user_diskio_spi.c/.h
- Copy these two files into FATFS/Target
- https://github.com/kiwih/cubeide-sd-card/blob/master/cubeide-sd-card/FATFS/Target/user_diskio_spi.c
- https://github.com/kiwih/cubeide-sd-card/blob/master/cubeide-sd-card/FATFS/Target/user_diskio_spi.h
### Modify user_diskio.c to use your new files
- Line numbers may not be correct, use your judgement
```diff
user_diskio.c
38d37
+ #include "user_diskio_spi.h"
85c84,85
+     return USER_SPI_initialize(pdrv);
---
-     Stat = STA_NOINIT;
-     return Stat;
99c99,100
+     return USER_SPI_status(pdrv);
---
-     Stat = STA_NOINIT;
-     return Stat;
119c120
+     return USER_SPI_read(pdrv,buff,sector,count);
---
-     return RES_OK;
141c142
+    return USER_SPI_write(pdrv,buff,sector,count);
---
-     return RES_OK;
161c162,163
+     return USER_SPI_ioctl(pdrv,cmd,buff);
---
-     DRESULT res = RES_ERROR;
-     return res;
```
### Setup main.h according to user_diskio_spi.c
```c
user_diskio_spi.c
//Make sure you set #define SD_SPI_HANDLE as some hspix in main.h
//Make sure you set #define SD_CS_GPIO_Port as some GPIO port in main.h
//Make sure you set #define SD_CS_Pin as some GPIO pin in main.h
```
```C
/* Private defines ------------------------------------*/
#define SD_CS_Pin GPIO_PIN_13
#define SD_CS_GPIO_Port GPIOB

/* USER CODE BEGIN Private defines */
#define SD_SPI_HANDLE hspi2
/* USER CODE END Private defines */
```
### Add user_diskio_spi.c to the Makefile
```
# C sources
C_SOURCES =  \
Core/Src/main.c \
...
FATFS/Target/user_diskio.c \
FATFS/Target/user_diskio_spi.c \
...
```
### My main.c
```c
/* Private includes ----------------------------------------------------------*/
/* USER CODE BEGIN Includes */
#include <stdio.h>
#include <string.h>
#include <stdarg.h>
#include <stdbool.h>
/* USER CODE END Includes */


/* Private function prototypes -----------------------------------------------*/
void SystemClock_Config(void);
/* USER CODE BEGIN PFP */
void qprint(const char *fmt, ...);
void qprint(const char *fmt, ...)
{
  static char buffer[256];
  va_list args;
  va_start(args, fmt);
  vsnprintf(buffer, sizeof(buffer), fmt, args);
  va_end(args);

  int len = strlen(buffer);
  HAL_UART_Transmit(&huart2, (uint8_t*)buffer, len, -1);
}
/* USER CODE END PFP */

/* Private user code ---------------------------------------------------------*/
/* USER CODE BEGIN 0 */

// Globals /////////////////////////////////////////////////////////////////////
FATFS fatfs;
FRESULT fres;
FIL fil;
UINT bytesRead;

// For 44.1kHz stereo, one frame is 2 samples (left + right channel)
#define SAMPLES_PER_FRAME 2
#define SAMPLE_RATE 44100
#define BUFFER_TIME_MS 20  // 20ms buffer is a good compromise

// Calculate buffer size based on sample rate
#define AUDIO_BUFFER_SIZE ((SAMPLE_RATE * BUFFER_TIME_MS * SAMPLES_PER_FRAME) / 1000)
#define HALF_BUFFER_SIZE (AUDIO_BUFFER_SIZE/2)

int16_t samples[AUDIO_BUFFER_SIZE];

uint32_t fread_size = 0;
uint32_t recording_size = 0;
uint32_t played_size = 0;

volatile bool isHalfBufferDone = false;
volatile bool isFullBufferDone = false;

// Callbacks ///////////////////////////////////////////////////////////////////
void HAL_I2S_TxHalfCpltCallback(I2S_HandleTypeDef *hi2s)
{
	isHalfBufferDone = true;
}

void HAL_I2S_TxCpltCallback(I2S_HandleTypeDef *hi2s)
{
	isFullBufferDone = true;
    played_size += AUDIO_BUFFER_SIZE;
}

// Main ////////////////////////////////////////////////////////////////////////
int main(void)
{
    // Abstraction Layer and System Clock
    HAL_Init();
    SystemClock_Config();

    // Peripheral Init
    MX_GPIO_Init();
    MX_USART2_UART_Init();
    MX_DMA_Init();
    MX_FATFS_Init();
    MX_SPI2_Init();
    MX_I2S1_Init();

    // Delay for SD Card
    HAL_Delay(1000);

    // Open the file system
    fres = f_mount(&fatfs, "", 1);
    if (fres != FR_OK) {
        qprint("f_mount error (%i)\r\n", fres);
    }

    // Open the Song
    fres = f_open(&fil, "test.wav", FA_READ);

    // Get song header data
    uint8_t header[44];
    f_read(&fil, header, 44, &bytesRead);
    qprint("Sample Rate: %d\r\n", *(uint32_t*)(header + 24));
    qprint("Bits Per Sample: %d\r\n", *(uint16_t*)(header + 34));
    qprint("Channels: %d\r\n", *(uint16_t*)(header + 22));

    // Get Song Size
    f_lseek(&fil, 40);
    f_read(&fil, &recording_size, 4, &bytesRead);
    qprint("Recording Size: %d\r\n", recording_size);

    // Play the Song
    f_read(&fil, samples, AUDIO_BUFFER_SIZE * sizeof(uint16_t), &bytesRead);
    HAL_I2S_Transmit_DMA(&hi2s1, (uint16_t *)samples, AUDIO_BUFFER_SIZE);

    while(1)
    {
        if (isHalfBufferDone) {
            f_read(&fil, samples, HALF_BUFFER_SIZE * sizeof(uint16_t),
                &bytesRead);
            isHalfBufferDone = false;
        }

        if (isFullBufferDone) {
            f_read(&fil, &samples[HALF_BUFFER_SIZE],
                HALF_BUFFER_SIZE * sizeof(uint16_t), &bytesRead);
            isFullBufferDone = false;
        }

        if (played_size >= recording_size) {
            HAL_I2S_DMAStop(&hi2s1);
        }
    }

    // Unmount the FS
    f_mount(NULL, "", 0);
}
/* USER CODE END 0 */


