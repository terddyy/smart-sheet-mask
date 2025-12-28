#include "MotorController.h"

MotorController::MotorController(const int* pins, int count, int maxDuty)
  : motorPins(pins), numMotors(count), maxDutyCycle(maxDuty) {}

bool MotorController::begin() {
  for (int i = 0; i < numMotors; i++) {
    if (ledcSetup(i, PWM_FREQUENCY, PWM_RESOLUTION) == 0) {
      return false;  // PWM setup failed
    }
    ledcAttachPin(motorPins[i], i);
    ledcWrite(i, 0);
  }
  return true;
}

int MotorController::intensityToDuty(int intensity) {
  // Clamp intensity to valid range
  intensity = constrain(intensity, 0, 100);
  return map(intensity, 0, 100, 0, maxDutyCycle);
}

void MotorController::setMotor(int motorIndex, int dutyCycle) {
  if (motorIndex >= 0 && motorIndex < numMotors) {
    dutyCycle = constrain(dutyCycle, 0, maxDutyCycle);
    ledcWrite(motorIndex, dutyCycle);
  }
}

void MotorController::setAllMotors(int dutyCycle) {
  dutyCycle = constrain(dutyCycle, 0, maxDutyCycle);
  for (int i = 0; i < numMotors; i++) {
    ledcWrite(i, dutyCycle);
  }
}

void MotorController::stopAll() {
  setAllMotors(0);
}

void MotorController::applyConstant(int intensity) {
  int duty = intensityToDuty(intensity);
  setAllMotors(duty);
}

void MotorController::applyPulse(int intensity, unsigned long timestamp) {
  unsigned long cyclePosition = timestamp % PULSE_CYCLE_MS;
  
  if (cyclePosition < PULSE_ON_DURATION_MS) {
    applyConstant(intensity);
  } else {
    stopAll();
  }
}

void MotorController::applyWave(int intensity, unsigned long timestamp) {
  int duty = intensityToDuty(intensity);
  int activeMotor = (timestamp / WAVE_STEP_MS) % numMotors;
  
  for (int i = 0; i < numMotors; i++) {
    setMotor(i, (i == activeMotor) ? duty : 0);
  }
}
