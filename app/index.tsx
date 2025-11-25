import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BreathingRing from '../components/BreathingRing';
import { Bluetooth, Battery } from 'lucide-react-native';

// Dashboard Screen
export default function Dashboard() {
    const [isConnected] = React.useState(true); // Mock connection state
    const currentHour = new Date().getHours();
    const greeting = currentHour < 12 ? 'Good Morning' : currentHour < 18 ? 'Good Afternoon' : 'Good Evening';

    return (
        <SafeAreaView className="flex-1 bg-midnight-navy">
            <View className="flex-1 px-6 py-8">
                {/* Header */}
                <View className="mb-8">
                    <Text className="text-4xl font-bold text-white mb-2">{greeting}</Text>
                    <View className="flex-row items-center">
                        <View className={`flex-row items-center mr-4 px-3 py-2 rounded-full ${isConnected ? 'bg-biolum-blue/20' : 'bg-red-500/20'}`}>
                            <Bluetooth {...({ size: 16, color: isConnected ? '#60a5fa' : '#ef4444' } as any)} />
                            <Text className={`ml-2 text-sm font-semibold ${isConnected ? 'text-biolum-blue' : 'text-red-500'}`}>
                                {isConnected ? 'Connected' : 'Disconnected'}
                            </Text>
                        </View>
                        <View className="flex-row items-center px-3 py-2 rounded-full bg-soft-lavender/20">
                            <Battery {...({ size: 16, color: "#a78bfa" } as any)} />
                            <Text className="ml-2 text-sm font-semibold text-soft-lavender">87%</Text>
                        </View>
                    </View>
                </View>

                {/* Breathing Ring */}
                <View className="flex-1 items-center justify-center mb-8">
                    <BreathingRing />
                    <Text className="text-gray-400 mt-6 text-center text-sm">
                        Your mask is ready for sleep
                    </Text>
                </View>

                {/* Quick Start Button */}
                <TouchableOpacity className="bg-biolum-blue rounded-3xl py-5 items-center justify-center shadow-lg shadow-biolum-blue/30 mb-4">
                    <Text className="text-midnight-navy text-xl font-bold">Quick Start</Text>
                    <Text className="text-midnight-navy/70 text-sm mt-1">Last used: Wave • 30min • 45%</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}
