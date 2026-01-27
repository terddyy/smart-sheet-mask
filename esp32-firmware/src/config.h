#ifndef CONFIG_H
#define CONFIG_H

// Device Settings
#define DEVICE_NAME "SMART_MassageMask"
#define SERIAL_BAUD_RATE 115200

// BLE UUIDs (must match React Native app)
#define SERVICE_UUID        "0000FFE0-0000-1000-8000-00805F9B34FB"
#define CHARACTERISTIC_UUID "0000FFE1-0000-1000-8000-00805F9B34FB"

// Motor Configuration
#define NUM_MOTORS 8
const int MOTOR_PINS[NUM_MOTORS] = {18, 19, 21, 22, 23, 25, 26, 27};

// Battery Monitoring
#define BATTERY_PIN 34              // ADC1_CH6 (GPIO34) for battery voltage
#define BATTERY_VOLTAGE_DIVIDER 2.0 // Voltage divider ratio (R1=R2)
#define BATTERY_MIN_VOLTAGE 3.0     // Minimum battery voltage (3.0V for LiFePO4/Li-ion)
#define BATTERY_MAX_VOLTAGE 4.2     // Maximum battery voltage (4.2V for Li-ion, 3.65V for LiFePO4)
#define ADC_RESOLUTION 4095.0       // 12-bit ADC resolution
#define ADC_REFERENCE_VOLTAGE 3.3   // ESP32 ADC reference voltage

// PWM Settings
#define PWM_FREQUENCY 5000
#define PWM_RESOLUTION 8
#define MAX_DUTY_CYCLE 178  // 70% of 255 for safety

// Timing Configuration
#define UPDATE_INTERVAL_MS 50
#define PULSE_ON_DURATION_MS 500   // 0.5 seconds ON
#define PULSE_CYCLE_MS 1500        // 1.5 second total cycle (0.5s ON, 1s OFF)
#define WAVE_STEP_MS 200           // Wave moves faster between motors

// Heartbeat pattern timing
#define HEARTBEAT_SHORT_ON_MS 150
#define HEARTBEAT_SHORT_OFF_MS 100
#define HEARTBEAT_LONG_PAUSE_MS 700
#define HEARTBEAT_CYCLE_MS (HEARTBEAT_SHORT_ON_MS + HEARTBEAT_SHORT_OFF_MS + HEARTBEAT_SHORT_ON_MS + HEARTBEAT_LONG_PAUSE_MS)

// Raindrops pattern timing
#define RAINDROP_STEP_MS 150
#define RAINDROP_TAP_MS 80
#define RAINDROP_CHANCE_PERCENT 30  // 30% chance of a drop each step

// Command Protocol
#define CMD_MODE 'M'
#define CMD_TIMER 'T'
#define CMD_STATUS 'S'

// Operating Modes
enum MassageMode {
  MODE_OFF = 0,
  MODE_PULSE = 1,
  MODE_WAVE = 2,
  MODE_CONSTANT = 3,
  MODE_HEARTBEAT = 4,
  MODE_RAINDROPS = 5
};

#endif
