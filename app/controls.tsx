import React, { useState } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, Alert } from 'react-native';
import IntensitySlider from '../components/IntensitySlider';
import PatternCarousel from '../components/PatternCarousel';
import { Clock, Play, Square } from 'lucide-react-native';
import { useBluetooth } from '../contexts/BluetoothContext';

const timerOptions = [15, 30, 45, 60];

// Pattern mapping to ESP32 modes
const PATTERN_TO_MODE: Record<string, number> = {
    'pulse': 1,
    'wave': 2,
    'constant': 3,
};

export default function Controls() {
    const [intensity, setIntensity] = useState(50);
    const [selectedPattern, setSelectedPattern] = useState('wave');
    const [selectedTimer, setSelectedTimer] = useState(30);
    const [isActive, setIsActive] = useState(false);

    const { isConnected, setMode, setTimer } = useBluetooth();

    const handleStartStop = async () => {
        if (!isConnected) {
            Alert.alert('Not Connected', 'Please connect to the device first from the Sleep tab.');
            return;
        }

        try {
            if (isActive) {
                // Stop session - send mode 0 (OFF)
                await setMode(0, 0);
                setIsActive(false);
            } else {
                // Start session
                const mode = PATTERN_TO_MODE[selectedPattern] || 2;
                await setMode(mode, intensity);
                await setTimer(selectedTimer * 60); // Convert minutes to seconds
                setIsActive(true);
            }
        } catch (error) {
            console.error('Failed to control device:', error);
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

                {/* Start/Stop Button */}
                <TouchableOpacity
                    onPress={handleStartStop}
                    className={`rounded-3xl py-5 items-center justify-center shadow-lg ${isActive
                        ? 'bg-red-500 shadow-red-500/30'
                        : 'bg-biolum-blue shadow-biolum-blue/30'
                        } ${!isConnected ? 'opacity-50' : ''}`}
                    disabled={!isConnected}
                >
                    <View className="flex-row items-center">
                        {isActive ? (
                            <>
                                <Square {...({ size: 24, color: "#0f172a", fill: "#0f172a" } as any)} />
                                <Text className="text-midnight-navy text-xl font-bold ml-2">Stop Session</Text>
                            </>
                        ) : (
                            <>
                                <Play {...({ size: 24, color: "#0f172a", fill: "#0f172a" } as any)} />
                                <Text className="text-midnight-navy text-xl font-bold ml-2">
                                    {isConnected ? 'Start Session' : 'Connect Device First'}
                                </Text>
                            </>
                        )}
                    </View>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}
