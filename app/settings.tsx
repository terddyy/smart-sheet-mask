import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Switch, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AlarmClock, ShieldAlert, Moon, Info } from 'lucide-react-native';
import SessionControl from '../components/SessionControl';

export default function Settings() {
    const [alarmEnabled, setAlarmEnabled] = useState(false);
    const [alarmTime, setAlarmTime] = useState('7:00 AM');
    const [darkMode, setDarkMode] = useState(true);
    const [safetyTimeout, setSafetyTimeout] = useState(true);

    return (
        <SafeAreaView className="flex-1 bg-midnight-navy">
            <ScrollView className="flex-1 px-6 py-8">
                {/* Header */}
                <View className="mb-8">
                    <Text className="text-4xl font-bold text-white mb-2">Settings</Text>
                    <Text className="text-gray-400">Customize your experience</Text>
                </View>

                {/* Alarm Configuration */}
                <View className="mb-6 p-6 bg-charcoal rounded-3xl">
                    <View className="flex-row items-center justify-between mb-4">
                        <View className="flex-row items-center">
                            <AlarmClock {...({ size: 24, color: "#60a5fa" } as any)} />
                            <Text className="text-white text-lg font-bold ml-3">Silent Alarm</Text>
                        </View>
                        <Switch
                            value={alarmEnabled}
                            onValueChange={setAlarmEnabled}
                            trackColor={{ false: '#334155', true: '#60a5fa' }}
                            thumbColor={alarmEnabled ? '#a78bfa' : '#94a3b8'}
                        />
                    </View>
                    {alarmEnabled && (
                        <View className="pl-9">
                            <Text className="text-gray-400 text-sm mb-2">Wake-up time</Text>
                            <TouchableOpacity className="bg-midnight-navy py-3 px-4 rounded-xl">
                                <Text className="text-biolum-blue font-bold text-lg">{alarmTime}</Text>
                            </TouchableOpacity>
                            <Text className="text-gray-500 text-xs mt-2">
                                Gentle vibration will wake you up
                            </Text>
                        </View>
                    )}
                </View>

                {/* Safety Settings */}
                <View className="mb-6 p-6 bg-charcoal rounded-3xl">
                    <View className="flex-row items-center justify-between mb-4">
                        <View className="flex-row items-center">
                            <ShieldAlert {...({ size: 24, color: "#a78bfa" } as any)} />
                            <Text className="text-white text-lg font-bold ml-3">Safety Timeout</Text>
                        </View>
                        <Switch
                            value={safetyTimeout}
                            onValueChange={setSafetyTimeout}
                            trackColor={{ false: '#334155', true: '#60a5fa' }}
                            thumbColor={safetyTimeout ? '#a78bfa' : '#94a3b8'}
                        />
                    </View>
                    <Text className="text-gray-400 text-sm pl-9">
                        Auto-stop after 45 minutes to prevent nerve desensitization
                    </Text>
                </View>

                {/* Dark Mode (Always On) */}
                <View className="mb-6 p-6 bg-charcoal rounded-3xl">
                    <View className="flex-row items-center justify-between">
                        <View className="flex-row items-center">
                            <Moon {...({ size: 24, color: "#a78bfa" } as any)} />
                            <Text className="text-white text-lg font-bold ml-3">Dark Mode</Text>
                        </View>
                        <Switch
                            value={darkMode}
                            onValueChange={setDarkMode}
                            trackColor={{ false: '#334155', true: '#60a5fa' }}
                            thumbColor={darkMode ? '#a78bfa' : '#94a3b8'}
                        />
                    </View>
                </View>

                {/* Safety Guide */}
                <TouchableOpacity className="mb-6 p-6 bg-biolum-blue/10 border-2 border-biolum-blue rounded-3xl">
                    <View className="flex-row items-center mb-3">
                        <Info {...({ size: 24, color: "#60a5fa" } as any)} />
                        <Text className="text-biolum-blue text-lg font-bold ml-3">Safety Guide</Text>
                    </View>
                    <Text className="text-gray-300 text-sm leading-5">
                        <Text className="font-bold">Important:</Text> Always sleep on your side or back.
                        Never wear the mask while sleeping face down to avoid breathing restrictions.
                        {'\n\n'}
                        Tap to view full safety instructions.
                    </Text>
                </TouchableOpacity>

                {/* App Info */}
                <View className="items-center mb-8">
                    <Text className="text-gray-600 text-xs">S.M.A.R.T. Sleep Mask</Text>
                    <Text className="text-gray-600 text-xs mt-1">Version 1.0.0 • Demo Mode</Text>
                </View>
            </ScrollView>

            {/* Session Control Bar */}
            <SessionControl />
        </SafeAreaView>
    );
}
