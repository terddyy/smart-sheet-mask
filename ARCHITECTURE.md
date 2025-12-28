# System Architecture Diagram

## Complete System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                     SMART MASSAGE MASK SYSTEM                   │
└─────────────────────────────────────────────────────────────────┘

┌───────────────────────┐                    ┌──────────────────────┐
│   ANDROID PHONE       │                    │    ESP32 DEVICE      │
│                       │                    │                      │
│  ┌─────────────────┐  │                    │  ┌────────────────┐  │
│  │  React Native   │  │                    │  │  Arduino FW    │  │
│  │      App        │  │                    │  │   (C++)        │  │
│  └─────────────────┘  │                    │  └────────────────┘  │
│          │            │   Bluetooth LE     │          │           │
│          │            │◄──────────────────►│          │           │
│  ┌───────▼─────────┐  │    Commands &      │  ┌───────▼────────┐  │
│  │ Bluetooth       │  │    Responses       │  │ Bluetooth      │  │
│  │ Service Layer   │  │                    │  │ Handler        │  │
│  └───────┬─────────┘  │                    │  └───────┬────────┘  │
│          │            │                    │          │           │
│  ┌───────▼─────────┐  │                    │  ┌───────▼────────┐  │
│  │ UI Components   │  │                    │  │ Session        │  │
│  │ - Dashboard     │  │                    │  │ Manager        │  │
│  │ - Controls      │  │                    │  └───────┬────────┘  │
│  │ - Settings      │  │                    │          │           │
│  └─────────────────┘  │                    │  ┌───────▼────────┐  │
└───────────────────────┘                    │  │ Motor          │  │
                                             │  │ Controller     │  │
                                             │  └───────┬────────┘  │
                                             │          │           │
                                             │  ┌───────▼────────┐  │
                                             │  │ PWM Channels   │  │
                                             │  │ (8 motors)     │  │
                                             │  └───────┬────────┘  │
                                             └──────────┼───────────┘
                                                        │
                                          ┌─────────────▼─────────────┐
                                          │   MOTOR DRIVER CIRCUIT    │
                                          │  (ULN2003 or equivalent)  │
                                          └─────────────┬─────────────┘
                                                        │
                          ┌─────────┬─────────┬─────────┴─────────┬─────────┬─────────┬─────────┬─────────┐
                          │         │         │         │         │         │         │         │         │
                      ┌───▼───┐ ┌───▼───┐ ┌───▼───┐ ┌───▼───┐ ┌───▼───┐ ┌───▼───┐ ┌───▼───┐ ┌───▼───┐
                      │Motor 1│ │Motor 2│ │Motor 3│ │Motor 4│ │Motor 5│ │Motor 6│ │Motor 7│ │Motor 8│
                      │GPIO 18│ │GPIO 19│ │GPIO 21│ │GPIO 22│ │GPIO 23│ │GPIO 25│ │GPIO 26│ │GPIO 27│
                      └───────┘ └───────┘ └───────┘ └───────┘ └───────┘ └───────┘ └───────┘ └───────┘
```

---

## Communication Flow

```
┌──────────────┐                                      ┌──────────────┐
│              │  1. User selects pattern & intensity │              │
│   MOBILE     │─────────────────────────────────────►│    ESP32     │
│     APP      │                                      │   FIRMWARE   │
│              │  2. Sends: "M245\n" (Wave, 45%)      │              │
└──────────────┘                                      └──────────────┘
       │                                                      │
       │                                                      ▼
       │                                              ┌──────────────┐
       │                                              │ Parse Command│
       │                                              │ M=Mode       │
       │                                              │ 2=Wave       │
       │                                              │ 45=Intensity │
       │                                              └──────┬───────┘
       │                                                      │
       │                                                      ▼
       │                                              ┌──────────────┐
       │                                              │Update Session│
       │                                              │ Manager      │
       │                                              └──────┬───────┘
       │                                                      │
       │  3. Receives: "OK: Mode=2 Intensity=45"             ▼
       │◄─────────────────────────────────────────   ┌──────────────┐
       │                                              │Apply Pattern │
       │                                              │to Motors     │
       │                                              └──────┬───────┘
       │                                                      │
       │                                                      ▼
       │                                              ┌──────────────┐
       │                                              │Motors Vibrate│
       │                                              │in Wave       │
       │                                              │Pattern       │
       │                                              └──────────────┘
       │
       │  4. After timer expires:
       │◄─────────────────────────────────────────
       │     "TIMER_COMPLETE"
       │
       ▼
┌──────────────┐
│Update UI     │
│Show Complete │
└──────────────┘
```

---

## Software Architecture

### ESP32 Firmware (MVC Pattern)

```
┌─────────────────────────────────────────────┐
│            MAIN LOOP (Controller)           │
│  - Handle Bluetooth commands                │
│  - Check timer                              │
│  - Update motor patterns                    │
└────────┬────────────────────┬───────────────┘
         │                    │
         │                    │
    ┌────▼─────────┐    ┌────▼──────────┐
    │   MODELS     │    │   HANDLERS    │
    │              │    │               │
    │ Session      │    │ Bluetooth     │
    │ Manager      │    │ Handler       │
    │ - Mode       │    │ - Parse cmds  │
    │ - Intensity  │    │ - Send resp   │
    │ - Timer      │    │ - Events      │
    └────┬─────────┘    └───────────────┘
         │
    ┌────▼─────────┐
    │ Motor        │
    │ Controller   │
    │ - PWM setup  │
    │ - Patterns   │
    │ - Safety     │
    └──────────────┘
```

### React Native App (Layered Architecture)

```
┌─────────────────────────────────────────────┐
│           PRESENTATION LAYER                │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  │Dashboard │  │ Controls │  │ Settings │  │
│  │ Screen   │  │  Screen  │  │  Screen  │  │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  │
└───────┼─────────────┼─────────────┼─────────┘
        │             │             │
┌───────▼─────────────▼─────────────▼─────────┐
│          STATE MANAGEMENT LAYER             │
│  ┌──────────────────────────────────────┐   │
│  │      Bluetooth Context Provider      │   │
│  │  - Connection state                  │   │
│  │  - Command methods                   │   │
│  │  - Error handling                    │   │
│  └──────────────┬───────────────────────┘   │
└─────────────────┼───────────────────────────┘
                  │
┌─────────────────▼───────────────────────────┐
│           SERVICE LAYER                     │
│  ┌──────────────────────────────────────┐   │
│  │      Bluetooth Service               │   │
│  │  - BLE Manager                       │   │
│  │  - Device scanning                   │   │
│  │  - Connection management             │   │
│  │  - Command transmission              │   │
│  └──────────────┬───────────────────────┘   │
└─────────────────┼───────────────────────────┘
                  │
┌─────────────────▼───────────────────────────┐
│         NATIVE BLUETOOTH LAYER              │
│  react-native-ble-plx (BleManager)          │
└─────────────────┬───────────────────────────┘
                  │
        ┌─────────▼──────────┐
        │  ANDROID BLUETOOTH │
        │      HARDWARE      │
        └────────────────────┘
```

---

## Data Flow

### Starting a Session

```
User Action                App Processing              ESP32 Processing           Hardware
───────────                ──────────────              ─────────────────           ────────

1. Select Wave
2. Set 45% intensity
3. Set 30min timer
4. Tap "Start"
                          ↓
                    useBluetooth.setMode(2, 45)
                          ↓
                    BluetoothService.setMode()
                          ↓
                    Send: "M245\n"
                          ↓
                    BluetoothService.setTimer()
                          ↓
                    Send: "T1800\n"
                          ═════════════════════════════►
                                                    BluetoothHandler
                                                    receives commands
                                                         ↓
                                                    Parse & validate
                                                         ↓
                                                    SessionManager
                                                    .setMode(WAVE)
                                                    .setIntensity(45)
                                                    .setTimer(1800)
                                                         ↓
                                                    MotorController
                                                    .applyWave(45)
                                                         ↓
                                                    Calculate PWM
                                                    duty = 79 (45%)
                                                         ↓
                                                    Update PWM
                                                    channels
                                                                    ═════════════►
                                                                               Motors
                                                                               vibrate in
                                                                               wave pattern
                    ◄═════════════════════════════
                    Receive: "OK: Mode=2..."
                          ↓
                    Update UI state
                          ↓
                    Show session active
```

---

## Protocol Messages

### Command Format
```
┌─────┬────────┬──────────┬────┐
│ Cmd │  Mode  │Intensity │ \n │
│  M  │  0-3   │  0-100   │    │
└─────┴────────┴──────────┴────┘
Example: M245\n

┌─────┬──────────┬────┐
│ Cmd │ Seconds  │ \n │
│  T  │   1-9999 │    │
└─────┴──────────┴────┘
Example: T1800\n

┌─────┬────┐
│ Cmd │ \n │
│  S  │    │
└─────┴────┘
Example: S\n
```

### Response Format
```
┌──────────────────────────────┐
│ READY                        │  Startup message
└──────────────────────────────┘

┌──────────────────────────────┐
│ OK: Mode=2 Intensity=45      │  Command accepted
└──────────────────────────────┘

┌──────────────────────────────────────────────────┐
│ STATUS: Mode=2 Intensity=45 TimeLeft=1740        │  Status response
└──────────────────────────────────────────────────┘

┌──────────────────────────────┐
│ TIMER_COMPLETE               │  Timer expired
└──────────────────────────────┘

┌──────────────────────────────┐
│ ERROR: Invalid command       │  Error message
└──────────────────────────────┘
```

---

## Motor Patterns

### Pulse Pattern
```
Time:    0ms  300ms  700ms  1000ms 1300ms 1700ms
         ┌───┐      ┌───┐       ┌───┐
Motors:  │ON │ OFF  │ON │  OFF  │ON │  OFF
         └───┘      └───┘       └───┘
         ├────────────┬──────────────┘
              1 second cycle
```

### Wave Pattern
```
Time:    0ms  150ms  300ms  450ms  600ms  750ms
Motor 1: ■■■
Motor 2:      ■■■
Motor 3:           ■■■
Motor 4:                 ■■■
Motor 5:                       ■■■
Motor 6:                             ■■■
Motor 7: (continues...)
Motor 8: (continues...)
```

### Constant Pattern
```
Time:    0ms ────────────────────────────────► ∞
         ┌─────────────────────────────────────┐
Motors:  │          ALL ON CONTINUOUSLY         │
         └─────────────────────────────────────┘
```

---

## File Organization

```
smart-sheet-mask/
│
├── esp32-firmware/              ← ESP32 C++ code
│   ├── smart-massage-mask.ino   ← Main entry point
│   ├── config.h                 ← Configuration
│   ├── MotorController.h/.cpp   ← Motor control
│   ├── SessionManager.h/.cpp    ← State management
│   ├── BluetoothHandler.h/.cpp  ← BLE communication
│   └── README.md                ← Firmware docs
│
├── app/                         ← React Native screens
│   ├── _layout.tsx              ← App wrapper
│   ├── index.tsx                ← Dashboard screen
│   ├── controls.tsx             ← Control screen
│   └── settings.tsx             ← Settings screen
│
├── services/                    ← Business logic
│   └── BluetoothService.ts      ← BLE service
│
├── contexts/                    ← State management
│   └── BluetoothContext.tsx     ← BLE context
│
├── components/                  ← Reusable UI
│   ├── BreathingRing.tsx
│   ├── IntensitySlider.tsx
│   └── PatternCarousel.tsx
│
├── android/                     ← Android native code
│   └── app/src/main/
│       └── AndroidManifest.xml  ← Permissions
│
├── Documentation/
│   ├── START_HERE.md            ← Quick start
│   ├── QUICKSTART.md            ← 5-min guide
│   ├── BUILD_AND_TEST.md        ← Complete guide
│   ├── ARCHITECTURE.md          ← This file
│   └── IMPLEMENTATION_SUMMARY.md ← What was built
│
├── package.json                 ← Dependencies
├── eas.json                     ← Build config
└── README.md                    ← Project overview
```

---

## Hardware Wiring

```
ESP32                   Motor Driver (ULN2003)              Motors
─────                   ──────────────────────              ──────

GPIO 18 ────────────────► IN1  ───────► OUT1 ──────────► Motor 1 (+)
                                                            │
GPIO 19 ────────────────► IN2  ───────► OUT2 ──────────► Motor 2 (+)
                                                            │
GPIO 21 ────────────────► IN3  ───────► OUT3 ──────────► Motor 3 (+)
                                                            │
GPIO 22 ────────────────► IN4  ───────► OUT4 ──────────► Motor 4 (+)
                                                            │
GPIO 23 ────────────────► IN5  ───────► OUT5 ──────────► Motor 5 (+)
                                                            │
GPIO 25 ────────────────► IN6  ───────► OUT6 ──────────► Motor 6 (+)
                                                            │
GPIO 26 ────────────────► IN7  ───────► OUT7 ──────────► Motor 7 (+)
                                                            │
GPIO 27 ────────────────► IN8  ───────► OUT8 ──────────► Motor 8 (+)
                                                            │
                                                            │
GND ────────────────────► COM ─────────────────────────────┘
                                                  (Motors common ground)

5V ──────────────────────► VCC
                         (Driver power)

Note: ULN2003 can sink current, so motor + connects to driver output,
      motor - connects to power supply +
```

---

## Power Requirements

```
Component          Voltage    Current      Notes
─────────          ───────    ───────      ─────
ESP32              3.3V       ~240mA       From USB or regulator
Vibration Motors   3-6V       50-100mA ea  8 motors = 400-800mA total
Motor Driver       5V         10mA         Logic power
─────────────────────────────────────────────────────────────────
Total Power        5V         ~1.5A        Use 5V 2A power supply

Recommended: 5V 2A power supply with voltage regulator for stable operation
```

---

## Safety Circuit (Recommended)

```
        ┌──────────┐
5V ─────┤ Fuse 2A  ├─────► Motor Driver VCC
        └──────────┘
             │
        ┌────▼────┐
        │ Diodes  │  (Flyback protection)
        └─────────┘
             │
        ┌────▼────┐
        │ Caps    │  (Noise filtering)
        │ 100µF   │
        └─────────┘
```

---

This architecture provides:
✅ Modular design
✅ Clear separation of concerns
✅ Scalable and maintainable
✅ Safe operation
✅ Real-time communication
✅ Error handling throughout
