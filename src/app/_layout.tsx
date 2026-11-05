import { colors } from "@/constants/styles";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { RentalProvider } from "@/context/RentalContext";
import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";

function RootNavigator() {
  const { user, isAdmin, isLoading } = useAuth();
  const router = useRouter();
  const segments = useSegments();
  const firstSegment = segments[0];

  const isAdminRoute = firstSegment === "dashboard" || firstSegment === "penyewa";
  const isAuthRoute = firstSegment === "login" || firstSegment === "register";
  const isRentalRoute = firstSegment === "penyewaan";
  const isProfileRoute = firstSegment === "profile";

  useEffect(() => {
    if (isLoading) return;

    if (isAdminRoute && !isAdmin) {
      router.replace("/");
      return;
    }

    // Penyewaan hanya untuk User yang sudah login. Admin dilarang menyewa.
    if (isRentalRoute && (!user || isAdmin)) {
      router.replace(user ? "/" : "/login");
      return;
    }

    if (isAuthRoute && user) {
      router.replace("/profile");
      return;
    }

    if (isProfileRoute && !user) {
      router.replace("/login");
    }
  }, [isAdmin, isAdminRoute, isAuthRoute, isLoading, isProfileRoute, isRentalRoute, router, user]);

  const blockedRoute =
    (isAdminRoute && !isAdmin) ||
    (isRentalRoute && (!user || isAdmin)) ||
    (isAuthRoute && !!user) ||
    (isProfileRoute && !user);

  if (isLoading || blockedRoute) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: colors.background }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.primary },
        headerTintColor: colors.white,
        headerTitleStyle: { fontWeight: "700" },
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="register" options={{ headerShown: false }} />
      <Stack.Screen name="profile" options={{ title: "Profil Saya" }} />
      <Stack.Screen name="dashboard" options={{ title: "Dashboard" }} />
      <Stack.Screen name="penyewa" options={{ title: "Penyewa" }} />
      <Stack.Screen name="barang/[id]" options={{ title: "Detail Barang" }} />
      <Stack.Screen name="penyewaan/index" options={{ title: "Form Penyewaan" }} />
      <Stack.Screen name="penyewaan/ringkasan" options={{ title: "Ringkasan Transaksi" }} />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RentalProvider>
        <RootNavigator />
      </RentalProvider>
    </AuthProvider>
  );
}
