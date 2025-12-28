# ESP32 Smart Massage Mask Firmware

## Hardware Requirements
- ESP32 development board with Bluetooth
- 8 vibration motors
- Motor driver circuit (e.g., ULN2003 or transistor array)
- Power supply appropriate for your motors

## Pin Configuration
Default motor pins (GPIO): 18, 19, 21, 22, 23, 25, 26, 27

## Installation

### Using Arduino IDE
1. Install Arduino IDE (1.8.x or 2.x)
2. Add ESP32 board support:
   - Go to File > Preferences
   - Add to Additional Board Manager URLs:
     `https://raw.githubusercontent.com/espressif/arduino-esp32/gh-pages/package_esp32_index.json`
   - Go to Tools > Board > Boards Manager
   - Search for "ESP32" and install "esp32 by Espressif Systems"

3. Open `smart-massage-mask.ino` in Arduino IDE
4. Select your ESP32 board: Tools > Board > ESP32 Arduino > (your board)
5. Select the correct COM port: Tools > Port
6. Click Upload

### Using PlatformIO
1. Install PlatformIO IDE or CLI
2. Create platformio.ini in the esp32-firmware directory:
```ini
[env:esp32dev]
platform = espressif32
board = esp32dev
framework = arduino
monitor_speed = 115200
```
3. Run `pio run --target upload`

## Bluetooth Protocol

### Commands from App to ESP32

#### Mode Command
Format: `Mxy\n`
- M: Mode command identifier
- x: Mode number (0-3)
  - 0 = OFF
  - 1 = PULSE
  - 2 = WAVE
  - 3 = CONSTANT
- y: Intensity (0-100)

Example: `M145\n` = Pulse mode at 45% intensity

#### Timer Command
Format: `Tx\n`
- T: Timer command identifier
- x: Duration in seconds

Example: `T1800\n` = Set 30-minute timer (1800 seconds)

#### Status Request
Format: `S\n`
- S: Status request identifier

### Responses from ESP32 to App

- `READY` - System initialized
- `OK: Mode=x Intensity=y` - Command accepted
- `STATUS: Mode=x Intensity=y TimeLeft=z` - Status response
- `TIMER_COMPLETE` - Timer expired
- `ERROR: <message>` - Error occurred

## Configuration

### Adjusting Motor Pins
Edit `config.h`:
```cpp
const int MOTOR_PINS[NUM_MOTORS] = {18, 19, 21, 22, 23, 25, 26, 27};
```

### Adjusting PWM Limits
For motor safety, max duty cycle is set to 70% (178/255).
Edit in `config.h`:
```cpp
#define MAX_DUTY_CYCLE 178  // Adjust as needed
```

### Adjusting Pattern Timing
Edit in `config.h`:
```cpp
#define PULSE_ON_DURATION_MS 300  // Pulse on-time
#define PULSE_CYCLE_MS 1000       // Pulse total cycle
#define WAVE_STEP_MS 150          // Wave motor transition
```

## Testing

### Serial Monitor Testing
1. Open Serial Monitor (115200 baud)
2. You should see startup messages
3. Send commands manually (ensure "Newline" ending is selected):
   - `M150` - Pulse mode, 50% intensity
   - `M345` - Constant mode, 45% intensity
   - `T60` - Set 60-second timer
   - `S` - Request status

### Bluetooth Testing
1. Use a Bluetooth Serial Terminal app (e.g., "Serial Bluetooth Terminal")
2. Connect to device "SMART_MassageMask"
3. Send the same commands as above

## Troubleshooting

### Motors Not Running
- Check motor pin connections
- Verify power supply is adequate
- Check MAX_DUTY_CYCLE isn't too low
- Verify motor driver circuit

### Bluetooth Won't Connect
- Ensure ESP32 has Bluetooth capability
- Check device name isn't already in use
- Restart ESP32
- Clear paired devices on phone

### Compile Errors
- Ensure ESP32 board package is installed
- Verify all .h and .cpp files are in same folder as .ino
- Check Arduino IDE/PlatformIO is up to date

## Safety Notes

⚠️ **Important Safety Information:**
- The firmware limits PWM to 70% duty cycle for motor safety
- Do not exceed motor current ratings
- Use appropriate motor drivers with current limiting
- Test thoroughly before extended use
- Monitor motor temperature during operation

## License
MIT License - See project root for details
