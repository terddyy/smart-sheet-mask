# ESP32 Smart Massage Mask Migration Guide

## Overview
Your firmware has been optimized for ESP32 and is ready for deployment. The code is organized following clean architecture principles with separated concerns across multiple modules.

## Project Structure

```
esp32-firmware/
├── smart-massage-mask/
│   └── smart-massage-mask.ino (Main sketch)
├── BluetoothHandler.h/cpp (BLE communication)
├── MotorController.h/cpp (Motor PWM control)
├── SessionManager.h/cpp (State management)
└── config.h (Centralized configuration)
```

## Hardware Requirements

- **ESP32 Development Board** (e.g., ESP32-DevKitC)
- **8 Vibration Motors** connected to GPIO pins:
  - GPIO 18, 19, 21, 22, 23, 25, 26, 27
- **Power Supply**: 5V/2A minimum (motors require significant current)
- **USB Cable**: For programming and debugging

## Setup Instructions

### 1. Install Arduino IDE Support for ESP32

1. Open Arduino IDE
2. Go to **File → Preferences**
3. Add this URL to "Additional Boards Manager URLs":
   ```
   https://raw.githubusercontent.com/espressif/arduino-esp32/gh-pages/package_esp32_index.json
   ```
4. Go to **Tools → Board Manager**
5. Search for "ESP32" and install "esp32 by Espressif Systems"

### 2. Configure Arduino IDE

- **Board**: ESP32 Dev Module
- **Flash Frequency**: 80 MHz
- **Upload Speed**: 921600
- **CPU Frequency**: 80 MHz
- **Port**: COM port where ESP32 is connected

### 3. Upload Firmware

1. Connect ESP32 to your computer via USB
2. Open `smart-massage-mask/smart-massage-mask.ino` in Arduino IDE
3. Click **Sketch → Verify** to check for compilation errors
4. Click **Sketch → Upload** to program the ESP32

## Device Configuration

All settings are centralized in `config.h`:

```cpp
// Device Settings
#define DEVICE_NAME "SMART_MassageMask"  // Bluetooth device name
#define SERIAL_BAUD_RATE 115200

// Motor Configuration
#define NUM_MOTORS 8
const int MOTOR_PINS[NUM_MOTORS] = {18, 19, 21, 22, 23, 25, 26, 27};

// PWM Settings
#define PWM_FREQUENCY 5000              // 5 kHz PWM frequency
#define PWM_RESOLUTION 8                // 8-bit resolution (0-255)
#define MAX_DUTY_CYCLE 178              // 70% safety limit

// Timing Configuration
#define UPDATE_INTERVAL_MS 50           // Motor update frequency
#define PULSE_ON_DURATION_MS 300        // Pulse pattern timing
#define PULSE_CYCLE_MS 1000
#define WAVE_STEP_MS 150
```

## Command Protocol

The device accepts commands via Bluetooth (sent as text strings ending with newline):

### Mode Command: `Mxy`
- `x`: Mode (0-3)
  - `0` = OFF
  - `1` = PULSE
  - `2` = WAVE
  - `3` = CONSTANT
- `y`: Intensity (0-100)

**Example**: `M1100` → Pulse mode at 100% intensity

### Timer Command: `Tx`
- `x`: Duration in seconds

**Example**: `T300` → 5-minute session

### Status Command: `S`
- Request current device status
- Device responds with: `STATUS: Mode=... Intensity=... TimeLeft=...`

## Architecture Overview

### BluetoothHandler
- Manages BLE communication
- Parses incoming commands
- Sends status updates and notifications
- Uses `BluetoothSerial` class for ESP32 Classic BT

### MotorController
- Controls 8 PWM motors via ESP32's `ledc` APIs
- Implements motor patterns:
  - **Constant**: Steady vibration at specified intensity
  - **Pulse**: On/off cycling pattern
  - **Wave**: Sequential motor activation
- Intensity mapping: 0-100% → 0-178 duty cycle (PWM)

### SessionManager
- Tracks current mode and intensity
- Manages session timer
- Automatically stops motors when timer expires
- Provides state queries for status updates

## Testing Checklist

- [ ] Arduino IDE recognizes ESP32 board
- [ ] Code compiles without errors
- [ ] Firmware uploads successfully
- [ ] Serial monitor shows "System ready" on startup
- [ ] Mobile app can discover "SMART_MassageMask" device
- [ ] Can connect to device via Bluetooth
- [ ] Mode changes are reflected in serial output
- [ ] Motors respond to intensity commands
- [ ] Timer functionality works correctly
- [ ] Motors stop when timer expires

## Debugging

### Serial Monitor
1. Open **Tools → Serial Monitor**
2. Set baud rate to **115200**
3. Watch for debug messages during operation

### Common Issues

**Device not found during scan:**
- Verify Bluetooth is enabled on mobile
- Check device name in `config.h` matches app expectations
- Restart ESP32 (press RESET button)

**Motors not responding:**
- Verify GPIO pin connections in `config.h`
- Check power supply can handle motor current
- Test each motor individually with constant mode at 50% intensity

**Bluetooth disconnections:**
- Move ESP32 away from strong RF interference
- Ensure adequate power supply (motors draw peak current during operation)
- Check Bluetooth antenna connection (if detachable)

## Performance Notes

- **Update Interval**: Motor patterns refresh every 50ms for smooth operation
- **PWM Frequency**: 5 kHz chosen to minimize audible noise while maintaining control
- **Safety Limit**: Maximum duty cycle capped at 70% (178/255) to prevent motor burnout
- **BLE Bandwidth**: Commands processed at ~100Hz, sufficient for user input

## Next Steps

1. Upload firmware to ESP32
2. Verify basic functionality via serial monitor
3. Test mobile app connection
4. Verify all motor patterns work correctly
5. Conduct safety testing with intensity ramps

## Additional Resources

- [ESP32 Arduino Documentation](https://docs.espressif.com/projects/arduino-esp32/en/latest/)
- [ESP32 Pinout Reference](https://randomnerdtutorials.com/esp32-pinout-reference-which-gpio-pins-are-safe-to-use/)
- [LEDC PWM Controller](https://docs.espressif.com/projects/esp-idf/en/latest/esp32/api-reference/peripherals/ledc.html)
