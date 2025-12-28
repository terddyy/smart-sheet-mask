import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BreathingRing from '../components/BreathingRing';
import { Bluetooth, Battery } from 'lucide-react-native';
import { useBluetooth } from '../contexts/BluetoothContext';
import BluetoothService from '../services/BluetoothService';

// Dashboard Screen
export default function Dashboard() {
    const { isConnected, isConnecting, connect } = useBluetooth();
    const [batteryLevel, setBatteryLevel] = useState(87); // Default value
    const currentHour = new Date().getHours();
    const greeting = currentHour < 12 ? 'Good Morning' : currentHour < 18 ? 'Good Afternoon' : 'Good Evening';

    useEffect(() => {
        // Listen for status updates from ESP32
        const handleStatus = (status: any) => {
            if (status.battery !== undefined) {
                setBatteryLevel(status.battery);
            }
        };

        BluetoothService.on('status', handleStatus);

        // Request initial status when connected
        if (isConnected) {
            BluetoothService.requestStatus().catch(console.error);
        }

        return () => {
            BluetoothService.off('status', handleStatus);
        };
    }, [isConnected]);

    const handleConnect = async () => {
        try {
            await connect();
        } catch (error) {
            console.error('Connection failed:', error);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-midnight-navy">
            <View className="flex-1 px-6 py-8">
                {/* Header */}
                <View className="mb-8">
                    <Text className="text-4xl font-bold text-white mb-2">{greeting}</Text>
                    <View className="flex-row items-center">
                        <TouchableOpacity
                            onPress={handleConnect}
                            disabled={isConnected || isConnecting}
                            className={`flex-row items-center mr-4 px-3 py-2 rounded-full ${
                                isConnected 
                                    ? 'bg-biolum-blue/20' 
                                    : isConnecting 
                                        ? 'bg-yellow-500/20' 
                                        : 'bg-red-500/20'
                            }`}
                        >
                            <Bluetooth {...({ 
                                size: 16, 
                                color: isConnected ? '#60a5fa' : isConnecting ? '#eab308' : '#ef4444' 
                            } as any)} />
                            <Text className={`ml-2 text-sm font-semibold ${
                                isConnected 
                                    ? 'text-biolum-blue' 
                                    : isConnecting 
                                        ? 'text-yellow-500' 
                                        : 'text-red-500'
                            }`}>
                                {isConnected ? 'Connected' : isConnecting ? 'Connecting...' : 'Tap to Connect'}
                            </Text>
                        </TouchableOpacity>
                        <View className="flex-row items-center px-3 py-2 rounded-full bg-soft-lavender/20">
                            <Battery {...({ size: 16, color: "#a78bfa" } as any)} />
                            <Text className="ml-2 text-sm font-semibold text-soft-lavender">{batteryLevel}%</Text>
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
