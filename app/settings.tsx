import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Switch, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AlarmClock, ShieldAlert, Moon, Info } from 'lucide-react-native';
import SessionControl from '../components/SessionControl';

export default function Settings() {
    const [alarmEnabled, setAlarmEnabled] = useState(false);
    const [alarmTime, setAlarmTime] = useState('7:00 AM');
    const [darkMode, setDarkMode] = useState(true);
    const [safetyTimeout, setSafetyTimeout] = useState(true);

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.content}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Settings</Text>
                    <Text style={styles.headerSubtitle}>Customize your experience</Text>
                </View>

                {/* Alarm Configuration */}
                <View style={styles.card}>
                    <View style={styles.cardHeader}>
                        <View style={styles.rowCenter}>
                            <AlarmClock {...({ size: 24, color: "#60a5fa" } as any)} />
                            <Text style={styles.cardTitle}>Silent Alarm</Text>
                        </View>
                        <Switch
                            value={alarmEnabled}
                            onValueChange={setAlarmEnabled}
                            trackColor={{ false: '#334155', true: '#60a5fa' }}
                            thumbColor={alarmEnabled ? '#a78bfa' : '#94a3b8'}
                        />
                    </View>
                    {alarmEnabled && (
                        <View style={styles.cardContentIndented}>
                            <Text style={styles.helperText}>Wake-up time</Text>
                            <TouchableOpacity style={styles.timeButton}>
                                <Text style={styles.timeButtonText}>{alarmTime}</Text>
                            </TouchableOpacity>
                            <Text style={styles.helperHint}>
                                Gentle vibration will wake you up
                            </Text>
                        </View>
                    )}
                </View>

                {/* Safety Settings */}
                <View style={styles.card}>
                    <View style={styles.cardHeader}>
                        <View style={styles.rowCenter}>
                            <ShieldAlert {...({ size: 24, color: "#a78bfa" } as any)} />
                            <Text style={styles.cardTitle}>Safety Timeout</Text>
                        </View>
                        <Switch
                            value={safetyTimeout}
                            onValueChange={setSafetyTimeout}
                            trackColor={{ false: '#334155', true: '#60a5fa' }}
                            thumbColor={safetyTimeout ? '#a78bfa' : '#94a3b8'}
                        />
                    </View>
                    <Text style={styles.cardBodyText}>
                        Auto-stop after 45 minutes to prevent nerve desensitization
                    </Text>
                </View>

                {/* Dark Mode (Always On) */}
                <View style={styles.card}>
                    <View style={styles.cardHeaderNoMargin}>
                        <View style={styles.rowCenter}>
                            <Moon {...({ size: 24, color: "#a78bfa" } as any)} />
                            <Text style={styles.cardTitle}>Dark Mode</Text>
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
                <TouchableOpacity style={styles.guideCard}>
                    <View style={styles.guideHeader}>
                        <Info {...({ size: 24, color: "#60a5fa" } as any)} />
                        <Text style={styles.guideTitle}>Safety Guide</Text>
                    </View>
                    <Text style={styles.guideText}>
                        <Text style={styles.guideTextBold}>Important:</Text> Always sleep on your side or back.
                        Never wear the mask while sleeping face down to avoid breathing restrictions.
                        {'\n\n'}
                        Tap to view full safety instructions.
                    </Text>
                </TouchableOpacity>

                {/* App Info */}
                <View style={styles.appInfo}>
                    <Text style={styles.appInfoText}>S.M.A.R.T. Sleep Mask</Text>
                    <Text style={styles.appInfoTextSecondary}>Version 1.0.0 • Demo Mode</Text>
                </View>
            </ScrollView>

            {/* Session Control Bar */}
            <SessionControl />
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
    headerSubtitle: {
        color: "#9ca3af",
    },
    rowCenter: {
        flexDirection: "row",
        alignItems: "center",
    },
    card: {
        marginBottom: 24,
        padding: 24,
        backgroundColor: "#1e293b",
        borderRadius: 24,
    },
    cardHeader: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 16,
    },
    cardHeaderNoMargin: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    cardTitle: {
        color: "#ffffff",
        fontSize: 18,
        fontWeight: "700",
        marginLeft: 12,
    },
    cardContentIndented: {
        paddingLeft: 36,
    },
    helperText: {
        color: "#9ca3af",
        fontSize: 14,
        marginBottom: 8,
    },
    timeButton: {
        backgroundColor: "#0f172a",
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 12,
    },
    timeButtonText: {
        color: "#60a5fa",
        fontWeight: "700",
        fontSize: 18,
    },
    helperHint: {
        color: "#6b7280",
        fontSize: 12,
        marginTop: 8,
    },
    cardBodyText: {
        color: "#9ca3af",
        fontSize: 14,
        paddingLeft: 36,
    },
    guideCard: {
        marginBottom: 24,
        padding: 24,
        backgroundColor: "rgba(96,165,250,0.1)",
        borderWidth: 2,
        borderColor: "#60a5fa",
        borderRadius: 24,
    },
    guideHeader: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 12,
    },
    guideTitle: {
        color: "#60a5fa",
        fontSize: 18,
        fontWeight: "700",
        marginLeft: 12,
    },
    guideText: {
        color: "#d1d5db",
        fontSize: 14,
        lineHeight: 20,
    },
    guideTextBold: {
        fontWeight: "700",
        color: "#d1d5db",
    },
    appInfo: {
        alignItems: "center",
        marginBottom: 32,
    },
    appInfoText: {
        color: "#4b5563",
        fontSize: 12,
    },
    appInfoTextSecondary: {
        color: "#4b5563",
        fontSize: 12,
        marginTop: 4,
    },
});
