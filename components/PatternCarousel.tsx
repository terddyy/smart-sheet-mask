import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
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
        <View style={styles.container}>
            <Text style={styles.title}>Rhythm Pattern</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                {patterns.map((pattern) => {
                    const Icon = pattern.icon;
                    const isSelected = selectedPattern === pattern.id;
                    return (
                        <TouchableOpacity
                            key={pattern.id}
                            onPress={() => onSelectPattern(pattern.id)}
                            style={[
                                styles.card,
                                isSelected ? styles.cardSelected : styles.cardDefault,
                            ]}
                        >
                            <Icon {...({ size: 32, color: isSelected ? '#0f172a' : '#94a3b8' } as any)} />
                            <Text
                                style={isSelected ? styles.cardTextSelected : styles.cardTextDefault}
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

const styles = StyleSheet.create({
    container: {
        width: "100%",
    },
    title: {
        color: "#9ca3af",
        marginBottom: 16,
        marginLeft: 16,
        fontWeight: "600",
    },
    scrollContent: {
        paddingLeft: 16,
    },
    card: {
        marginRight: 16,
        padding: 16,
        borderRadius: 16,
        alignItems: "center",
        justifyContent: "center",
        width: 128,
        height: 128,
    },
    cardSelected: {
        backgroundColor: "#60a5fa",
    },
    cardDefault: {
        backgroundColor: "#1e293b",
    },
    cardTextSelected: {
        marginTop: 8,
        fontWeight: "700",
        color: "#0f172a",
    },
    cardTextDefault: {
        marginTop: 8,
        fontWeight: "700",
        color: "#9ca3af",
    },
});
