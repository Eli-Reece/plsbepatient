## Install clang
```bash
# RHEL
yum install clang clang-tools-extra llvm
# Arch
pacman -S clang
# etc ...
```
## Clone your kernel
```bash
export KERNEL_REPO="https://github.com/Xilinx/linux-xlnx.git"
export KERNEL_VER="xlnx_rebase_v6.6_LTS_2024.2"
git clone --depth 1 -b ${KERNEL_VER} ${KERNEL_REPO}
cd linux-xlnx
git checkout -f
git clean -fdx
```

## Configure the kernel
```bash
make CC=clang defconfig
# or if you have a CROSS_COMPILER
make CC=clang ARCH=arm64 CROSS_COMPILE=aarch64-linux-gnu- defconfig
```

## Build the kernel
```bash
make CC=clang
# or if you have a CROSS_COMPILER
make CC=clang ARCH=arm64 CROSS_COMPILE=aarch64-linux-gnu-
```

## Generate the .json
```bash
python ./scripts/clang-tools/gen_compile_commands.py
find . -maxdepth 1 -type f -name "compile*"
./compile_commands.json
```

## Link the .json into your directory
```bash
cd ${mycodebase}
ln -s ${LINUX_ROOT}/src/kernel/linux-xlnx/compile_commands.json .
```

## Install Clangd Extension in VSCode
> You should also install the C/C++ extension

## Update your Makefile
```Makefile
# special target example for Clang compilation
clang:
$(MAKE) driver CC=clang ARCH=arm64 CROSS_COMPILE=aarch64-linux-gnu-
```

## (Optional) Add clangd arguments to your vscode/settings.json
```json
{
     ...,
     "clangd.arguments": [
       "--background-index",
       "--clang-tidy",
       "--header-insertion=never",
       "--suggest-missing-includes"
     ]
}
```
