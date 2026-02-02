# Arch Teensy 4.1

## Software Install

[teensy_loader_cli]

[teensy udev rules]

[Example Blink Apps]

## Using teensy_loader_cli

```bash
yay -S teensy_loader_cli

cd ~/Downloads/
wget https://www.pjrc.com/teensy/00-teensy.rules
sudo mv 00-teensy.rules /etc/udev/rules.d/

wget https://www.pjrc.com/teensy/blink_both.zip
unzip blink_both.zip && cd blink_both

# Press the button on the Teensy to enter Program Mode
teensy_loader_cli --mcu=TEENSY41 -w blink_fast_Teensy41.hex
# Should start blinking fast
```

## Using arduino-cli 

:::info
Pretty sure it still requires the udev rule
:::

### Install arduino-cli and create teensy dir
```bash
yay -S arduino-cli
arduino-cli core update-index
mkdir teensy && cd teensy
```

### Create the config file and add teensyduino

```bash
arduino-cli config init
nvim ~/.arduino15/arduino-cli.yaml
```

```yaml
board_manager:
    additional_urls: 
        - https://www.pjrc.com/teensy/package_teensy_index.json
```

```bash
arduino-cli core update-index
arduino-cli core list
ID          Installed Latest Name
arduino:avr 1.8.6     1.8.6  Arduino AVR Boards
teensy:avr  1.59.0    1.59.0 Teensy (for Arduino IDE 2.0.4 or later)
```

### Create sketch 

```bash
# Plugin the board
arduino-cli board list
Port           Protocol Type              Board Name FQBN                Core
usb5/5-1/5-1.2 teensy   Teensy Ports      Teensy 4.1 teensy:avr:teensy41 teensy:avr

arduino-cli sketch new testsketch
nvim ./testsketch/testsketch.ino
```

```c
void setup() {
  pinMode(LED_BUILTIN, OUTPUT);
}

void loop() {
  digitalWrite(LED_BUILTIN, HIGH);
  delay(2000);
  digitalWrite(LED_BUILTIN, LOW);
  delay(2000);
}
```

### Compile

```bash
arduino-cli compile --fqbn teensy:avr:teensy41 testsketch
```

### Flash

```bash
arduino-cli upload -p usb5/5-1/5-1.2 --fqbn teensy:avr:teensy41 testsketch
```




[teensy_loader_cli]:https://archlinux.org/packages/extra/x86_64/teensy_loader_cli/
[teensy udev rules]:https://www.pjrc.com/teensy/00-teensy.rules
[Example Blink Apps]:https://www.pjrc.com/teensy/blink_both.zip
