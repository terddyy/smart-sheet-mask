# Battery Monitoring Implementation - Summary

## ✅ Completed Implementation

Battery voltage reading has been successfully added to your ESP32 Smart Massage Mask system.

---

## ESP32 Firmware Changes

### 1. Configuration ([config.h](esp32-firmware/src/config.h))
Added battery monitoring settings:
```cpp
#define BATTERY_PIN 34              // GPIO34 (ADC1_CH6) for battery voltage
#define BATTERY_VOLTAGE_DIVIDER 2.0 // Voltage divider ratio
#define BATTERY_MIN_VOLTAGE 3.3     // Minimum voltage (3.3V)
#define BATTERY_MAX_VOLTAGE 4.2     // Maximum voltage (4.2V for Li-ion)
#define ADC_RESOLUTION 4095.0       // 12-bit ADC
#define ADC_REFERENCE_VOLTAGE 3.3   // ESP32 reference voltage
```

### 2. SessionManager ([SessionManager.h/cpp](esp32-firmware/src/SessionManager.h))
Added methods:
- `getBatteryVoltage()` - Returns voltage in volts
- `getBatteryPercentage()` - Returns 0-100% battery level

### 3. BluetoothHandler ([BluetoothHandler.cpp](esp32-firmware/src/BluetoothHandler.cpp))
Updated status response:
```cpp
// Before: "STATUS: Mode=2 Intensity=50 TimeLeft=300"
// Now:    "STATUS: Mode=2 Intensity=50 TimeLeft=300 Battery=87"
```

### 4. Main Setup ([main.cpp](esp32-firmware/src/main.cpp))
Initialized battery monitoring:
```cpp
pinMode(BATTERY_PIN, INPUT);
analogReadResolution(12);  // 12-bit ADC
```

---

## React Native App Changes

### 1. BluetoothService ([services/BluetoothService.ts](services/BluetoothService.ts))
Added:
- `startMonitoring()` - Subscribes to ESP32 characteristic for responses
- `handleResponse()` - Processes incoming messages
- `parseStatus()` - Parses status including battery level
- Event emission for: `ready`, `commandAck`, `error`, `status`, `timerComplete`

### 2. Dashboard UI ([app/index.tsx](app/index.tsx))
Updated:
- Added battery state management with `useState`
- Added `useEffect` to listen for status updates
- Changed hardcoded `87%` to dynamic `{batteryLevel}%`
- Requests initial status when connected

---

## Hardware Setup Required

### Voltage Divider Circuit

Connect battery voltage to ESP32 GPIO34 through voltage divider:

```
Battery+ ----[R1 10kΩ]---+---[R2 10kΩ]---- GND
                          |
                      GPIO34 (ADC)
```

**Why needed:**
- ESP32 ADC max input: 3.3V
- Li-ion battery max: 4.2V
- Voltage divider reduces 4.2V → 2.1V (safe for ESP32)
- Code multiplies by 2.0 to get actual battery voltage

**Formula:**
```
V_adc = V_battery × (R2 / (R1 + R2))
With R1=R2: V_adc = V_battery / 2
```

---

## Testing

### Test ESP32 Battery Reading

1. **Serial Monitor Test:**
   ```bash
   pio device monitor --port COM6 --baud 115200
   ```
   
2. **Send Status Command:**
   - Connect via Bluetooth from phone
   - Send `S` command
   - Check response: `STATUS: Mode=0 Intensity=0 TimeLeft=0 Battery=XX`

3. **Expected Values:**
   - **No battery connected (GPIO34 floating):** Random value 0-100%
   - **With voltage divider:** Actual battery percentage based on voltage
   - **GPIO34 to GND:** ~0%
   - **GPIO34 to 3.3V via divider:** ~100%

### Test React Native App

1. Connect to ESP32
2. Check dashboard - battery should update from default 87% to real value
3. Battery updates automatically with status responses

---

## Status Response Format

ESP32 now sends:
```
STATUS: Mode=2 Intensity=50 TimeLeft=1800 Battery=87
```

Parsed by app as:
```typescript
{
  mode: 2,
  intensity: 50,
  timeLeft: 1800,  // seconds
  battery: 87      // percentage
}
```

---

## Next Steps (Optional Enhancements)

1. **Auto Status Polling:**
   - Add timer to request status every 10 seconds when connected
   - Keep UI updated with remaining time and battery

2. **Low Battery Warning:**
   - Alert user when battery < 20%
   - Disable session start when battery < 10%

3. **Battery History:**
   - Track battery drain during sessions
   - Estimate remaining session time based on battery

4. **Calibration:**
   - Fine-tune `BATTERY_MIN_VOLTAGE` and `BATTERY_MAX_VOLTAGE` based on actual battery
   - Add offset correction if needed

---

## Files Modified

### ESP32 Firmware:
- ✅ `esp32-firmware/src/config.h`
- ✅ `esp32-firmware/src/SessionManager.h`
- ✅ `esp32-firmware/src/SessionManager.cpp`
- ✅ `esp32-firmware/src/BluetoothHandler.cpp`
- ✅ `esp32-firmware/src/main.cpp`

### React Native App:
- ✅ `services/BluetoothService.ts`
- ✅ `app/index.tsx`

### Firmware Status:
- ✅ **Compiled successfully**
- ✅ **Uploaded to ESP32 COM6**
- ✅ **Ready to use**

---

## Troubleshooting

**Battery shows 0% or 100% constantly:**
- Check voltage divider resistor values
- Verify GPIO34 connection
- Test with multimeter: should read ~2.1V at GPIO34 for 4.2V battery

**Battery value doesn't update in app:**
- Check Bluetooth connection
- Verify `S` command is sent/received
- Check browser/metro console for errors
- Ensure status event listener is registered

**Random battery values:**
- GPIO34 is floating (not connected)
- This is normal without battery/voltage divider
- ESP32 ADC reads noise when input is floating
