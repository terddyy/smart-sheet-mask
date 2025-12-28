import "../global.css";
import { Tabs } from "expo-router";
import { View, StatusBar } from "react-native";
import { Moon, Sliders, Settings } from "lucide-react-native";
import { BluetoothProvider } from "../contexts/BluetoothContext";

export default function Layout() {
    return (
        <BluetoothProvider>
            <View className="flex-1 bg-midnight-navy">
                <StatusBar barStyle="light-content" backgroundColor="#0f172a" />
                <Tabs
                screenOptions={{
                    headerShown: false,
                    tabBarStyle: {
                        backgroundColor: "#1e293b",
                        borderTopColor: "#334155",
                        height: 60,
                        paddingBottom: 10,
                        paddingTop: 10,
                    },
                    tabBarActiveTintColor: "#60a5fa",
                    tabBarInactiveTintColor: "#94a3b8",
                }}
            >
                <Tabs.Screen
                    name="index"
                    options={{
                        title: "Sleep",
                        tabBarIcon: ({ color, size }) => <Moon {...({ color, size } as any)} />,
                    }}
                />
                <Tabs.Screen
                    name="controls"
                    options={{
                        title: "Controls",
                        tabBarIcon: ({ color, size }) => <Sliders {...({ color, size } as any)} />,
                    }}
                />
                <Tabs.Screen
                    name="settings"
                    options={{
                        title: "Settings",
                        tabBarIcon: ({ color, size }) => <Settings {...({ color, size } as any)} />,
                    }}
                />
            </Tabs>
        </View>
        </BluetoothProvider>
    );
}
