#ifndef CONFIG_H
#define CONFIG_H

// Device Settings
#define DEVICE_NAME "SMART_MassageMask"
#define SERIAL_BAUD_RATE 115200

// Motor Configuration
#define NUM_MOTORS 8
const int MOTOR_PINS[NUM_MOTORS] = {18, 19, 21, 22, 23, 25, 26, 27};

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
