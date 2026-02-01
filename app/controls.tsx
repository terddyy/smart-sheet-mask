import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import IntensitySlider from '../components/IntensitySlider';
import PatternCarousel from '../components/PatternCarousel';
import SessionControl from '../components/SessionControl';
import { Clock, Play } from 'lucide-react-native';
import { useBluetooth } from '../contexts/BluetoothContext';

const timerOptions = [1, 5, 10, 15];

// Pattern mapping to ESP32 modes
const PATTERN_TO_MODE: Record<string, number> = {
    'pulse': 1,
    'wave': 2,
    'constant': 3,
    'heartbeat': 4,
    'rain': 5,
};

// Reverse mapping
const MODE_TO_PATTERN: Record<number, string> = {
    1: 'pulse',
    2: 'wave',
    3: 'constant',
    4: 'heartbeat',
    5: 'rain',
};

export default function Controls() {
    const [intensity, setIntensity] = useState(50);
    const [selectedPattern, setSelectedPattern] = useState('wave');
    const [selectedTimer, setSelectedTimer] = useState(5);
    const [isActive, setIsActive] = useState(false);

    const { 
        isConnected, 
        setMode, 
        setTimer, 
        currentMode, 
        currentIntensity, 
        timeLeft
    } = useBluetooth();

    // Sync UI with ESP32 state
    useEffect(() => {
        if (currentMode > 0) {
            // Mode is active
            setIsActive(true);
            const pattern = MODE_TO_PATTERN[currentMode] || 'wave';
            setSelectedPattern(pattern);
        } else {
            setIsActive(false);
        }

        if (currentIntensity > 0) {
            setIntensity(currentIntensity);
        }

        if (timeLeft > 0) {
            // Convert seconds to nearest timer option
            const minutes = Math.round(timeLeft / 60);
            if (timerOptions.includes(minutes)) {
                setSelectedTimer(minutes);
            }
        }
    }, [currentMode, currentIntensity, timeLeft]);

    const handleStartStop = async () => {
        if (!isConnected) {
            Alert.alert('Not Connected', 'Please connect to the device first from the Sleep tab.');
            return;
        }

        try {
            if (isActive) {
                // Optimistically update state for instant UI feedback
                setIsActive(false);
                // Stop session - send mode 0 (OFF)
                await setMode(0, 0);
            } else {
                // Optimistically update state for instant UI feedback
                setIsActive(true);
                // Start session
                const mode = PATTERN_TO_MODE[selectedPattern] || 2;
                await setMode(mode, intensity);
                await setTimer(selectedTimer * 60); // Convert minutes to seconds
            }
        } catch (error) {
            console.error('Failed to control device:', error);
            // Revert state on error
            setIsActive(!isActive);
            Alert.alert('Error', 'Failed to send command to device');
        }
    };

    const handleIntensityChange = async (value: number) => {
        setIntensity(value);
        
        // If session is active, update intensity in real-time
        if (isActive && isConnected) {
            try {
                const mode = PATTERN_TO_MODE[selectedPattern] || 2;
                await setMode(mode, value);
            } catch (error) {
                console.error('Failed to update intensity:', error);
            }
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Controls</Text>
                    <Text style={styles.headerSubtitle}>Adjust your sleep experience</Text>
                </View>

                {/* Intensity Slider */}
                <View style={styles.sliderCard}>
                    <IntensitySlider value={intensity} onValueChange={handleIntensityChange} />
                </View>

                {/* Pattern Selection */}
                <View style={styles.patternSection}>
                    <View style={styles.patternCard}>
                        <PatternCarousel selectedPattern={selectedPattern} onSelectPattern={setSelectedPattern} />
                    </View>
                </View>

                {/* Drift Timer */}
                <View style={styles.driftSection}>
                    <View style={styles.driftHeader}>
                        <Clock {...({ size: 20, color: "#94a3b8" } as any)} />
                        <Text style={styles.driftHeaderText}>Drift Timer (Minutes)</Text>
                    </View>
                    <View style={styles.timerRow}>
                        {timerOptions.map((time) => (
                            <TouchableOpacity
                                key={time}
                                onPress={() => setSelectedTimer(time)}
                                style={[
                                    styles.timerButton,
                                    selectedTimer === time ? styles.timerButtonActive : styles.timerButtonInactive,
                                ]}
                            >
                                <Text
                                    style={selectedTimer === time ? styles.timerTextActive : styles.timerTextInactive}
                                >
                                    {time}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Start Button - Only show when no session is active */}
                {!isActive && (
                    <TouchableOpacity
                        onPress={handleStartStop}
                        style={[
                            styles.startButton,
                            isConnected && styles.startButtonHighlight,
                            !isConnected && styles.startButtonDisabled,
                        ]}
                        disabled={!isConnected}
                    >
                        <View style={styles.startButtonRow}>
                            <Play {...({ size: 24, color: "#0f172a", fill: "#0f172a" } as any)} />
                            <Text style={styles.startButtonText}>
                                {isConnected ? 'Start Session' : 'Connect Device First'}
                            </Text>
                        </View>
                    </TouchableOpacity>
                )}
            </View>

            {/* Session Control Bar */}
            <SessionControl sessionName="Manual Control" />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#0f172a",
    },
    content: {
        flex: 1,
        paddingHorizontal: 24,
        paddingVertical: 32,
    },
    header: {
        marginBottom: 32,
    },
    headerTitle: {
        fontSize: 32,
        fontWeight: "700",
        color: "#ffffff",
        marginBottom: 8,
    },
    headerSubtitle: {
        color: "#9ca3af",
    },
    sliderCard: {
        marginBottom: 40,
        paddingHorizontal: 16,
        paddingVertical: 24,
        backgroundColor: "#1e293b",
        borderRadius: 24,
        borderWidth: 1,
        borderColor: "rgba(96,165,250,0.7)",
        shadowColor: "#60a5fa",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.18,
        shadowRadius: 12,
        elevation: 6,
    },
    patternSection: {
        marginBottom: 40,
    },
    patternCard: {
        paddingVertical: 12,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: "rgba(96,165,250,0.5)",
        backgroundColor: "rgba(96,165,250,0.06)",
    },
    driftSection: {
        marginBottom: 32,
    },
    driftHeader: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 16,
        marginLeft: 16,
    },
    driftHeaderText: {
        marginLeft: 8,
        color: "#9ca3af",
        fontWeight: "600",
    },
    timerRow: {
        flexDirection: "row",
        paddingHorizontal: 16,
    },
    timerButton: {
        flex: 1,
        marginRight: 8,
        paddingVertical: 16,
        borderRadius: 16,
        alignItems: "center",
    },
    timerButtonActive: {
        backgroundColor: "#a78bfa",
    },
    timerButtonInactive: {
        backgroundColor: "#1e293b",
    },
    timerTextActive: {
        color: "#0f172a",
        fontSize: 18,
        fontWeight: "700",
    },
    timerTextInactive: {
        color: "#9ca3af",
        fontSize: 18,
        fontWeight: "700",
    },
    startButton: {
        borderRadius: 24,
        paddingVertical: 20,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#60a5fa",
        shadowColor: "#60a5fa",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 6,
    },
    startButtonHighlight: {
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.7)",
        shadowOpacity: 0.45,
        shadowRadius: 16,
        elevation: 10,
    },
    startButtonDisabled: {
        opacity: 0.5,
    },
    startButtonRow: {
        flexDirection: "row",
        alignItems: "center",
    },
    startButtonText: {
        marginLeft: 8,
        color: "#0f172a",
        fontSize: 20,
        fontWeight: "700",
    },
});
