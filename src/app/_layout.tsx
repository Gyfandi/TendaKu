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
            headerShown: false,
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