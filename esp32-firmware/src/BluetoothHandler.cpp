#include "BluetoothHandler.h"

BluetoothHandler::BluetoothHandler(SessionManager* manager)
  : pServer(nullptr), pCharacteristic(nullptr), sessionManager(manager), deviceConnected(false), commandBuffer("") {}

void BluetoothHandler::setConnected(bool connected) {
  deviceConnected = connected;
}

void BluetoothHandler::setCharacteristic(BLECharacteristic* characteristic) {
  pCharacteristic = characteristic;
}

bool BluetoothHandler::begin(const char* deviceName) {
  BLEDevice::init(deviceName);
  
  // Set MTU to larger size for longer messages
  BLEDevice::setMTU(512);
  
  pServer = BLEDevice::createServer();
  
  BLEService *pService = pServer->createService(SERVICE_UUID);
  pCharacteristic = pService->createCharacteristic(
    CHARACTERISTIC_UUID,
    BLECharacteristic::PROPERTY_READ |
    BLECharacteristic::PROPERTY_WRITE |
    BLECharacteristic::PROPERTY_NOTIFY
  );
  
  pCharacteristic->addDescriptor(new BLE2902());
  pService->start();
  
  BLEAdvertising *pAdvertising = BLEDevice::getAdvertising();
  pAdvertising->addServiceUUID(SERVICE_UUID);
  pAdvertising->setScanResponse(true);
  pAdvertising->setMinPreferred(0x06);
  pAdvertising->setMinPreferred(0x12);
  BLEDevice::startAdvertising();
  
  return true;
}

void BluetoothHandler::handleCommands() {
  if (!deviceConnected || !pCharacteristic) return;
  
  std::string value = pCharacteristic->getValue();
  if (value.length() == 0) return;
  
  commandBuffer += String(value.c_str());
  
  // Process complete commands (ending with newline)
  int newlineIndex = commandBuffer.indexOf('\n');
  while (newlineIndex != -1) {
    String command = commandBuffer.substring(0, newlineIndex);
    command.trim();
    commandBuffer = commandBuffer.substring(newlineIndex + 1);
    
    if (command.length() > 0) {
      processCommand(command);
    }
    
    newlineIndex = commandBuffer.indexOf('\n');
  }
  
  // Clear the characteristic value after reading
  pCharacteristic->setValue("");
}

void BluetoothHandler::processCommand(const String& command) {
  char cmdType = command.charAt(0);
  
  switch (cmdType) {
    case CMD_MODE:
      processModeCommand(command);
      break;
      
    case CMD_TIMER:
      processTimerCommand(command);
      break;
      
    case CMD_STATUS:
      processStatusCommand(command);
      break;
      
    default:
      sendResponse("ERROR: Unknown command");
      break;
  }
}

void BluetoothHandler::processModeCommand(const String& command) {
  // Format: Mxy where x=mode (0-5), y=intensity (0-100)
  if (command.length() < 3) {
    sendResponse("ERROR: Invalid mode command format");
    return;
  }
  
  int mode = command.substring(1, 2).toInt();
  int intensity = command.substring(2).toInt();
  
  // Validate mode and intensity
  if (mode < 0 || mode > 5) {
    sendResponse("ERROR: Invalid mode value");
    return;
  }

  if (intensity < 0) intensity = 0;
  if (intensity > 100) intensity = 100;
  
  sessionManager->setMode(static_cast<MassageMode>(mode));
  sessionManager->setIntensity(intensity);
  
  Serial.print("Set Mode: ");
  Serial.print(mode);
  Serial.print(" Intensity: ");
  Serial.println(intensity);
  
  sendResponse("OK: Mode=" + String(mode) + " Intensity=" + String(intensity));
}

void BluetoothHandler::processTimerCommand(const String& command) {
  // Format: Tx where x=duration in seconds
  if (command.length() < 2) {
    sendResponse("ERROR: Invalid timer command format");
    return;
  }
  
  int duration = command.substring(1).toInt();
  
  if (duration <= 0) {
    sendResponse("ERROR: Invalid timer duration");
    return;
  }
  
  sessionManager->startTimer(duration);
  sendResponse("OK: Timer set for " + String(duration) + " seconds");
}

void BluetoothHandler::processStatusCommand(const String& command) {
  sendStatus();
}

void BluetoothHandler::sendResponse(const String& message) {
  if (deviceConnected && pCharacteristic) {
    pCharacteristic->setValue(message.c_str());
    pCharacteristic->notify();
    delay(20);  // Small delay to ensure message is sent completely
  }
}

void BluetoothHandler::sendStatus() {
  int batteryPercent = sessionManager->getBatteryPercentage();
  
  // Send as CSV format: S:mode,intensity,time,battery
  String status = "S:";
  status += String(sessionManager->getMode()) + ",";
  status += String(sessionManager->getIntensity()) + ",";
  status += String(sessionManager->getTimeRemaining()) + ",";
  status += String(batteryPercent);
  
  Serial.print("Sending status: ");
  Serial.println(status);
  Serial.print("Message length: ");
  Serial.println(status.length());
  
  sendResponse(status);
}

void BluetoothHandler::notifyTimerComplete() {
  sendResponse("TIMER_COMPLETE");
}
