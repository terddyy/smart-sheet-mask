#ifndef MOTOR_CONTROLLER_H
#define MOTOR_CONTROLLER_H

#include <Arduino.h>
#include "config.h"

/**
 * @class MotorController
 * @brief Manages motor PWM control and intensity mapping
 * 
 * Handles low-level motor operations including PWM setup,
 * duty cycle calculations, and motor state management
 */
class MotorController {
private:
  const int* motorPins;
  int numMotors;
  int maxDutyCycle;

  /**
   * @brief Maps intensity percentage to PWM duty cycle
   * @param intensity Intensity value (0-100)
   * @return Corresponding duty cycle value
   */
  int intensityToDuty(int intensity);

public:
  MotorController(const int* pins, int count, int maxDuty);
  
  /**
   * @brief Initialize PWM channels for all motors
   * @return true if initialization successful
   */
  bool begin();
  
  /**
   * @brief Set duty cycle for a specific motor
   * @param motorIndex Motor index (0-7)
   * @param dutyCycle Duty cycle value (0-MAX_DUTY_CYCLE)
   */
  void setMotor(int motorIndex, int dutyCycle);
  
  /**
   * @brief Set all motors to specified duty cycle
   * @param dutyCycle Duty cycle value (0-MAX_DUTY_CYCLE)
   */
  void setAllMotors(int dutyCycle);
  
  /**
   * @brief Turn off all motors
   */
  void stopAll();
  
  /**
   * @brief Apply constant intensity to all motors
   * @param intensity Intensity percentage (0-100)
   */
  void applyConstant(int intensity);
  
  /**
   * @brief Apply pulsing pattern
   * @param intensity Intensity percentage (0-100)
   * @param timestamp Current time in milliseconds
   */
  void applyPulse(int intensity, unsigned long timestamp);
  
  /**
   * @brief Apply wave pattern across motors
   * @param intensity Intensity percentage (0-100)
   * @param timestamp Current time in milliseconds
   */
  void applyWave(int intensity, unsigned long timestamp);
};

#endif
