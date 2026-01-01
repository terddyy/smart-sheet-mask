import { BleManager, Device, State } from 'react-native-ble-plx';
import { Platform, PermissionsAndroid } from 'react-native';
import base64 from 'base-64';

/**
 * @class BluetoothService
 * @brief Manages Bluetooth Low Energy connections and communication with ESP32
 * 
 * Handles device scanning, connection, and command transmission
 * following the ESP32 command protocol
 */
class BluetoothService {
  private manager: BleManager | null = null;
  private device: Device | null = null;
  private isConnected: boolean = false;
  private listeners: Map<string, Function[]> = new Map();

  // ESP32 Device Configuration
  private readonly DEVICE_NAME = 'SMART_MassageMask';
  private readonly SERVICE_UUID = '0000FFE0-0000-1000-8000-00805F9B34FB'; // Common BT Serial UUID
  private readonly CHARACTERISTIC_UUID = '0000FFE1-0000-1000-8000-00805F9B34FB';

  constructor() {
    // Lazy initialization to avoid issues during module loading
  }

  /**
   * @brief Initialize BLE Manager lazily
   */
  private getManager(): BleManager {
    if (!this.manager) {
      this.manager = new BleManager();
    }
    return this.manager;
  }

  /**
   * @brief Request necessary Bluetooth permissions (Android)
   * @returns Promise<boolean> True if permissions granted
   */
  async requestPermissions(): Promise<boolean> {
    if (Platform.OS === 'android') {
      if (Platform.Version >= 31) {
        // Android 12+
        const granted = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        ]);

        return (
          granted['android.permission.BLUETOOTH_SCAN'] === PermissionsAndroid.RESULTS.GRANTED &&
          granted['android.permission.BLUETOOTH_CONNECT'] === PermissionsAndroid.RESULTS.GRANTED &&
          granted['android.permission.ACCESS_FINE_LOCATION'] === PermissionsAndroid.RESULTS.GRANTED
        );
      } else {
        // Android 11 and below
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      }
    }
    return true; // iOS handles permissions automatically
  }

  /**
   * @brief Initialize Bluetooth manager and check state
   * @returns Promise<boolean> True if Bluetooth is ready
   */
  async initialize(): Promise<boolean> {
    const hasPermissions = await this.requestPermissions();
    if (!hasPermissions) {
      throw new Error('Bluetooth permissions not granted');
    }

    const state = await this.getManager().state();
    if (state !== State.PoweredOn) {
      throw new Error('Bluetooth is not powered on');
    }

    return true;
  }

  /**
   * @brief Scan for ESP32 device
   * @param onDeviceFound Callback when device is found
   * @param timeoutMs Scan timeout in milliseconds
   * @returns Promise<Device | null>
   */
  async scanForDevice(
    onDeviceFound?: (device: Device) => void,
    timeoutMs: number = 20000
  ): Promise<Device | null> {
    return new Promise((resolve, reject) => {
      let found = false;
      const foundDevices = new Map<string, any>();
      
      const timeout = setTimeout(() => {
        this.getManager().stopDeviceScan();
        if (!found) {
          console.log('\n=== SCAN TIMEOUT - Devices found ===');
          foundDevices.forEach((dev, id) => {
            console.log(`Device ID: ${id}, Name: ${dev.name || 'UNNAMED'}, Services: ${dev.serviceUUIDs}`);
          });
          console.log('===================================\n');
          reject(new Error('Device scan timeout'));
        }
      }, timeoutMs);

      console.log('Starting BLE scan for device:', this.DEVICE_NAME);
      console.log('Looking for service UUID:', this.SERVICE_UUID);

      this.getManager().startDeviceScan(null, { allowDuplicates: true }, (error: any, device: any) => {
        if (error) {
          console.error('Scan error:', error);
          clearTimeout(timeout);
          this.getManager().stopDeviceScan();
          reject(error);
          return;
        }

        if (device) {
          // Track unique devices
          if (!foundDevices.has(device.id)) {
            foundDevices.set(device.id, device);
            console.log('📱 New device:', device.name || 'UNNAMED', 'ID:', device.id, 'RSSI:', device.rssi);
            if (device.serviceUUIDs && device.serviceUUIDs.length > 0) {
              console.log('   Services:', device.serviceUUIDs);
            }
          }
          
          // Match by name
          const matchesName = device.name === this.DEVICE_NAME;
          
          // Match by service UUID (check various formats)
          const matchesService = device.serviceUUIDs && 
            device.serviceUUIDs.some((uuid: string) => {
              const normalizedUUID = uuid.toUpperCase().replace(/-/g, '');
              const targetUUID = this.SERVICE_UUID.toUpperCase().replace(/-/g, '');
              return normalizedUUID.includes('FFE0') || 
                     normalizedUUID === targetUUID ||
                     normalizedUUID.includes(targetUUID.substring(4, 8)); // Check short UUID
            });
          
          // Match devices with relevant names (broader match)
          const hasRelevantName = device.name && (
            device.name.toUpperCase().includes('SMART') ||
            device.name.toUpperCase().includes('MASSAGE') ||
            device.name.toUpperCase().includes('MASK') ||
            device.name === this.DEVICE_NAME
          );
          
          if (matchesName || matchesService || hasRelevantName) {
            found = true;
            clearTimeout(timeout);
            this.getManager().stopDeviceScan();
            console.log('\n✅ TARGET DEVICE FOUND!');
            console.log('   Name:', device.name || 'UNNAMED');
            console.log('   ID:', device.id);
            console.log('   RSSI:', device.rssi);
            console.log('   Services:', device.serviceUUIDs);
            console.log('   Match reason:', matchesName ? 'NAME' : matchesService ? 'SERVICE_UUID' : 'RELEVANT_NAME');
            console.log('');
            
            if (onDeviceFound) {
              onDeviceFound(device);
            }
            
            resolve(device);
          }
        }
      });
    });
  }

  /**
   * @brief Connect to ESP32 device
   * @param device Device to connect to (optional, will scan if not provided)
   * @returns Promise<boolean> True if connected successfully
   */
  async connect(device?: Device): Promise<boolean> {
    try {
      if (!device) {
        device = (await this.scanForDevice()) ?? undefined;
      }

      if (!device) {
        throw new Error('No device found');
      }

      this.device = await device.connect();
      
      // Request larger MTU for longer messages
      try {
        const mtu = await this.device.requestMTU(512);
        console.log('MTU negotiated:', mtu);
      } catch (error) {
        console.warn('MTU request failed:', error);
      }
      
      await this.device.discoverAllServicesAndCharacteristics();
      this.isConnected = true;

      // Listen for disconnection
      this.device.onDisconnected(() => {
        this.isConnected = false;
        this.device = null;
        this.emit('disconnected');
      });

      // Start monitoring characteristic for responses
      this.startMonitoring();

      this.emit('connected');
      return true;
    } catch (error) {
      this.emit('error', error);
      throw error;
    }
  }

  /**
   * @brief Start monitoring characteristic for ESP32 responses
   */
  private async startMonitoring(): Promise<void> {
    if (!this.device) return;

    try {
      this.device.monitorCharacteristicForService(
        this.SERVICE_UUID,
        this.CHARACTERISTIC_UUID,
        (error: any, characteristic: any) => {
          if (error) {
            console.error('Monitor error:', error);
            return;
          }

          if (characteristic?.value) {
            const data = base64.decode(characteristic.value);
            this.handleResponse(data.trim());
          }
        }
      );
    } catch (error) {
      console.error('Failed to start monitoring:', error);
    }
  }

  /**
   * @brief Handle responses from ESP32
   * @param data Response string from ESP32
   */
  private handleResponse(data: string): void {
    console.log('ESP32 Response:', data);

    if (data === 'READY') {
      this.emit('ready');
    } else if (data.startsWith('OK:')) {
      this.emit('commandAck', data);
    } else if (data.startsWith('ERROR:')) {
      this.emit('error', new Error(data.substring(6)));
    } else if (data.startsWith('STATUS:') || data.startsWith('S:')) {
      // Parse status response (supports CSV and key=value formats)
      const status = this.parseStatus(data);
      this.emit('status', status);
    } else if (data === 'TIMER_COMPLETE') {
      this.emit('timerComplete');
    }
  }

  /**
   * @brief Parse status response from ESP32
   * @param data Status string (CSV: "S:0,0,0,87" or key=value: "STATUS: M=0 I=0 T=0 B=0")
   * @returns Parsed status object
   */
  private parseStatus(data: string): {
    mode: number;
    intensity: number;
    timeLeft: number;
    battery: number;
  } {
    console.log('Parsing status:', data);
    const status = {
      mode: 0,
      intensity: 0,
      timeLeft: 0,
      battery: 0,
    };

    // CSV format: "S:0,0,0,87"
    if (data.startsWith('S:')) {
      const values = data.substring(2).split(',');
      if (values.length >= 4) {
        status.mode = parseInt(values[0]) || 0;
        status.intensity = parseInt(values[1]) || 0;
        status.timeLeft = parseInt(values[2]) || 0;
        status.battery = parseInt(values[3]) || 0;
      }
    } else {
      // Key=value format
      const parts = data.split(' ');
      parts.forEach(part => {
        // Support both compact (M=, I=, T=, B=) and old format (Mode=, Intensity=, etc.)
        if (part.startsWith('M=') || part.startsWith('Mode=')) {
          status.mode = parseInt(part.split('=')[1]);
        } else if (part.startsWith('I=') || part.startsWith('Intensity=')) {
          status.intensity = parseInt(part.split('=')[1]);
        } else if (part.startsWith('T=') || part.startsWith('TimeLeft=')) {
          status.timeLeft = parseInt(part.split('=')[1]);
        } else if (part.startsWith('B=') || part.startsWith('Battery=')) {
          status.battery = parseInt(part.split('=')[1]);
        }
      });
    }

    console.log('Parsed status:', status);
    return status;
  }

  /**
   * @brief Disconnect from device
   */
  async disconnect(): Promise<void> {
    if (this.device) {
      await this.device.cancelConnection();
      this.device = null;
      this.isConnected = false;
      this.emit('disconnected');
    }
  }

  /**
   * @brief Send command to ESP32
   * @param command Command string (without newline)
   * @returns Promise<void>
   */
  async sendCommand(command: string): Promise<void> {
    if (!this.isConnected || !this.device) {
      throw new Error('Device not connected');
    }

    try {
      const commandWithNewline = command + '\n';
      const base64Command = base64.encode(commandWithNewline);

      await this.device.writeCharacteristicWithResponseForService(
        this.SERVICE_UUID,
        this.CHARACTERISTIC_UUID,
        base64Command
      );

      console.log('Sent command:', command);
    } catch (error) {
      console.error('Error sending command:', error);
      throw error;
    }
  }

  /**
   * @brief Set massage mode and intensity
   * @param mode Mode number (0=OFF, 1=PULSE, 2=WAVE, 3=CONSTANT)
   * @param intensity Intensity percentage (0-100)
   */
  async setMode(mode: number, intensity: number): Promise<void> {
    const command = `M${mode}${intensity}`;
    await this.sendCommand(command);
    // Request status immediately to update UI
    setTimeout(() => this.requestStatus().catch(console.error), 100);
  }

  /**
   * @brief Set timer duration
   * @param durationSeconds Duration in seconds
   */
  async setTimer(durationSeconds: number): Promise<void> {
    const command = `T${durationSeconds}`;
    await this.sendCommand(command);
    // Request status immediately to update UI
    setTimeout(() => this.requestStatus().catch(console.error), 100);
  }

  /**
   * @brief Request status from ESP32
   */
  async requestStatus(): Promise<void> {
    await this.sendCommand('S');
  }

  /**
   * @brief Check if connected
   * @returns boolean
   */
  getConnectionStatus(): boolean {
    return this.isConnected;
  }

  /**
   * @brief Get connected device
   * @returns Device | null
   */
  getDevice(): Device | null {
    return this.device;
  }

  /**
   * @brief Event listener management
   */
  on(event: string, callback: Function): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(callback);
  }

  off(event: string, callback: Function): void {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  private emit(event: string, data?: any): void {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.forEach(callback => callback(data));
    }
  }

  /**
   * @brief Cleanup resources
   */
  destroy(): void {
    this.disconnect();
    this.listeners.clear();
    if (this.manager) {
      this.manager.destroy();
    }
  }
}

// Export singleton instance
export default new BluetoothService();
