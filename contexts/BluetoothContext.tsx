import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import BluetoothService from '../services/BluetoothService';

interface BluetoothContextType {
  isConnected: boolean;
  isConnecting: boolean;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  setMode: (mode: number, intensity: number) => Promise<void>;
  setTimer: (durationSeconds: number) => Promise<void>;
  error: string | null;
}

const BluetoothContext = createContext<BluetoothContextType | undefined>(undefined);

interface BluetoothProviderProps {
  children: ReactNode;
}

export const BluetoothProvider: React.FC<BluetoothProviderProps> = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Initialize Bluetooth service
    const initBluetooth = async () => {
      try {
        await BluetoothService.initialize();
      } catch (err) {
        console.error('Bluetooth initialization failed:', err);
        setError(err instanceof Error ? err.message : 'Failed to initialize Bluetooth');
      }
    };

    initBluetooth();

    // Setup event listeners
    const handleConnected = () => {
      setIsConnected(true);
      setIsConnecting(false);
      setError(null);
    };

    const handleDisconnected = () => {
      setIsConnected(false);
      setIsConnecting(false);
    };

    const handleError = (err: Error) => {
      setError(err.message);
      setIsConnecting(false);
    };

    BluetoothService.on('connected', handleConnected);
    BluetoothService.on('disconnected', handleDisconnected);
    BluetoothService.on('error', handleError);

    return () => {
      BluetoothService.off('connected', handleConnected);
      BluetoothService.off('disconnected', handleDisconnected);
      BluetoothService.off('error', handleError);
    };
  }, []);

  const connect = async () => {
    setIsConnecting(true);
    setError(null);
    
    try {
      await BluetoothService.connect();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to connect');
      setIsConnecting(false);
      throw err;
    }
  };

  const disconnect = async () => {
    try {
      await BluetoothService.disconnect();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to disconnect');
      throw err;
    }
  };

  const setMode = async (mode: number, intensity: number) => {
    try {
      await BluetoothService.setMode(mode, intensity);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to set mode');
      throw err;
    }
  };

  const setTimer = async (durationSeconds: number) => {
    try {
      await BluetoothService.setTimer(durationSeconds);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to set timer');
      throw err;
    }
  };

  return (
    <BluetoothContext.Provider
      value={{
        isConnected,
        isConnecting,
        connect,
        disconnect,
        setMode,
        setTimer,
        error,
      }}
    >
      {children}
    </BluetoothContext.Provider>
  );
};

export const useBluetooth = (): BluetoothContextType => {
  const context = useContext(BluetoothContext);
  if (!context) {
    throw new Error('useBluetooth must be used within BluetoothProvider');
  }
  return context;
};
