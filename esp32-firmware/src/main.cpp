#include "config.h"
#include "MotorController.h"
#include "SessionManager.h"
#include "BluetoothHandler.h"
#include <BLEDevice.h>
#include <BLEServer.h>

// Forward declaration
void updateMotorPattern(unsigned long timestamp);

// BLE Server Callbacks
class MyServerCallbacks: public BLEServerCallbacks {
  private:
    BluetoothHandler* handler;
  public:
    MyServerCallbacks(BluetoothHandler* h) : handler(h) {}
    
    void onConnect(BLEServer* pServer) {
      handler->setConnected(true);
      Serial.println("BLE Client connected");
    };

    void onDisconnect(BLEServer* pServer) {
      handler->setConnected(false);
      Serial.println("BLE Client disconnected");
      // Restart advertising
      BLEDevice::startAdvertising();
      Serial.println("Advertising restarted");
    }
};

// BLE Characteristic Callbacks
class MyCallbacks: public BLECharacteristicCallbacks {
  void onWrite(BLECharacteristic *pCharacteristic) {
    // Commands are processed in handleCommands()
  }
};

// Global instances
MotorController motorController(MOTOR_PINS, NUM_MOTORS, MAX_DUTY_CYCLE);
SessionManager sessionManager;
BluetoothHandler bluetoothHandler(&sessionManager);
MyServerCallbacks serverCallbacks(&bluetoothHandler);

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
  
  // Initialize battery monitoring pin
  pinMode(BATTERY_PIN, INPUT);
  analogReadResolution(12);  // Set ADC to 12-bit resolution
  analogSetAttenuation(ADC_11db);  // 0-3.6V range (for voltage divider)
  Serial.println("Battery monitoring initialized");
  
  // Initialize Bluetooth
  if (!bluetoothHandler.begin(DEVICE_NAME)) {
    Serial.println("ERROR: Bluetooth initialization failed!");
    while (1) delay(1000);  // Halt on critical error
  }
  
  // Set BLE callbacks
  BLEServer* pServer = bluetoothHandler.getServer();
  pServer->setCallbacks(&serverCallbacks);
  
  Serial.println("BLE initialized: " + String(DEVICE_NAME));
  Serial.println("Service UUID: " + String(SERVICE_UUID));
  Serial.println("Waiting for client connection...");
  
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