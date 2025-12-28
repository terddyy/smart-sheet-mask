#ifndef BLUETOOTH_HANDLER_H
#define BLUETOOTH_HANDLER_H

#include <BLEDevice.h>
#include <BLEServer.h>
#include <BLEUtils.h>
#include <BLE2902.h>
#include "config.h"
#include "SessionManager.h"

/**
 * @class BluetoothHandler
 * @brief Handles Bluetooth communication and command parsing
 * 
 * Manages BLE connection and processes incoming commands
 */
class BluetoothHandler {
private:
  BLEServer* pServer;
  BLECharacteristic* pCharacteristic;
  SessionManager* sessionManager;
  bool deviceConnected;
  String commandBuffer;
  
  /**
   * @brief Process mode command (Mxy format)
   * @param command Command string
   */
  void processModeCommand(const String& command);
  
  /**
   * @brief Process timer command (Tx format)
   * @param command Command string
   */
  void processTimerCommand(const String& command);
  
  /**
   * @brief Process status request command (S format)
   * @param command Command string
   */
  void processStatusCommand(const String& command);
  
  /**
   * @brief Process a complete command
   * @param command Command string
   */
  void processCommand(const String& command);
  
  /**
   * @brief Send response message via Bluetooth
   * @param message Message to send
   */
  void sendResponse(const String& message);

public:
  BluetoothHandler(SessionManager* manager);
  
  void setConnected(bool connected);
  void setCharacteristic(BLECharacteristic* characteristic);
  BLEServer* getServer() { return pServer; }
  
  /**
   * @brief Initialize Bluetooth with device name
   * @param deviceName BLE device name
   * @return true if initialization successful
   */
  bool begin(const char* deviceName);
  
  /**
   * @brief Process incoming Bluetooth commands
   */
  void handleCommands();
  
  /**
   * @brief Send status update
   */
  void sendStatus();
  
  /**
   * @brief Notify timer completion
   */
  void notifyTimerComplete();
};

#endif
