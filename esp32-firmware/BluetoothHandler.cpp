#include "BluetoothHandler.h"

BluetoothHandler::BluetoothHandler(BluetoothSerial* bt, SessionManager* manager)
  : serialBT(bt), sessionManager(manager) {}

bool BluetoothHandler::begin(const char* deviceName) {
  if (!serialBT->begin(deviceName)) {
    return false;
  }
  sendResponse("READY");
  return true;
}

void BluetoothHandler::handleCommands() {
  if (!serialBT->available()) return;
  
  String command = serialBT->readStringUntil('\n');
  command.trim();
  
  if (command.length() == 0) return;
  
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
  // Format: Mxy where x=mode (1-3), y=intensity (0-100)
  if (command.length() < 3) {
    sendResponse("ERROR: Invalid mode command format");
    return;
  }
  
  int mode = command.substring(1, 2).toInt();
  int intensity = command.substring(2).toInt();
  
  if (mode < 0 || mode > 3) {
    sendResponse("ERROR: Invalid mode value");
    return;
  }
  
  sessionManager->setMode(static_cast<MassageMode>(mode));
  sessionManager->setIntensity(intensity);
  
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
  serialBT->println(message);
}

void BluetoothHandler::sendStatus() {
  String status = "STATUS:";
  status += " Mode=" + String(sessionManager->getMode());
  status += " Intensity=" + String(sessionManager->getIntensity());
  status += " TimeLeft=" + String(sessionManager->getTimeRemaining());
  sendResponse(status);
}

void BluetoothHandler::notifyTimerComplete() {
  sendResponse("TIMER_COMPLETE");
}
