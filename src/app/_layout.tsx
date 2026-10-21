import { colors } from "@/constants/styles";
import { RentalProvider } from "@/context/RentalContext";
import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import { Pressable, View } from "react-native";

export default function RootLayout() {
  const router = useRouter();

  return (
    <RentalProvider>
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: colors.primary },
          headerTintColor: colors.white,
          headerTitleStyle: { fontWeight: "700" },
        }}
      >
        <Stack.Screen
          name="index"
          options={{
            title: "TendaKu",
            headerRight: () => (
              <View style={{ flexDirection: "row", gap: 18 }}>
                <Pressable onPress={() => router.push("/dashboard")}>
                  <Ionicons name="stats-chart" size={22} color={colors.white} />
                </Pressable>
                <Pressable onPress={() => router.push("/penyewa")}>
                  <Ionicons name="people" size={22} color={colors.white} />
                </Pressable>
              </View>
            ),
          }}
        />
        <Stack.Screen name="dashboard" options={{ title: "Dashboard" }} />
        <Stack.Screen name="penyewa" options={{ title: "Penyewa" }} />
        <Stack.Screen name="barang/[id]" options={{ title: "Detail Barang" }} />
        <Stack.Screen name="penyewaan/index" options={{ title: "Form Penyewaan" }} />
        <Stack.Screen name="penyewaan/ringkasan" options={{ title: "Ringkasan Transaksi" }} />
      </Stack>
    </RentalProvider>
  );
}