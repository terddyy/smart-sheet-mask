import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import SessionControl from '../components/SessionControl';
import { Bluetooth } from 'lucide-react-native';
import { useBluetooth } from '../contexts/BluetoothContext';
import BluetoothService from '../services/BluetoothService';

// Dashboard Screen - Home page with quick start presets
export default function Dashboard() {
    const { 
        isConnected, 
        isConnecting, 
        currentMode,
        connect, 
        setMode, 
        setTimer
    } = useBluetooth();
    const router = useRouter();
    const currentHour = new Date().getHours();
    const greeting = currentHour < 12 ? 'Good Morning' : currentHour < 18 ? 'Good Afternoon' : 'Good Evening';

    const [activePresetId, setActivePresetId] = React.useState<string | null>(null);
    const [activePresetLabel, setActivePresetLabel] = React.useState<string>('');
    const [quickStartPhase, setQuickStartPhase] = React.useState<'idle' | 'connecting' | 'applying' | 'error'>('idle');
    const [quickStartMessage, setQuickStartMessage] = React.useState<string>('');

    const handleConnect = async () => {
        try {
            await connect();
        } catch (error) {
            console.error('Connection failed:', error);
        }
    };

    const isQuickStartBusy = quickStartPhase === 'connecting' || quickStartPhase === 'applying';

    const handleQuickStart = async (
        presetId: string,
        mode: number,
        intensity: number,
        durationMinutes: number,
        presetLabel: string
    ) => {
        try {
            if (isQuickStartBusy) return;

            setActivePresetId(presetId);
            setQuickStartPhase('connecting');
            setQuickStartMessage(`Starting ${presetLabel}...`);

            // Connect first (auto), then apply preset
            if (!isConnected) {
                await connect();
                if (!BluetoothService.getConnectionStatus()) {
                    throw new Error('Unable to connect to mask');
                }
            }

            setQuickStartPhase('applying');
            setQuickStartMessage(`Applying ${presetLabel} settings...`);

            // Start session with specified settings
            await setMode(mode, intensity);
            await setTimer(durationMinutes * 60); // minutes -> seconds

            setQuickStartPhase('idle');
            setQuickStartMessage('');
            setActivePresetLabel(presetLabel);
        } catch (error) {
            console.error('Quick start failed:', error);
            setQuickStartPhase('error');
            const message = error instanceof Error ? error.message : 'Failed to start session. Please try again.';
            setQuickStartMessage(message);
            setActivePresetId(null);
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
                            className={`flex-row items-center px-3 py-2 rounded-full ${
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
                    </View>
                </View>

                {/* Breathing Ring */}
                <View className="flex-1 items-center justify-center mb-6">
                    {/* <BreathingRing /> */}
                    <View className="w-48 h-48 rounded-full bg-biolum-blue/10 items-center justify-center">
                        <Text className="text-biolum-blue text-6xl">😴</Text>
                    </View>
                    <Text className="text-gray-400 mt-6 text-center text-sm">
                        Your mask is ready for sleep
                    </Text>
                </View>

                {/* Quick Start Options */}
                <View className="mb-4">
                    <Text className="text-white text-lg font-semibold mb-3 px-2">Quick Start</Text>

                    {(quickStartPhase !== 'idle' || isConnecting) && (
                        <View className="mb-3 px-4 py-3 rounded-2xl bg-charcoal border border-gray-600">
                            <View className="flex-row items-center">
                                {(isQuickStartBusy || isConnecting) && (
                                    <ActivityIndicator size="small" color="#ffffff" />
                                )}
                                <Text className="text-white text-sm font-semibold ml-3">
                                    {isConnecting
                                        ? 'Connecting to mask...'
                                        : quickStartMessage || 'Preparing...'}
                                </Text>
                            </View>
                            {quickStartPhase === 'error' && (
                                <Text className="text-gray-400 text-xs mt-2">
                                    Make sure Bluetooth is ON and the mask is powered.
                                </Text>
                            )}
                        </View>
                    )}
                    
                    {/* Quick Relax */}
                    <TouchableOpacity 
                        onPress={() => handleQuickStart('quick-relax', 2, 45, 5, 'Quick Relax')}
                        disabled={isQuickStartBusy}
                        className={`bg-biolum-blue/90 rounded-2xl py-4 px-5 mb-3 shadow-lg shadow-biolum-blue/20 ${
                            activePresetId === 'quick-relax' && isQuickStartBusy ? 'opacity-70' : ''
                        }`}
                    >
                        <View className="flex-row justify-between items-center">
                            <View>
                                <Text className="text-midnight-navy text-lg font-bold">Quick Relax</Text>
                                <Text className="text-midnight-navy/70 text-sm mt-1">Wave • 5min • 45%</Text>
                            </View>
                            <View className="bg-midnight-navy/10 rounded-full px-3 py-1">
                                {activePresetId === 'quick-relax' && isQuickStartBusy ? (
                                    <ActivityIndicator size="small" color="#0B1220" />
                                ) : (
                                    <Text className="text-midnight-navy text-xs font-semibold">5 MIN</Text>
                                )}
                            </View>
                        </View>
                    </TouchableOpacity>

                    {/* Deep Sleep */}
                    <TouchableOpacity 
                        onPress={() => handleQuickStart('deep-sleep', 1, 60, 10, 'Deep Sleep')}
                        disabled={isQuickStartBusy}
                        className={`bg-soft-lavender/90 rounded-2xl py-4 px-5 mb-3 shadow-lg shadow-soft-lavender/20 ${
                            activePresetId === 'deep-sleep' && isQuickStartBusy ? 'opacity-70' : ''
                        }`}
                    >
                        <View className="flex-row justify-between items-center">
                            <View>
                                <Text className="text-midnight-navy text-lg font-bold">Deep Sleep</Text>
                                <Text className="text-midnight-navy/70 text-sm mt-1">Pulse • 10min • 60%</Text>
                            </View>
                            <View className="bg-midnight-navy/10 rounded-full px-3 py-1">
                                {activePresetId === 'deep-sleep' && isQuickStartBusy ? (
                                    <ActivityIndicator size="small" color="#0B1220" />
                                ) : (
                                    <Text className="text-midnight-navy text-xs font-semibold">10 MIN</Text>
                                )}
                            </View>
                        </View>
                    </TouchableOpacity>

                    {/* Power Nap */}
                    <TouchableOpacity 
                        onPress={() => handleQuickStart('power-nap', 3, 70, 15, 'Power Nap')}
                        disabled={isQuickStartBusy}
                        className={`bg-charcoal rounded-2xl py-4 px-5 border border-gray-600 shadow-lg ${
                            activePresetId === 'power-nap' && isQuickStartBusy ? 'opacity-70' : ''
                        }`}
                    >
                        <View className="flex-row justify-between items-center">
                            <View>
                                <Text className="text-white text-lg font-bold">Power Nap</Text>
                                <Text className="text-gray-400 text-sm mt-1">Constant • 15min • 70%</Text>
                            </View>
                            <View className="bg-white/10 rounded-full px-3 py-1">
                                {activePresetId === 'power-nap' && isQuickStartBusy ? (
                                    <ActivityIndicator size="small" color="#ffffff" />
                                ) : (
                                    <Text className="text-white text-xs font-semibold">15 MIN</Text>
                                )}
                            </View>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Session Control Bar */}
            <SessionControl sessionName={activePresetLabel} />
        </SafeAreaView>
    );
}
