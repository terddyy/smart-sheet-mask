import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Square, Activity } from 'lucide-react-native';
import { useBluetooth } from '../contexts/BluetoothContext';

interface SessionControlProps {
  sessionName?: string;
}

export default function SessionControl({ sessionName }: SessionControlProps) {
  const { currentMode, currentIntensity, timeLeft, stopSession } = useBluetooth();

  // Don't render if no session is active
  if (currentMode === 0) return null;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getModeLabel = (mode: number) => {
    switch (mode) {
      case 1: return 'Pulse';
      case 2: return 'Wave';
      case 3: return 'Constant';
      default: return 'Active';
    }
  };

  const handleStop = async () => {
    try {
      await stopSession();
    } catch (error) {
      console.error('Stop failed:', error);
    }
  };

  return (
    <View className="bg-charcoal border-t border-gray-700 px-6 py-4 shadow-2xl">
      {/* Session Info */}
      <View className="flex-row items-center justify-between mb-3">
        <View className="flex-row items-center flex-1">
          <View className="w-2 h-2 rounded-full mr-3 bg-biolum-blue">
            <View className="w-2 h-2 rounded-full bg-biolum-blue animate-pulse" />
          </View>
          <View className="flex-1">
            <Text className="text-white font-bold text-base">
              {sessionName || getModeLabel(currentMode)}
            </Text>
            <Text className="text-gray-400 text-xs mt-0.5">
              Active • {currentIntensity}% • {formatTime(timeLeft)}
            </Text>
          </View>
        </View>
        
        <Activity {...({ size: 20, color: "#60a5fa" } as any)} className="animate-pulse" />
      </View>

      {/* Stop Button */}
      <TouchableOpacity
        onPress={handleStop}
        className="bg-red-500 rounded-xl py-3 items-center active:opacity-70"
      >
        <View className="flex-row items-center">
          <Square {...({ size: 18, color: "#ffffff", fill: "#ffffff" } as any)} />
          <Text className="text-white font-bold text-sm ml-2">Stop Session</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}
