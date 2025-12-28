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
