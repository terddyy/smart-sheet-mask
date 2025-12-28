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
#define BATTERY_MIN_VOLTAGE 3.3     // Minimum battery voltage (3.3V)
#define BATTERY_MAX_VOLTAGE 4.2     // Maximum battery voltage (4.2V for Li-ion)
#define ADC_RESOLUTION 4095.0       // 12-bit ADC resolution
#define ADC_REFERENCE_VOLTAGE 3.3   // ESP32 ADC reference voltage

// PWM Settings
#define PWM_FREQUENCY 5000
#define PWM_RESOLUTION 8
#define MAX_DUTY_CYCLE 178  // 70% of 255 for safety

// Timing Configuration
#define UPDATE_INTERVAL_MS 50
#define PULSE_ON_DURATION_MS 300
#define PULSE_CYCLE_MS 1000
#define WAVE_STEP_MS 150

// Command Protocol
#define CMD_MODE 'M'
#define CMD_TIMER 'T'
#define CMD_STATUS 'S'

// Operating Modes
enum MassageMode {
  MODE_OFF = 0,
  MODE_PULSE = 1,
  MODE_WAVE = 2,
  MODE_CONSTANT = 3
};

#endif
