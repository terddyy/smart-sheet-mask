import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Activity, Waves, Heart, CloudRain } from 'lucide-react-native';

const patterns = [
    { id: 'constant', name: 'Constant', icon: Activity },
    { id: 'wave', name: 'The Wave', icon: Waves },
    { id: 'heartbeat', name: 'Heartbeat', icon: Heart },
    { id: 'rain', name: 'Raindrops', icon: CloudRain },
];

interface PatternCarouselProps {
    selectedPattern: string;
    onSelectPattern: (id: string) => void;
}

export default function PatternCarousel({ selectedPattern, onSelectPattern }: PatternCarouselProps) {
    return (
        <View className="w-full">
            <Text className="text-gray-400 mb-4 ml-4 font-semibold">Rhythm Pattern</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="pl-4">
                {patterns.map((pattern) => {
                    const Icon = pattern.icon;
                    const isSelected = selectedPattern === pattern.id;
                    return (
                        <TouchableOpacity
                            key={pattern.id}
                            onPress={() => onSelectPattern(pattern.id)}
                            className={`mr-4 p-4 rounded-2xl items-center justify-center w-32 h-32 ${isSelected ? 'bg-biolum-blue' : 'bg-charcoal'
                                }`}
                        >
                            <Icon {...({ size: 32, color: isSelected ? '#0f172a' : '#94a3b8' } as any)} />
                            <Text
                                className={`mt-2 font-bold ${isSelected ? 'text-midnight-navy' : 'text-gray-400'
                                    }`}
                            >
                                {pattern.name}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>
        </View>
    );
}
