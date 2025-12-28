# Manual ESP32 Core Installation Guide

## Problem
Arduino IDE/CLI times out downloading the large ESP32 package (356MB)

## Manual Installation Steps

### Step 1: Download ESP32 Core Manually

1. Go to: https://github.com/espressif/arduino-esp32/releases
2. Download the latest release ZIP file (e.g., `arduino-esp32-3.0.5.zip`)
3. Or use this direct download manager-friendly link:
   ```
   https://github.com/espressif/arduino-esp32/archive/refs/tags/3.0.5.zip
   ```

### Step 2: Extract to Arduino Directory

**Windows Location:**
```
C:\Users\Terddy.LAPTOP-CVSRCLGL\AppData\Local\Arduino15\packages\esp32\hardware\esp32\3.0.5\
```

1. Create the directory structure if it doesn't exist
2. Extract the ZIP contents there
3. The folder should contain: `boards.txt`, `platform.txt`, `cores/`, `libraries/`, etc.

### Step 3: Download Required Tools

ESP32 also needs compiler tools. Download from:
- https://github.com/espressif/arduino-esp32/releases

Look for "tools" in the Assets section of the release.

### Step 4: Restart Arduino IDE

After manual installation, restart Arduino IDE and the ESP32 boards should appear.

## Alternative: Use Download Manager

Use a download manager that supports resume (like IDM, Free Download Manager):

1. Get the direct download link from Arduino IDE's debug output
2. Paste into download manager
3. Download with retry/resume enabled
4. Once downloaded, Arduino IDE can use the cached file

## Easiest Solution: PlatformIO

PlatformIO has better download handling:

```powershell
# Install PlatformIO
pip install platformio

# Navigate to firmware folder
cd C:\Users\Terddy.LAPTOP-CVSRCLGL\Desktop\smart-sheet-mask\esp32-firmware

# Build and upload
pio run --target upload
```

PlatformIO automatically downloads ESP32 tools with better retry logic.
