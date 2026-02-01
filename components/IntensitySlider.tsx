import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';

interface IntensitySliderProps {
    value: number;
    onValueChange: (value: number) => void;
}

export default function IntensitySlider({ value, onValueChange }: IntensitySliderProps) {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>
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

const styles = StyleSheet.create({
    container: {
        width: "100%",
        alignItems: "center",
    },
    title: {
        color: "#ffffff",
        fontSize: 18,
        fontWeight: "700",
        marginBottom: 16,
    },
});
