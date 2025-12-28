# Smart Massage Mask - Quick Start Guide

## 🚀 Get Started in 5 Minutes

### What You Need
- ESP32 development board
- 8 vibration motors + motor driver
- Android phone
- USB cable
- Arduino IDE or PlatformIO

---

## Step 1: Flash ESP32 Firmware (2 minutes)

1. **Install Arduino IDE** from https://www.arduino.cc/en/software

2. **Add ESP32 Support:**
   - File → Preferences
   - Add to Additional Board Manager URLs:
     ```
     https://raw.githubusercontent.com/espressif/arduino-esp32/gh-pages/package_esp32_index.json
     ```
   - Tools → Board → Boards Manager → Search "ESP32" → Install

3. **Upload Firmware:**
   - Open `esp32-firmware/smart-massage-mask.ino`
   - Tools → Board → ESP32 Dev Module
   - Tools → Port → (Select your ESP32)
   - Click Upload ↑

4. **Verify:**
   - Tools → Serial Monitor (115200 baud)
   - Should see: `System ready`

---

## Step 2: Build Android APK (1 minute setup + 15 min build)

### Option A: Cloud Build (Easiest)

```bash
# Install dependencies
npm install

# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login

# Build APK
eas build --profile preview --platform android
```

Download APK when build completes (~15 minutes).

### Option B: Local Build

```bash
# Install dependencies
npm install

# Generate native code
npx expo prebuild --platform android

# Build APK
cd android
./gradlew assembleDebug
```

APK location: `android/app/build/outputs/apk/debug/app-debug.apk`

---

## Step 3: Install & Test (2 minutes)

1. **Transfer APK to Phone:**
   - Download APK from EAS build link or copy from local build
   - Enable "Install from Unknown Sources"
   - Install APK

2. **Launch App:**
   - Open "Smart-sheet-mask" app
   - Grant Bluetooth and Location permissions

3. **Connect to ESP32:**
   - Tap "Tap to Connect" on Sleep tab
   - Wait for blue "Connected" status

4. **Start Session:**
   - Go to Controls tab
   - Set intensity (50% recommended)
   - Choose pattern (Wave)
   - Set timer (1 minute for testing)
   - Tap "Start Session"

5. **Verify:**
   - Motors should activate with wave pattern
   - After 1 minute, motors stop automatically

---

## 🎉 Success!

Your Smart Massage Mask is now running!

### Next Steps:
- Adjust intensity to your preference
- Try different patterns (Pulse, Wave, Constant)
- Set longer timers (15-60 minutes)
- Monitor Serial Monitor for debugging

---

## 🔧 Quick Troubleshooting

### ESP32 Won't Upload
- Press and hold BOOT button while uploading
- Try different USB cable
- Check COM port selection

### App Can't Find Device
- Ensure ESP32 is powered on
- Check Bluetooth is enabled
- Grant Location permission
- Restart ESP32 and app

### Motors Don't Work
- Check motor connections (pins 18,19,21,22,23,25,26,27)
- Verify power supply is adequate
- Check motor driver circuit
- Test with Serial Monitor commands: `M350`

---

## 📚 Full Documentation

For detailed instructions, see:
- [BUILD_AND_TEST.md](BUILD_AND_TEST.md) - Complete build guide
- [esp32-firmware/README.md](esp32-firmware/README.md) - Firmware details
- [TROUBLESHOOTING.md](TROUBLESHOOTING.md) - Common issues

---

## 💡 Command Quick Reference

Test via Serial Monitor (115200 baud):

| Command | Action |
|---------|--------|
| `M150` | Pulse mode, 50% intensity |
| `M245` | Wave mode, 45% intensity |
| `M340` | Constant mode, 40% intensity |
| `M00` | Turn off |
| `T60` | 60-second timer |
| `S` | Get status |

---

## ⚠️ Safety First

- Start with low intensity (20-30%)
- Monitor motor temperature
- Never exceed motor current ratings
- Use current-limiting motor drivers
- Test thoroughly before extended use

---

## 🎯 Hardware Setup

### Pin Connections (ESP32)
```
Motor 1 → GPIO 18
Motor 2 → GPIO 19
Motor 3 → GPIO 21
Motor 4 → GPIO 22
Motor 5 → GPIO 23
Motor 6 → GPIO 25
Motor 7 → GPIO 26
Motor 8 → GPIO 27
```

### Recommended Hardware
- ESP32 DevKit V1 or similar
- ULN2003 motor driver or transistor array
- 3-6V vibration motors (coin or cylindrical)
- Power supply: 5V 2A minimum

---

## 📱 App Features

- **Real-time Bluetooth control**
- **3 massage patterns** (Pulse, Wave, Constant)
- **Adjustable intensity** (0-100%)
- **Auto-timer** (15, 30, 45, 60 minutes)
- **Connection status** monitoring
- **Modern UI** with dark theme

---

## 🛠️ Development

### ESP32 Firmware Structure
```
esp32-firmware/
├── smart-massage-mask.ino  (Main file)
├── config.h                (Settings)
├── MotorController.h/.cpp  (Motor control)
├── SessionManager.h/.cpp   (State management)
└── BluetoothHandler.h/.cpp (BLE communication)
```

### React Native App Structure
```
app/              (Screens)
components/       (UI components)
services/         (Bluetooth service)
contexts/         (State management)
```

---

## 📄 License

MIT License - Free to use and modify

---

## 🚨 Need Help?

1. Check [BUILD_AND_TEST.md](BUILD_AND_TEST.md)
2. Review Serial Monitor output
3. Verify hardware connections
4. Test with manual commands
5. Check app console logs

Happy Relaxing! 😴✨
