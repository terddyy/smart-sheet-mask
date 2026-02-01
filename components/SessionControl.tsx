import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
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
    <View style={styles.container}>
      {/* Session Info */}
      <View style={styles.headerRow}>
        <View style={styles.headerLeft}>
          <View style={styles.statusDot}>
            <View style={styles.statusDotInner} />
          </View>
          <View style={styles.headerTextBlock}>
            <Text style={styles.sessionTitle}>
              {sessionName || getModeLabel(currentMode)}
            </Text>
            <Text style={styles.sessionSubtitle}>
              Active • {currentIntensity}% • {formatTime(timeLeft)}
            </Text>
          </View>
        </View>
        
        <Activity {...({ size: 20, color: "#60a5fa" } as any)} />
      </View>

      {/* Stop Button */}
      <TouchableOpacity
        onPress={handleStop}
        style={styles.stopButton}
        activeOpacity={0.7}
      >
        <View style={styles.stopButtonRow}>
          <Square {...({ size: 18, color: "#ffffff", fill: "#ffffff" } as any)} />
          <Text style={styles.stopButtonText}>Stop Session</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#1e293b",
    borderTopWidth: 1,
    borderTopColor: "#374151",
    paddingHorizontal: 24,
    paddingVertical: 16,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 12,
    backgroundColor: "#60a5fa",
    alignItems: "center",
    justifyContent: "center",
  },
  statusDotInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#60a5fa",
  },
  headerTextBlock: {
    flex: 1,
  },
  sessionTitle: {
    color: "#ffffff",
    fontWeight: "700",
    fontSize: 16,
  },
  sessionSubtitle: {
    color: "#9ca3af",
    fontSize: 12,
    marginTop: 2,
  },
  stopButton: {
    backgroundColor: "#ef4444",
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
  },
  stopButtonRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  stopButtonText: {
    marginLeft: 8,
    color: "#ffffff",
    fontWeight: "700",
    fontSize: 14,
  },
});
