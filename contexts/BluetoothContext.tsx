import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import BluetoothService from '../services/BluetoothService';

interface BluetoothContextType {
  isConnected: boolean;
  isConnecting: boolean;
  currentMode: number;
  currentIntensity: number;
  timeLeft: number;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  setMode: (mode: number, intensity: number) => Promise<void>;
  setTimer: (durationSeconds: number) => Promise<void>;
  stopSession: () => Promise<void>;
  error: string | null;
}

const BluetoothContext = createContext<BluetoothContextType | undefined>(undefined);

interface BluetoothProviderProps {
  children: ReactNode;
}

export const BluetoothProvider: React.FC<BluetoothProviderProps> = ({ children }: BluetoothProviderProps) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [currentMode, setCurrentMode] = useState(0);
  const [currentIntensity, setCurrentIntensity] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
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
      // Request initial status immediately after connection
      BluetoothService.requestStatus().catch(console.error);
    };

    const handleDisconnected = () => {
      setIsConnected(false);
      setIsConnecting(false);
    };

    const handleError = (err: Error) => {
      setError(err.message);
      setIsConnecting(false);
    };

    const handleStatus = (status: any) => {
      console.log('BluetoothContext received status:', status);
      if (status.mode !== undefined) {
        setCurrentMode(status.mode);
      }
      if (status.intensity !== undefined) {
        setCurrentIntensity(status.intensity);
      }
      if (status.timeLeft !== undefined) {
        setTimeLeft(status.timeLeft);
      }
    };

    BluetoothService.on('connected', handleConnected);
    BluetoothService.on('disconnected', handleDisconnected);
    BluetoothService.on('error', handleError);
    BluetoothService.on('status', handleStatus);

    return () => {
      BluetoothService.off('connected', handleConnected);
      BluetoothService.off('disconnected', handleDisconnected);
      BluetoothService.off('error', handleError);
      BluetoothService.off('status', handleStatus);
    };
  }, []);

  // Periodic status polling when connected
  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;

    if (isConnected) {
      // Poll more frequently if session is active (5s), less if idle (15s)
      const pollInterval = currentMode > 0 ? 5000 : 15000;
      intervalId = setInterval(() => {
        BluetoothService.requestStatus().catch(console.error);
      }, pollInterval);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isConnected, currentMode]);

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
    setError(null);
    try {
      await BluetoothService.setMode(mode, intensity);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to set mode';
      setError(errorMessage);
      // Don't leave UI in inconsistent state - request status to sync
      if (isConnected) {
        BluetoothService.requestStatus().catch(console.error);
      }
      throw err;
    }
  };

  const setTimer = async (durationSeconds: number) => {
    setError(null);
    try {
      await BluetoothService.setTimer(durationSeconds);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to set timer';
      setError(errorMessage);
      // Don't leave UI in inconsistent state - request status to sync
      if (isConnected) {
        BluetoothService.requestStatus().catch(console.error);
      }
      throw err;
    }
  };

  const stopSession = async () => {
    setError(null);
    try {
      setCurrentMode(0); // Optimistic update for instant UI
      setCurrentIntensity(0);
      setTimeLeft(0);
      await BluetoothService.setMode(0, 0);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to stop session';
      setError(errorMessage);
      // Revert optimistic update on failure - request status to get actual state
      if (isConnected) {
        BluetoothService.requestStatus().catch(console.error);
      }
      throw err;
    }
  };

  return (
    <BluetoothContext.Provider
      value={{
        isConnected,
        isConnecting,
        currentMode,
        currentIntensity,
        timeLeft,
        connect,
        disconnect,
        setMode,
        setTimer,
        stopSession,
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
