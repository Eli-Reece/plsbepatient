summary: Partition a new disk for an Arch install

1. Start fdisk on your target disk (replace X with the appropriate letter):
```bash
sudo fdisk /dev/sdX
```

2. Create a new GPT partition table (for UEFI systems):
```bash
Command (m for help): g
```

3. Create EFI System Partition (ESP):
```bash
Command (m for help): n
Partition number: 1
First sector: [Press Enter for default]
Last sector: +1G


Command (m for help): t
Partition type or alias: 1
```

4. Create swap partition (optional, size depends on your RAM):
```bash
Command (m for help): n
Partition number: 2
First sector: [Press Enter for default]
Last sector: +4G  # Adjust size as needed

Command (m for help): t
Partition number: 2
Partition type or alias: 19
```

5. Create root partition:
```bash
Command (m for help): n
Partition number: 3
First sector: [Press Enter for default]
Last sector: [Press Enter to use remaining space]
```

6. Set partition types (if not already set):
```bash
Command (m for help): t
Partition number: 1
Partition type or alias: 1  # EFI System

Command (m for help): t
Partition number: 2
Partition type or alias: 19  # Linux swap

Command (m for help): t
Partition number: 3
Partition type or alias: 20  # Linux filesystem
```

7. Print the partition table to verify:
```bash
Command (m for help): p
```

8. Write changes and exit:
```bash
Command (m for help): w
```

9. Format the partitions:
```bash
sudo mkfs.fat -F32 /dev/sdX1  # EFI partition
sudo mkswap /dev/sdX2         # Swap partition
sudo mkfs.ext4 /dev/sdX3      # Root partition
```

10. Mount the partitions:
```bash
sudo mount /dev/sdX3 /mnt
sudo mkdir /mnt/boot
sudo mount /dev/sdX1 /mnt/boot
sudo swapon /dev/sdX2
```
