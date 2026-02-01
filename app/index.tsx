import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
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
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>{greeting}</Text>
                    <View style={styles.rowCenter}>
                        <TouchableOpacity
                            onPress={handleConnect}
                            disabled={isConnected || isConnecting}
                            style={[
                                styles.connectPill,
                                isConnected
                                    ? styles.connectPillConnected
                                    : isConnecting
                                        ? styles.connectPillConnecting
                                        : styles.connectPillDisconnected,
                            ]}
                        >
                            <Bluetooth {...({ 
                                size: 16, 
                                color: isConnected ? '#60a5fa' : isConnecting ? '#eab308' : '#ef4444' 
                            } as any)} />
                            <Text
                                style={[
                                    styles.connectText,
                                    isConnected
                                        ? styles.connectTextConnected
                                        : isConnecting
                                            ? styles.connectTextConnecting
                                            : styles.connectTextDisconnected,
                                ]}
                            >
                                {isConnected ? 'Connected' : isConnecting ? 'Connecting...' : 'Tap to Connect'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Breathing Ring */}
                <View style={styles.ringSection}>
                    {/* <BreathingRing /> */}
                    <View style={styles.ring}>
                        <Text style={styles.ringEmoji}>😴</Text>
                    </View>
                    <Text style={styles.ringSubtitle}>
                        Your mask is ready for sleep
                    </Text>
                </View>

                {/* Quick Start Options */}
                <View style={styles.quickStartSection}>
                    <Text style={styles.quickStartTitle}>Quick Start</Text>

                    {(quickStartPhase !== 'idle' || isConnecting) && (
                        <View style={styles.statusCard}>
                            <View style={styles.rowCenter}>
                                {(isQuickStartBusy || isConnecting) && (
                                    <ActivityIndicator size="small" color="#ffffff" />
                                )}
                                <Text style={styles.statusText}>
                                    {isConnecting
                                        ? 'Connecting to mask...'
                                        : quickStartMessage || 'Preparing...'}
                                </Text>
                            </View>
                            {quickStartPhase === 'error' && (
                                <Text style={styles.statusHint}>
                                    Make sure Bluetooth is ON and the mask is powered.
                                </Text>
                            )}
                        </View>
                    )}
                    
                    {/* Quick Relax */}
                    <TouchableOpacity 
                        onPress={() => handleQuickStart('quick-relax', 2, 45, 5, 'Quick Relax')}
                        disabled={isQuickStartBusy}
                        style={[
                            styles.presetButton,
                            styles.quickRelaxButton,
                            styles.presetButtonHighlight,
                            activePresetId === 'quick-relax' && isQuickStartBusy && styles.buttonBusy,
                        ]}
                    >
                        <View style={styles.buttonRow}>
                            <View>
                                <Text style={styles.presetTitleDark}>Quick Relax</Text>
                                <Text style={styles.presetSubtitleDark}>Wave • 5min • 45%</Text>
                            </View>
                            <View style={styles.pillDark}>
                                {activePresetId === 'quick-relax' && isQuickStartBusy ? (
                                    <ActivityIndicator size="small" color="#0B1220" />
                                ) : (
                                    <Text style={styles.pillTextDark}>5 MIN</Text>
                                )}
                            </View>
                        </View>
                    </TouchableOpacity>

                    {/* Deep Sleep */}
                    <TouchableOpacity 
                        onPress={() => handleQuickStart('deep-sleep', 1, 60, 10, 'Deep Sleep')}
                        disabled={isQuickStartBusy}
                        style={[
                            styles.presetButton,
                            styles.deepSleepButton,
                            styles.presetButtonHighlight,
                            activePresetId === 'deep-sleep' && isQuickStartBusy && styles.buttonBusy,
                        ]}
                    >
                        <View style={styles.buttonRow}>
                            <View>
                                <Text style={styles.presetTitleDark}>Deep Sleep</Text>
                                <Text style={styles.presetSubtitleDark}>Pulse • 10min • 60%</Text>
                            </View>
                            <View style={styles.pillDark}>
                                {activePresetId === 'deep-sleep' && isQuickStartBusy ? (
                                    <ActivityIndicator size="small" color="#0B1220" />
                                ) : (
                                    <Text style={styles.pillTextDark}>10 MIN</Text>
                                )}
                            </View>
                        </View>
                    </TouchableOpacity>

                    {/* Power Nap */}
                    <TouchableOpacity 
                        onPress={() => handleQuickStart('power-nap', 3, 70, 15, 'Power Nap')}
                        disabled={isQuickStartBusy}
                        style={[
                            styles.presetButton,
                            styles.powerNapButton,
                            styles.presetButtonHighlight,
                            activePresetId === 'power-nap' && isQuickStartBusy && styles.buttonBusy,
                        ]}
                    >
                        <View style={styles.buttonRow}>
                            <View>
                                <Text style={styles.presetTitleLight}>Power Nap</Text>
                                <Text style={styles.presetSubtitleLight}>Constant • 15min • 70%</Text>
                            </View>
                            <View style={styles.pillLight}>
                                {activePresetId === 'power-nap' && isQuickStartBusy ? (
                                    <ActivityIndicator size="small" color="#ffffff" />
                                ) : (
                                    <Text style={styles.pillTextLight}>15 MIN</Text>
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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#0f172a",
    },
    content: {
        flex: 1,
        paddingHorizontal: 24,
        paddingVertical: 32,
    },
    header: {
        marginBottom: 32,
    },
    headerTitle: {
        fontSize: 32,
        fontWeight: "700",
        color: "#ffffff",
        marginBottom: 8,
    },
    rowCenter: {
        flexDirection: "row",
        alignItems: "center",
    },
    connectPill: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 999,
    },
    connectPillConnected: {
        backgroundColor: "rgba(96,165,250,0.2)",
    },
    connectPillConnecting: {
        backgroundColor: "rgba(234,179,8,0.2)",
    },
    connectPillDisconnected: {
        backgroundColor: "rgba(239,68,68,0.2)",
    },
    connectText: {
        marginLeft: 8,
        fontSize: 14,
        fontWeight: "600",
    },
    connectTextConnected: {
        color: "#60a5fa",
    },
    connectTextConnecting: {
        color: "#eab308",
    },
    connectTextDisconnected: {
        color: "#ef4444",
    },
    ringSection: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 24,
    },
    ring: {
        width: 192,
        height: 192,
        borderRadius: 96,
        backgroundColor: "rgba(96,165,250,0.1)",
        alignItems: "center",
        justifyContent: "center",
    },
    ringEmoji: {
        fontSize: 60,
        color: "#60a5fa",
    },
    ringSubtitle: {
        marginTop: 24,
        textAlign: "center",
        fontSize: 14,
        color: "#9ca3af",
    },
    quickStartSection: {
        marginBottom: 16,
        padding: 8,
        borderRadius: 18,
        borderWidth: 1,
        borderColor: "rgba(96,165,250,0.4)",
        backgroundColor: "rgba(96,165,250,0.05)",
    },
    quickStartTitle: {
        color: "#ffffff",
        fontSize: 18,
        fontWeight: "600",
        marginBottom: 12,
        paddingHorizontal: 8,
        textTransform: "uppercase",
        letterSpacing: 0.6,
    },
    statusCard: {
        marginBottom: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 16,
        backgroundColor: "#1e293b",
        borderWidth: 1,
        borderColor: "#4b5563",
    },
    statusText: {
        color: "#ffffff",
        fontSize: 14,
        fontWeight: "600",
        marginLeft: 12,
    },
    statusHint: {
        color: "#9ca3af",
        fontSize: 12,
        marginTop: 8,
    },
    presetButton: {
        borderRadius: 16,
        paddingVertical: 16,
        paddingHorizontal: 20,
        marginBottom: 12,
        shadowColor: "#000000",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
        elevation: 4,
    },
    presetButtonHighlight: {
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.35)",
        shadowColor: "#60a5fa",
        shadowOpacity: 0.25,
        shadowRadius: 12,
    },
    quickRelaxButton: {
        backgroundColor: "rgba(96,165,250,0.9)",
    },
    deepSleepButton: {
        backgroundColor: "rgba(167,139,250,0.9)",
    },
    powerNapButton: {
        backgroundColor: "#1e293b",
        borderWidth: 1,
        borderColor: "#4b5563",
    },
    buttonBusy: {
        opacity: 0.7,
    },
    buttonRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    presetTitleDark: {
        color: "#0f172a",
        fontSize: 18,
        fontWeight: "700",
    },
    presetSubtitleDark: {
        color: "rgba(15,23,42,0.7)",
        fontSize: 14,
        marginTop: 4,
    },
    presetTitleLight: {
        color: "#ffffff",
        fontSize: 18,
        fontWeight: "700",
    },
    presetSubtitleLight: {
        color: "#9ca3af",
        fontSize: 14,
        marginTop: 4,
    },
    pillDark: {
        backgroundColor: "rgba(15,23,42,0.1)",
        borderRadius: 999,
        paddingHorizontal: 12,
        paddingVertical: 4,
    },
    pillLight: {
        backgroundColor: "rgba(255,255,255,0.1)",
        borderRadius: 999,
        paddingHorizontal: 12,
        paddingVertical: 4,
    },
    pillTextDark: {
        color: "#0f172a",
        fontSize: 12,
        fontWeight: "600",
    },
    pillTextLight: {
        color: "#ffffff",
        fontSize: 12,
        fontWeight: "600",
    },
});
