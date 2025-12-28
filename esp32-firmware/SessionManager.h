#ifndef SESSION_MANAGER_H
#define SESSION_MANAGER_H

#include <Arduino.h>
#include "config.h"

/**
 * @class SessionManager
 * @brief Manages massage session state including mode, intensity, and timer
 * 
 * Tracks current operating parameters and handles timer functionality
 */
class SessionManager {
private:
  MassageMode currentMode;
  int currentIntensity;
  unsigned long timerEndTime;
  bool timerActive;

public:
  SessionManager();
  
  /**
   * @brief Set massage mode
   * @param mode New massage mode
   */
  void setMode(MassageMode mode);
  
  /**
   * @brief Set intensity level
   * @param intensity Intensity percentage (0-100)
   */
  void setIntensity(int intensity);
  
  /**
   * @brief Start session timer
   * @param durationSeconds Timer duration in seconds
   */
  void startTimer(int durationSeconds);
  
  /**
   * @brief Check if timer has expired and update state
   * @return true if timer expired and session was stopped
   */
  bool checkTimer();
  
  /**
   * @brief Stop current session
   */
  void stopSession();
  
  // Getters
  MassageMode getMode() const { return currentMode; }
  int getIntensity() const { return currentIntensity; }
  bool isTimerActive() const { return timerActive; }
  unsigned long getTimeRemaining() const;
};

#endif
