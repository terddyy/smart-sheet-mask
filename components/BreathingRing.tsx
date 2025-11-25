import React, { useEffect } from 'react';
import { View } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withRepeat,
    withTiming,
    Easing,
} from 'react-native-reanimated';

export default function BreathingRing() {
    const scale = useSharedValue(1);
    const opacity = useSharedValue(0.5);

    useEffect(() => {
        scale.value = withRepeat(
            withTiming(1.2, { duration: 4000, easing: Easing.inOut(Easing.ease) }),
            -1,
            true
        );
        opacity.value = withRepeat(
            withTiming(0.8, { duration: 4000, easing: Easing.inOut(Easing.ease) }),
            -1,
            true
        );
    }, []);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ scale: scale.value }],
            opacity: opacity.value,
        };
    });

    return (
        <View className="items-center justify-center">
            <Animated.View
                className="w-64 h-64 rounded-full bg-biolum-blue absolute"
                style={animatedStyle}
            />
            <View className="w-48 h-48 rounded-full bg-midnight-navy border-4 border-biolum-blue items-center justify-center shadow-lg shadow-biolum-blue/50">
                <View className="w-40 h-40 rounded-full bg-charcoal items-center justify-center">
                    {/* Inner content can go here */}
                </View>
            </View>
        </View>
    );
}
