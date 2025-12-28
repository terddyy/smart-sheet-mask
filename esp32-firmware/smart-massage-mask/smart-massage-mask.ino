#include "config.h"
#include "MotorController.h"
#include "SessionManager.h"
#include "BluetoothHandler.h"

// Global instances
MotorController motorController(MOTOR_PINS, NUM_MOTORS, MAX_DUTY_CYCLE);
SessionManager sessionManager;
BluetoothSerial serialBT;
BluetoothHandler bluetoothHandler(&serialBT, &sessionManager);

unsigned long lastUpdateTime = 0;

void setup() {
  // Initialize serial for debugging
  Serial.begin(SERIAL_BAUD_RATE);
  Serial.println("Smart Massage Mask - Initializing...");
  
  // Initialize motor controller
  if (!motorController.begin()) {
    Serial.println("ERROR: Motor initialization failed!");
    while (1) delay(1000);  // Halt on critical error
  }
  Serial.println("Motors initialized");
  
  // Initialize Bluetooth
  if (!bluetoothHandler.begin(DEVICE_NAME)) {
    Serial.println("ERROR: Bluetooth initialization failed!");
    while (1) delay(1000);  // Halt on critical error
  }
  Serial.println("Bluetooth initialized: " + String(DEVICE_NAME));
  
  Serial.println("System ready");
}

void loop() {
  // Handle incoming Bluetooth commands
  bluetoothHandler.handleCommands();
  
  // Check if timer has expired
  if (sessionManager.checkTimer()) {
    bluetoothHandler.notifyTimerComplete();
    Serial.println("Session timer expired");
  }
  
  // Update motor patterns at defined interval
  unsigned long currentTime = millis();
  if (currentTime - lastUpdateTime >= UPDATE_INTERVAL_MS) {
    lastUpdateTime = currentTime;
    updateMotorPattern(currentTime);
  }
}

/**
 * @brief Update motor pattern based on current mode
 * @param timestamp Current time in milliseconds
 */
void updateMotorPattern(unsigned long timestamp) {
  MassageMode mode = sessionManager.getMode();
  int intensity = sessionManager.getIntensity();
  
  switch (mode) {
    case MODE_OFF:
      motorController.stopAll();
      break;
      
    case MODE_PULSE:
      motorController.applyPulse(intensity, timestamp);
      break;
      
    case MODE_WAVE:
      motorController.applyWave(intensity, timestamp);
      break;
      
    case MODE_CONSTANT:
      motorController.applyConstant(intensity);
      break;
  }
}