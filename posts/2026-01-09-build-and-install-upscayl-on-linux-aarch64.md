<!--metadata
date = 2026-01-09
-->

# Build and Install Upscayl on Linux aarch64 (Asahi Linux)

This guide documents the process for building [Upscayl](https://github.com/upscayl/upscayl) on aarch64 Linux systems, specifically on Asahi Linux (Fedora), but should be translatable to other aarch64 systems.

## Prerequisites

Install the required dependencies:

```bash
sudo dnf install vulkan-headers vulkan-loader-devel glslang libstdc++-static clang
```

### For RPM/DEB package builds

Electron-builder bundles an x86 version of FPM which doesn't work on aarch64. To build RPM or DEB packages, install the system FPM:

```bash
sudo dnf install ruby ruby-devel gcc make rpm-build
sudo gem install fpm
```

## Building upscayl-ncnn

The bundled `upscayl-bin` binary is x86-64 and must be rebuilt for aarch64.

### Clone and initialize the repository

```bash
git clone https://github.com/upscayl/upscayl-ncnn.git
cd upscayl-ncnn
git submodule update --init --recursive
```

### Build with Clang

GCC 15 has compatibility issues with ncnn's ARM assembly code (i8mm/fp16 vector instructions). Use Clang instead:

```bash
mkdir build && cd build
CC=clang CXX=clang++ cmake ../src
cmake --build . -j$(nproc)
```

This produces the `upscayl-bin` binary in the build directory.

### Install the binary

Copy the built binary to the Upscayl resources:

```bash
cp upscayl-bin /path/to/upscayl/resources/linux/bin/
```

## Building the Electron App

### Install dependencies

```bash
cd /path/to/upscayl
npm install
```

### Build for arm64

The default build targets x86-64. Explicitly specify arm64. Use `USE_SYSTEM_FPM=true` to build RPM/DEB packages (the bundled FPM is x86-only):

```bash
npm run build
USE_SYSTEM_FPM=true npx electron-builder --linux --arm64
```

This creates:
- `dist/linux-arm64-unpacked/` - Unpacked application directory
- `dist/upscayl-2.15.0-linux.AppImage` - AppImage (may not work on all systems)
- `dist/upscayl-2.15.0-linux.zip` - Zip archive
- `dist/upscayl-2.15.0-linux.rpm` - RPM package
- `dist/upscayl-2.15.0-linux.deb` - DEB package

## Running

Run the application from the unpacked directory:

```bash
./dist/linux-arm64-unpacked/upscayl
```

Or install the RPM (on Fedora):

```bash
sudo dnf install ./dist/upscayl-2.15.0-linux.rpm
```

