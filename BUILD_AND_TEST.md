# Smart Massage Mask - Build & Testing Guide

## Project Overview
This project consists of two main components:
1. **ESP32 Firmware** - Bluetooth-enabled controller for the massage mask
2. **React Native App** - Mobile app for Android to control the device

## Prerequisites

### For React Native App
- Node.js (v18 or higher)
- npm or yarn
- Android Studio (for APK building)
- Java Development Kit (JDK 17)

### For ESP32 Firmware
- Arduino IDE or PlatformIO
- ESP32 Board Support Package
- USB cable for ESP32 programming

---

## Part 1: ESP32 Firmware Setup

### Step 1: Install Arduino IDE
1. Download Arduino IDE from https://www.arduino.cc/en/software
2. Install the ESP32 board package:
   - Open Arduino IDE
   - Go to **File → Preferences**
   - Add to **Additional Board Manager URLs**:
     ```
     https://raw.githubusercontent.com/espressif/arduino-esp32/gh-pages/package_esp32_index.json
     ```
   - Go to **Tools → Board → Boards Manager**
   - Search for "ESP32" and install "esp32 by Espressif Systems"

### Step 2: Upload Firmware to ESP32
1. Navigate to the `esp32-firmware` directory
2. Open `smart-massage-mask.ino` in Arduino IDE
3. Select your board:
   - **Tools → Board → ESP32 Arduino → ESP32 Dev Module** (or your specific board)
4. Select the COM port:
   - **Tools → Port → COM#** (the port your ESP32 is connected to)
5. Click **Upload** (→ button)
6. Wait for "Done uploading" message

### Step 3: Test ESP32
1. Open **Serial Monitor** (Tools → Serial Monitor)
2. Set baud rate to **115200**
3. You should see:
   ```
   Smart Massage Mask - Initializing...
   Motors initialized
   Bluetooth initialized: SMART_MassageMask
   System ready
   ```

### Step 4: Test Commands via Serial
In Serial Monitor, send these commands (ensure "Newline" is selected):
- `M150` - Pulse mode at 50% intensity
- `M245` - Wave mode at 45% intensity
- `M340` - Constant mode at 40% intensity
- `M00` - Turn off
- `T60` - Set 60-second timer
- `S` - Request status

---

## Part 2: React Native App Setup

### Step 1: Install Dependencies
```bash
cd c:\Users\Terddy.LAPTOP-CVSRCLGL\Desktop\smart-sheet-mask
npm install
```

### Step 2: Install EAS CLI (for building APK)
```bash
npm install -g eas-cli
```

### Step 3: Login to Expo
```bash
eas login
```
If you don't have an Expo account, create one at https://expo.dev/

### Step 4: Configure EAS Build
```bash
eas build:configure
```

This will create `eas.json` in your project root.

### Step 5: Build APK for Testing

#### Option A: Development Build (Recommended for Testing)
```bash
eas build --profile development --platform android
```

#### Option B: Preview Build (Standalone APK)
```bash
eas build --profile preview --platform android
```

#### Option C: Production Build
```bash
eas build --profile production --platform android
```

The build process will:
1. Upload your code to Expo servers
2. Build the APK in the cloud
3. Provide a download link when complete

### Step 6: Download and Install APK
1. Wait for build to complete (usually 10-20 minutes)
2. Download the APK from the provided link
3. Transfer APK to your Android device
4. Enable "Install from Unknown Sources" on your device
5. Install the APK

---

## Part 3: Local APK Build (Alternative Method)

### Prerequisites
- Android Studio installed
- Android SDK configured
- JDK 17 installed

### Step 1: Generate Android Build
```bash
npx expo prebuild --platform android
```

### Step 2: Build Debug APK
```bash
cd android
./gradlew assembleDebug
```

The APK will be at:
```
android/app/build/outputs/apk/debug/app-debug.apk
```

### Step 3: Build Release APK
```bash
cd android
./gradlew assembleRelease
```

Note: Release builds require signing. For testing, use debug builds.

---

## Part 4: Testing the Complete System

### Step 1: Prepare ESP32
1. Upload firmware to ESP32
2. Power on the device
3. Verify it's running (check Serial Monitor or LED indicators)

### Step 2: Install and Launch App
1. Install the APK on your Android device
2. Launch "Smart-sheet-mask" app
3. Grant Bluetooth and Location permissions when prompted

### Step 3: Connect to Device
1. Open the app
2. Navigate to the **Sleep** tab
3. Tap the **"Tap to Connect"** button
4. Wait for "Connected" status (should turn blue)

### Step 4: Test Controls
1. Navigate to the **Controls** tab
2. Adjust intensity slider (motors should respond in real-time if session is active)
3. Select a pattern (Pulse, Wave, or Constant)
4. Set a timer (15, 30, 45, or 60 minutes)
5. Tap **"Start Session"**
6. Verify motors are running with the selected pattern

### Step 5: Test Patterns

#### Pulse Pattern
- Motors turn on briefly, then off, repeatedly
- Default: 300ms on, 700ms off

#### Wave Pattern
- Motors activate sequentially, creating a wave effect
- Each motor activates for ~150ms

#### Constant Pattern
- All motors run continuously at selected intensity

### Step 6: Test Timer
1. Set timer to 1 minute (for quick testing)
2. Start session
3. Wait 1 minute
4. Verify motors stop automatically
5. Check for "TIMER_COMPLETE" message in Serial Monitor

---

## Troubleshooting

### ESP32 Issues

#### "Failed to connect to ESP32"
- Check USB cable
- Try different COM port
- Press and hold BOOT button while uploading
- Verify correct board selected in Arduino IDE

#### "Motors not running"
- Check motor pin connections
- Verify power supply is adequate
- Check motor driver circuit
- Increase MAX_DUTY_CYCLE in config.h

#### "Bluetooth won't start"
- Ensure ESP32 has Bluetooth (not all variants do)
- Restart ESP32
- Check for serial errors

### Android App Issues

#### "Build failed"
- Run `npm install` again
- Clear cache: `npm cache clean --force`
- Check Node.js version: `node --version` (should be 18+)
- Verify JDK 17 is installed

#### "Can't find device"
- Enable Bluetooth on phone
- Grant Location permissions
- Ensure ESP32 is powered on
- Check device name matches "SMART_MassageMask"
- Try restarting app

#### "Connection timeout"
- Move phone closer to ESP32
- Restart ESP32
- Clear Bluetooth cache on phone
- Unpair device from phone's Bluetooth settings

#### "Permissions denied"
- Go to App Settings
- Grant Bluetooth and Location permissions
- Restart app

### Integration Issues

#### "Commands not working"
- Check Bluetooth connection status
- Monitor Serial Monitor for command reception
- Verify command format in BluetoothService.ts
- Check for error messages in app console

#### "Motors respond incorrectly"
- Verify pattern mapping in controls.tsx
- Check intensity range (0-100)
- Monitor Serial Monitor for received commands
- Test commands manually via Serial Monitor

---

## Command Protocol Reference

### App to ESP32

| Command | Format | Example | Description |
|---------|--------|---------|-------------|
| Mode | `Mxy\n` | `M245\n` | Set mode x (0-3), intensity y (0-100) |
| Timer | `Tx\n` | `T1800\n` | Set timer for x seconds |
| Status | `S\n` | `S\n` | Request status update |

### Modes
- **0** = OFF
- **1** = PULSE
- **2** = WAVE
- **3** = CONSTANT

### ESP32 to App

| Response | Example | Description |
|----------|---------|-------------|
| Ready | `READY` | System initialized |
| OK | `OK: Mode=2 Intensity=45` | Command accepted |
| Status | `STATUS: Mode=2 Intensity=45 TimeLeft=120` | Status response |
| Timer Complete | `TIMER_COMPLETE` | Timer expired |
| Error | `ERROR: Invalid command` | Error occurred |

---

## Performance Tips

### For Best Results
1. Keep phone within 5-10 meters of ESP32
2. Avoid obstacles between phone and ESP32
3. Use good quality motors
4. Ensure adequate power supply for motors
5. Start with lower intensity and increase gradually

### Battery Life (ESP32)
- Active session: ~2-4 hours (depends on battery)
- Idle (Bluetooth on): ~8-12 hours
- Deep sleep mode: Not implemented (future feature)

---

## Next Steps

### Recommended Enhancements
1. Add battery monitoring in app
2. Implement session history
3. Add custom pattern designer
4. Enable firmware OTA updates
5. Add haptic feedback in app
6. Implement deep sleep mode for ESP32

### Safety Considerations
⚠️ **Important:**
- Never exceed motor current ratings
- Monitor motor temperature during use
- Start with low intensity
- Use current-limiting motor drivers
- Include emergency stop functionality
- Test thoroughly before extended use

---

## Support Files

- ESP32 Firmware: `esp32-firmware/`
- App Source: `app/`, `components/`, `services/`
- Build Configuration: `eas.json`, `app.json`
- Android Config: `android/`

## License
MIT License

## Contact
For issues or questions, refer to project documentation or create an issue in the repository.
