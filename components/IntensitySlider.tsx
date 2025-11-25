import React from 'react';
import { View, Text } from 'react-native';
import Slider from '@react-native-community/slider';

interface IntensitySliderProps {
    value: number;
    onValueChange: (value: number) => void;
}

export default function IntensitySlider({ value, onValueChange }: IntensitySliderProps) {
    return (
        <View className="w-full items-center">
            <Text className="text-white text-lg font-bold mb-4">
                Intensity: {Math.round(value)}%
            </Text>
            <Slider
                style={{ width: '100%', height: 40 }}
                minimumValue={0}
                maximumValue={100}
                step={1}
                value={value}
                onValueChange={onValueChange}
                minimumTrackTintColor="#60a5fa"
                maximumTrackTintColor="#334155"
                thumbTintColor="#a78bfa"
            />
        </View>
    );
}
