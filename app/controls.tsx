import React, { useState } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity } from 'react-native';
import IntensitySlider from '../components/IntensitySlider';
import PatternCarousel from '../components/PatternCarousel';
import { Clock, Play, Square } from 'lucide-react-native';

const timerOptions = [15, 30, 45, 60];

export default function Controls() {
    const [intensity, setIntensity] = useState(50);
    const [selectedPattern, setSelectedPattern] = useState('wave');
    const [selectedTimer, setSelectedTimer] = useState(30);
    const [isActive, setIsActive] = useState(false);

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
                    <IntensitySlider value={intensity} onValueChange={setIntensity} />
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
                    onPress={() => setIsActive(!isActive)}
                    className={`rounded-3xl py-5 items-center justify-center shadow-lg ${isActive
                        ? 'bg-red-500 shadow-red-500/30'
                        : 'bg-biolum-blue shadow-biolum-blue/30'
                        }`}
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
                                <Text className="text-midnight-navy text-xl font-bold ml-2">Start Session</Text>
                            </>
                        )}
                    </View>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}
