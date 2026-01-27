#include "MotorController.h"

MotorController::MotorController(const int* pins, int count, int maxDuty)
  : motorPins(pins), numMotors(count), maxDutyCycle(maxDuty) {}

bool MotorController::begin() {
  for (int i = 0; i < numMotors; i++) {
    int rc = ledcSetup(i, PWM_FREQUENCY, PWM_RESOLUTION);
    if (rc < 0) {
      Serial.printf("ERROR: ledcSetup channel %d failed with code %d\n", i, rc);
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
  int primaryMotor = (timestamp / WAVE_STEP_MS) % numMotors;
  int secondaryMotor = (primaryMotor + 1) % numMotors;
  
  // Create a smoother wave by activating 2 adjacent motors
  for (int i = 0; i < numMotors; i++) {
    if (i == primaryMotor) {
      setMotor(i, duty);  // Full intensity on primary
    } else if (i == secondaryMotor) {
      setMotor(i, duty / 2);  // Half intensity on secondary for smooth transition
    } else {
      setMotor(i, 0);
    }
  }
}

void MotorController::applyHeartbeat(int intensity, unsigned long timestamp) {
  unsigned long cyclePos = timestamp % HEARTBEAT_CYCLE_MS;
  int duty = intensityToDuty(intensity);
  int centerA = (numMotors / 2) - 1;
  int centerB = (numMotors / 2);

  // Default to all off
  for (int i = 0; i < numMotors; i++) setMotor(i, 0);

  if (cyclePos < HEARTBEAT_SHORT_ON_MS) {
    // First short beat: center motors strong, adjacent gentle
    setMotor(centerA, duty);
    setMotor(centerB, duty);
    if (centerA - 1 >= 0) setMotor(centerA - 1, duty / 3);
    if (centerB + 1 < numMotors) setMotor(centerB + 1, duty / 3);
  } else if (cyclePos < HEARTBEAT_SHORT_ON_MS + HEARTBEAT_SHORT_OFF_MS) {
    // brief pause - all off
  } else if (cyclePos < HEARTBEAT_SHORT_ON_MS + HEARTBEAT_SHORT_OFF_MS + HEARTBEAT_SHORT_ON_MS) {
    // Second short beat
    setMotor(centerA, duty);
    setMotor(centerB, duty);
  } else {
    // long pause - all off
  }
}

void MotorController::applyRaindrops(int intensity, unsigned long timestamp) {
  static unsigned long lastStep = 0;
  static int activeMotor = -1;
  static unsigned long dropStart = 0;

  unsigned long step = timestamp / RAINDROP_STEP_MS;

  if (step != lastStep) {
    lastStep = step;
    // Decide whether to trigger a new drop this step
    if (random(100) < RAINDROP_CHANCE_PERCENT) {
      activeMotor = random(numMotors);
      dropStart = timestamp;
    } else {
      activeMotor = -1;
    }
  }

  // Default off
  for (int i = 0; i < numMotors; i++) setMotor(i, 0);

  if (activeMotor >= 0 && (timestamp - dropStart) < RAINDROP_TAP_MS) {
    setMotor(activeMotor, intensityToDuty(intensity));
  }
}
