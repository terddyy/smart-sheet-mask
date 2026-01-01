import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
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
};

// Reverse mapping
const MODE_TO_PATTERN: Record<number, string> = {
    1: 'pulse',
    2: 'wave',
    3: 'constant',
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
        <SafeAreaView className="flex-1 bg-midnight-navy">
            <View className="flex-1 px-6 py-8">
                {/* Header */}
                <View className="mb-8">
                    <Text className="text-4xl font-bold text-white mb-2">Controls</Text>
                    <Text className="text-gray-400">Adjust your sleep experience</Text>
                </View>

                {/* Intensity Slider */}
                <View className="mb-10 px-4 py-6 bg-charcoal rounded-3xl">
                    <IntensitySlider value={intensity} onValueChange={handleIntensityChange} />
                </View>

                {/* Pattern Selection */}
                <View className="mb-10">
                    <PatternCarousel selectedPattern={selectedPattern} onSelectPattern={setSelectedPattern} />
                </View>

                {/* Drift Timer */}
                <View className="mb-8">
                    <View className="flex-row items-center mb-4 ml-4">
                        <Clock {...({ size: 20, color: "#94a3b8" } as any)} />
                        <Text className="text-gray-400 ml-2 font-semibold">Drift Timer (Minutes)</Text>
                    </View>
                    <View className="flex-row px-4">
                        {timerOptions.map((time) => (
                            <TouchableOpacity
                                key={time}
                                onPress={() => setSelectedTimer(time)}
                                className={`flex-1 mr-2 py-4 rounded-2xl items-center ${selectedTimer === time ? 'bg-soft-lavender' : 'bg-charcoal'
                                    }`}
                            >
                                <Text
                                    className={`font-bold text-lg ${selectedTimer === time ? 'text-midnight-navy' : 'text-gray-400'
                                        }`}
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
                        className={`rounded-3xl py-5 items-center justify-center shadow-lg bg-biolum-blue shadow-biolum-blue/30 ${!isConnected ? 'opacity-50' : ''}`}
                        disabled={!isConnected}
                    >
                        <View className="flex-row items-center">
                            <Play {...({ size: 24, color: "#0f172a", fill: "#0f172a" } as any)} />
                            <Text className="text-midnight-navy text-xl font-bold ml-2">
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
