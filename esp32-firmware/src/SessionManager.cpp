#include "SessionManager.h"

SessionManager::SessionManager()
  : currentMode(MODE_OFF)
  , currentIntensity(0)
  , timerEndTime(0)
  , timerActive(false) {}

void SessionManager::setMode(MassageMode mode) {
  currentMode = mode;
}

void SessionManager::setIntensity(int intensity) {
  currentIntensity = constrain(intensity, 0, 100);
}

void SessionManager::startTimer(int durationSeconds) {
  if (durationSeconds > 0) {
    timerEndTime = millis() + (durationSeconds * 1000UL);
    timerActive = true;
  }
}

bool SessionManager::checkTimer() {
  if (timerActive && millis() >= timerEndTime) {
    stopSession();
    return true;
  }
  return false;
}

void SessionManager::stopSession() {
  currentMode = MODE_OFF;
  currentIntensity = 0;
  timerActive = false;
}

unsigned long SessionManager::getTimeRemaining() const {
  if (!timerActive) return 0;
  
  unsigned long now = millis();
  if (now >= timerEndTime) return 0;
  
  return (timerEndTime - now) / 1000;  // Return in seconds
}

float SessionManager::getBatteryVoltage() const {
  // Read ADC value (12-bit: 0-4095)
  int adcValue = analogRead(BATTERY_PIN);
  
  // Convert ADC reading to voltage
  float voltage = (adcValue / ADC_RESOLUTION) * ADC_REFERENCE_VOLTAGE;
  
  // Account for voltage divider
  voltage *= BATTERY_VOLTAGE_DIVIDER;
  
  return voltage;
}

int SessionManager::getBatteryPercentage() const {
  float voltage = getBatteryVoltage();
  
  // Clamp voltage to valid range
  if (voltage >= BATTERY_MAX_VOLTAGE) return 100;
  if (voltage <= BATTERY_MIN_VOLTAGE) return 0;
  
  // Linear interpolation between min and max voltage
  float percentage = ((voltage - BATTERY_MIN_VOLTAGE) / 
                      (BATTERY_MAX_VOLTAGE - BATTERY_MIN_VOLTAGE)) * 100.0;
  
  return constrain((int)percentage, 0, 100);
}
