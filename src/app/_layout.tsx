import { colors } from "@/constants/styles";
import { RentalProvider } from "@/context/RentalContext";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function RootLayout() {
  return (
    <RentalProvider>
      <Tabs
        backBehavior="history"
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.textSecondary,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Barang",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="cube" size={size} color={color} />
            ),
          }}
        />

        <Tabs.Screen
          name="dashboard"
          options={{
            title: "Dashboard",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="stats-chart" size={size} color={color} />
            ),
          }}
        />

        <Tabs.Screen
          name="penyewa"
          options={{
            title: "Penyewa",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="people" size={size} color={color} />
            ),
          }}
        />

        {/* Layar tersembunyi (tidak muncul di tab bar) */}
        <Tabs.Screen name="barang/[id]" options={{ href: null }} />
        <Tabs.Screen name="penyewaan/index" options={{ href: null }} />
        <Tabs.Screen name="penyewaan/ringkasan" options={{ href: null }} />
      </Tabs>
    </RentalProvider>
  );
}