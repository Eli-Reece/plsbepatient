+++
date = '2024-04-12T17:16:17-08:00'
title = 'RHEL Saleae Guide'
toc = true
tocBorder = true
+++
## Install `snapd` and enable it
```bash
# Prerequitiste / May not apply to you ######################################
sudo dnf install [https://dl.fedoraproject.org/pub/epel/epel-release-latest-8.noarch.rpm](https://dl.fedoraproject.org/pub/epel/epel-release-latest-8.noarch.rpm)
sudo dnf upgrade
sudo subscription-manager repos --enable "rhel-*-optional-rpms" --enable "rhel-*-extras-rpms"
sudo yum update
#############################################################################
sudo yum install snapd
sudo systemctl enable --now snapd.socket
```
## Give `snapd` access to the `raw-usb` interface
```bash
sudo snap connect sigrok-suite:raw-usb
sudo systemctl restart snapd
```
## Install `Sigrok`
```bash
sudo snap install sigrok-suite --beta
```
## Update `udev` rules
```bash
sudo bash
cd /etc/udev/rules.d/
wget -O 60-libsigrok.rules "[https://sigrok.org/gitweb/?p=libsigrok.git;a=blob_plain;f=contrib/60-libsigrok.rules](https://sigrok.org/gitweb/?p=libsigrok.git;a=blob_plain;f=contrib/60-libsigrok.rules)"
wget -O 61-libsigrok-uaccess.rules "[https://sigrok.org/gitweb/?p=libsigrok.git;a=blob_plain;f=contrib/61-libsigrok-uaccess.rules](https://sigrok.org/gitweb/?p=libsigrok.git;a=blob_plain;f=contrib/61-libsigrok-uaccess.rules)"
wget -O 61-libsigrok-plugdev.rules "[https://sigrok.org/gitweb/?p=libsigrok.git;a=blob_plain;f=contrib/61-libsigrok-plugdev.rules](https://sigrok.org/gitweb/?p=libsigrok.git;a=blob_plain;f=contrib/61-libsigrok-plugdev.rules)"
sudo udevadm control --reload-rules && sudo udevadm trigger
```

## Download the `.elf`  parse tool and `fwextract` tool

> Requires python3

```bash
mkdir -p /tmp/saleaeextract
cd /tmp/saleaeextract
wget -O parseelf.py "[http://sigrok.org/gitweb/?p=sigrok-util.git;a=blob;f=firmware/saleae-logic16/parseelf.py](http://sigrok.org/gitweb/?p=sigrok-util.git;a=blob;f=firmware/saleae-logic16/parseelf.py)"
wget -O sigrok-fwextract-saleae-logic16 "[http://sigrok.org/gitweb/?p=sigrok-util.git;a=blob;f=firmware/saleae-logic16/sigrok-fwextract-saleae-logic16](http://sigrok.org/gitweb/?p=sigrok-util.git;a=blob;f=firmware/saleae-logic16/sigrok-fwextract-saleae-logic16)"
```

> You may need to chmod +x `sigrok-fwextract-saleae-logic16`

## Download `Logic`

> [https://downloads.saleae.com/logic/1.2.10/Logic%201.2.10%20(64-bit).zip](https://downloads.saleae.com/logic/1.2.10/Logic%201.2.10%20(64-bit).zip)
> Place the Logic binary into `/tmp/saleaeextract`

## Extract the FX3 firmware and FPGA bitstreams
```bash
./sigrok-fwextract-saleae-logic16 Logic
saved 5217 bytes to saleae-logic16-fx2.fw
saved 149516 bytes to saleae-logic16-fpga-18.bitstream
saved 149516 bytes to saleae-logic16-fpga-33.bitstream
saved 178702 bytes from 46 blobs to saleae-logicpro16-fx3.fw
saved 178702 bytes from 46 blobs to saleae-logicpro8-fx3.fw
saved 465028 bytes to saleae-logicpro16-fpga.bitstream
saved 341160 bytes to saleae-logicpro8-fpga.bitstream
```

> Move the output files into a directory find-able by `Sigrok`

```bash
mkdir -p /home/$USER/snap/sigrok-suite/45/sigrok-firmware
cp * /home/$USER/snap/sigrok-suite/45/sigrok-firmware
```

> There are other directories you can put this in but I chose this one because its find-able by a non-sudo snapd program

### Run `PulseView`
1. Plug in your Saleae
2. Run using GUI/DE or run PulseView from CLI
```bash
env BAMF_DESKTOP_FILE_HINT=/var/lib/snapd/desktop/applications/sigrok-suite_pulseview.desktop /var/lib/snapd/snap/bin/sigrok-suite.pulseview --loglevel 5
```
#### *There's probably a much better way to run from CLI*

> Added `loglevel` for debugging to see errors

### Current Caveats
- I'm unable to run in the same session more than once. It results in a segmentation fault for every subsequent run that can only (Didn't debug it very much) be fixed by restarting the computer
    - this might just be for my computer
- Does not seem to work with XRDP, likely due to user environment being different on remote log in and not playing nice with snapd.
    - I might look into it but seems like a rabbit hole

## References
[https://sigrok.org/wiki/Saleae_Logic_Pro_16](https://sigrok.org/wiki/Saleae_Logic_Pro_16)
[https://snapcraft.io/docs/raw-usb-interface](https://snapcraft.io/docs/raw-usb-interface)
[https://gist.github.com/rikka0w0/9d134cfd9e68ea772995d876a3363797](https://gist.github.com/rikka0w0/9d134cfd9e68ea772995d876a3363797)
[https://cameronpavey.me/articles/setting-up-sigrok-pulseview-on-ubuntu](https://cameronpavey.me/articles/setting-up-sigrok-pulseview-on-ubuntu
