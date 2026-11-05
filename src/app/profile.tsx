import { colors } from "@/constants/styles";
import { useAuth } from "@/context/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfileScreen() {
  const router = useRouter();
  const { user, isAdmin, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.replace("/");
  };

  if (!user) return null;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.avatar}>
          <Ionicons name={isAdmin ? "shield-checkmark" : "person"} size={42} color={colors.primary} />
        </View>
        <Text style={styles.eyebrow}>{isAdmin ? "ADMINISTRATOR" : "AKUN TENDAKU"}</Text>
        <Text style={styles.title}>{user.fullName}</Text>
        <Text style={styles.username}>@{user.username}</Text>

        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Ionicons name="person-circle-outline" size={22} color={colors.primary} />
            <View style={styles.infoCopy}>
              <Text style={styles.label}>Nama pengguna</Text>
              <Text style={styles.value}>{user.fullName}</Text>
            </View>
          </View>
          <View style={styles.separator} />
          <View style={styles.infoRow}>
            <Ionicons name="key-outline" size={22} color={colors.primary} />
            <View style={styles.infoCopy}>
              <Text style={styles.label}>Username</Text>
              <Text style={styles.value}>{user.username}</Text>
            </View>
          </View>
          <View style={styles.separator} />
          <View style={styles.infoRow}>
            <Ionicons name="ribbon-outline" size={22} color={colors.primary} />
            <View style={styles.infoCopy}>
              <Text style={styles.label}>Role akun</Text>
              <Text style={styles.value}>{isAdmin ? "Admin" : "User"}</Text>
            </View>
          </View>
        </View>

        {isAdmin && (
          <Pressable onPress={() => router.push("/dashboard")} style={styles.secondaryButton}>
            <Ionicons name="stats-chart-outline" size={19} color={colors.primary} />
            <Text style={styles.secondaryText}>Buka Dashboard Admin</Text>
          </Pressable>
        )}

        <Pressable onPress={handleLogout} style={styles.logoutButton}>
          <Ionicons name="log-out-outline" size={20} color={colors.white} />
          <Text style={styles.logoutText}>Logout</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { flex: 1, padding: 24, alignItems: "center", justifyContent: "center" },
  avatar: { width: 92, height: 92, borderRadius: 30, backgroundColor: colors.white, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: colors.border },
  eyebrow: { color: colors.success, fontSize: 10, fontWeight: "900", letterSpacing: 2, marginTop: 20 },
  title: { color: colors.text, fontSize: 24, fontWeight: "900", marginTop: 7, textAlign: "center" },
  username: { color: colors.textSecondary, fontSize: 13, marginTop: 4 },
  infoCard: { width: "100%", backgroundColor: colors.white, borderRadius: 18, borderWidth: 1, borderColor: colors.border, padding: 17, marginTop: 28 },
  infoRow: { flexDirection: "row", alignItems: "center", gap: 13, paddingVertical: 8 },
  infoCopy: { flex: 1 },
  label: { color: colors.textSecondary, fontSize: 11 },
  value: { color: colors.text, fontSize: 14, fontWeight: "800", marginTop: 3 },
  separator: { height: 1, backgroundColor: colors.border, marginVertical: 7 },
  secondaryButton: { width: "100%", minHeight: 48, borderRadius: 13, borderWidth: 1, borderColor: colors.primary, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 9, marginTop: 18 },
  secondaryText: { color: colors.primary, fontSize: 13, fontWeight: "800" },
  logoutButton: { width: "100%", minHeight: 50, borderRadius: 14, backgroundColor: colors.danger, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 9, marginTop: 12 },
  logoutText: { color: colors.white, fontSize: 14, fontWeight: "800" },
});
