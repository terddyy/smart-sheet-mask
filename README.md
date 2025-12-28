# Smart Massage Mask

A Bluetooth-controlled smart massage mask system with ESP32 firmware and React Native Android app.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![Platform](https://img.shields.io/badge/platform-Android-green)
![Hardware](https://img.shields.io/badge/hardware-ESP32-red)

## 📋 Overview

Smart Massage Mask is a complete solution for controlling vibration motors via Bluetooth, featuring:

- **ESP32 Firmware** - Modular, production-ready controller with 3 massage patterns
- **React Native App** - Modern Android app with real-time Bluetooth control
- **Easy Setup** - Get started in under 5 minutes

## ✨ Features

### Hardware (ESP32)
- ✅ 8 independent motor channels
- ✅ Bluetooth Low Energy (BLE) communication
- ✅ 3 massage patterns (Pulse, Wave, Constant)
- ✅ Adjustable intensity (0-100%)
- ✅ Auto-timer with session management
- ✅ Safe PWM limits (70% max duty cycle)
- ✅ MVC architecture for maintainability

### Mobile App (Android)
- ✅ Real-time Bluetooth connectivity
- ✅ Intuitive pattern selection
- ✅ Live intensity control
- ✅ Configurable timers (15-60 minutes)
- ✅ Connection status monitoring
- ✅ Modern dark-themed UI
- ✅ Permission handling

## 🚀 Quick Start

### 1. Flash ESP32 (2 minutes)
```bash
# Open esp32-firmware/smart-massage-mask.ino in Arduino IDE
# Select board: ESP32 Dev Module
# Select port and click Upload
```

### 2. Build APK (15 minutes)
```bash
npm install
npm install -g eas-cli
eas login
eas build --profile preview --platform android
```

### 3. Test (2 minutes)
- Install APK on Android device
- Connect to "SMART_MassageMask" via app
- Start session and enjoy!

📖 **[Full Quick Start Guide](QUICKSTART.md)**

## 📚 Documentation

- **[QUICKSTART.md](QUICKSTART.md)** - Get running in 5 minutes
- **[BUILD_AND_TEST.md](BUILD_AND_TEST.md)** - Complete build & testing guide
- **[esp32-firmware/README.md](esp32-firmware/README.md)** - Firmware documentation

## 🛠️ Hardware Requirements

- ESP32 development board (with Bluetooth)
- 8 vibration motors (3-6V coin or cylindrical type)
- Motor driver (ULN2003, transistor array, or H-bridge)
- Power supply (5V 2A minimum)
- Android smartphone (API level 21+)

## 📱 App Screenshots

```
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│   Sleep Tab     │  │  Controls Tab   │  │  Settings Tab   │
│                 │  │                 │  │                 │
│  [Connection]   │  │  [Intensity]    │  │  [Bluetooth]    │
│  [Breathing]    │  │  [Patterns]     │  │  [Device Info]  │
│  [Quick Start]  │  │  [Timer]        │  │  [About]        │
│                 │  │  [Start/Stop]   │  │                 │
└─────────────────┘  └─────────────────┘  └─────────────────┘
```

## 🎨 Massage Patterns

| Pattern | Description | Use Case |
|---------|-------------|----------|
| **Pulse** | On-off cycles (300ms on / 700ms off) | Gentle relaxation |
| **Wave** | Sequential motor activation | Sleep induction |
| **Constant** | Continuous vibration | Deep relaxation |

## 🔌 Pin Configuration

Default ESP32 GPIO pins for motors:
```
Motor 1-8: GPIO 18, 19, 21, 22, 23, 25, 26, 27
```

Configurable in `esp32-firmware/config.h`

## 📦 Project Structure

```
smart-sheet-mask/
├── esp32-firmware/           # ESP32 firmware (Arduino)
│   ├── smart-massage-mask.ino
│   ├── config.h
│   ├── MotorController.h/.cpp
│   ├── SessionManager.h/.cpp
│   └── BluetoothHandler.h/.cpp
├── app/                      # React Native screens
├── components/               # UI components
├── services/                 # Bluetooth service
├── contexts/                 # State management
├── android/                  # Android native code
├── BUILD_AND_TEST.md        # Build guide
├── QUICKSTART.md            # Quick start
└── eas.json                 # Build configuration
```

## 🔧 Development

### ESP32 Firmware
```bash
# Open in Arduino IDE or PlatformIO
# Install ESP32 board support
# Upload to device
```

### React Native App
```bash
# Install dependencies
npm install

# Start development server
npm start

# Run on Android
npm run android

# Build APK
eas build --profile preview --platform android
```

## 📡 Bluetooth Protocol

### Commands (App → ESP32)
| Command | Format | Example | Description |
|---------|--------|---------|-------------|
| Mode | `Mxy\n` | `M245\n` | Mode 2, intensity 45% |
| Timer | `Tx\n` | `T1800\n` | 1800 seconds (30 min) |
| Status | `S\n` | `S\n` | Request status |

### Responses (ESP32 → App)
- `READY` - System initialized
- `OK: Mode=x Intensity=y` - Command accepted
- `STATUS: Mode=x Intensity=y TimeLeft=z` - Status
- `TIMER_COMPLETE` - Timer expired
- `ERROR: <message>` - Error

## 🧪 Testing

### Test ESP32 via Serial Monitor
```
M150    # Pulse mode, 50% intensity
M245    # Wave mode, 45% intensity
M340    # Constant mode, 40% intensity
M00     # Turn off
T60     # 60-second timer
S       # Request status
```

### Test Complete System
1. Upload firmware to ESP32
2. Install APK on Android device
3. Open app and connect
4. Start session with desired pattern
5. Verify motors respond correctly

## ⚠️ Safety Guidelines

- ⚠️ Start with low intensity (20-30%)
- ⚠️ Monitor motor temperature during use
- ⚠️ Never exceed motor current ratings
- ⚠️ Use current-limiting motor drivers
- ⚠️ Test thoroughly before extended use
- ⚠️ PWM is limited to 70% by default for safety

## 🤝 Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Follow MVC architecture principles
4. Test thoroughly
5. Submit a pull request

## 📝 Architecture Principles

### ESP32 Firmware
- **Model-View-Controller** pattern
- **Single Responsibility** - Each class has one job
- **Modularity** - Easy to extend and maintain
- **Safety First** - Hardware protection built-in
- **Max 300-400 lines per file** for readability

### React Native App
- **Context API** for state management
- **Service layer** for Bluetooth abstraction
- **Component-based** UI architecture
- **Error handling** throughout
- **User feedback** for all operations

## 🐛 Troubleshooting

### ESP32 Issues
- **Upload fails**: Hold BOOT button during upload
- **Motors don't work**: Check connections and power supply
- **BLE won't start**: Verify ESP32 has Bluetooth capability

### App Issues
- **Can't find device**: Enable Bluetooth and grant Location permission
- **Build fails**: Run `npm install` and check Node.js version
- **Connection timeout**: Move phone closer to ESP32

📖 **[Full Troubleshooting Guide](BUILD_AND_TEST.md#troubleshooting)**

## 📄 License

MIT License - See LICENSE file for details

## 🙏 Acknowledgments

- Built with Expo and React Native
- ESP32 Arduino framework
- react-native-ble-plx for Bluetooth

## 📞 Support

- 📖 Documentation: See guides in repository
- 🐛 Issues: Check Serial Monitor and app console
- 💬 Questions: Review BUILD_AND_TEST.md

---

**Made with ❤️ for better sleep**

*Version 1.0.0 - December 2025*
