import { colors } from "@/constants/styles";
import { useAuth } from "@/context/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator, KeyboardAvoidingView, Platform, Pressable,
  StyleSheet, Text, TextInput, View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (submitting || !username.trim() || !password) return;
    setError("");
    setSubmitting(true);
    const success = await login(username, password);
    setSubmitting(false);
    if (success) router.replace("/profile");
    else setError("Username atau password tidak sesuai.");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView style={styles.keyboard} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <View style={styles.topBar}>
          <Pressable onPress={() => router.replace("/")} style={styles.backButton}>
            <Ionicons name="arrow-back" size={22} color={colors.white} />
          </Pressable>
          <Text style={styles.topTitle}>TendaKu</Text>
        </View>
        <View style={styles.content}>
          <View style={styles.logo}><Ionicons name="person-outline" size={34} color={colors.primary} /></View>
          <Text style={styles.eyebrow}>AREA MEMBER TENDAKU</Text>
          <Text style={styles.title}>Selamat datang!</Text>
          <Text style={styles.subtitle}>Login untuk menyewa perlengkapan atau mengelola TendaKu.</Text>
          <View style={styles.form}>
            <Text style={styles.label}>Username</Text>
            <View style={styles.inputWrap}>
              <Ionicons name="person-outline" size={19} color={colors.textSecondary} />
              <TextInput value={username} onChangeText={setUsername} placeholder="Masukkan username"
                placeholderTextColor="#8A968E" autoCapitalize="none" autoCorrect={false}
                style={styles.input} returnKeyType="next" />
            </View>
            <Text style={styles.label}>Password</Text>
            <View style={styles.inputWrap}>
              <Ionicons name="lock-closed-outline" size={19} color={colors.textSecondary} />
              <TextInput value={password} onChangeText={setPassword} placeholder="Masukkan password"
                placeholderTextColor="#8A968E" secureTextEntry={!showPassword} autoCapitalize="none"
                style={styles.input} onSubmitEditing={handleLogin} returnKeyType="done" />
              <Pressable onPress={() => setShowPassword((v) => !v)}>
                <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={19} color={colors.textSecondary} />
              </Pressable>
            </View>
            {!!error && <Text style={styles.error}>{error}</Text>}
            <Pressable onPress={handleLogin} disabled={submitting || !username.trim() || !password}
              style={({ pressed }) => [styles.loginButton, (pressed || submitting) && { opacity: 0.75 },
                (!username.trim() || !password) && { opacity: 0.5 }]}>
              {submitting ? <ActivityIndicator color={colors.white} /> : <>
                <Text style={styles.loginText}>Login</Text>
                <Ionicons name="arrow-forward" size={19} color={colors.white} />
              </>}
            </Pressable>
            <View style={styles.registerRow}>
              <Text style={styles.registerText}>Belum punya akun?</Text>
              <Pressable onPress={() => router.push("/register")}>
                <Text style={styles.registerLink}> Daftar sekarang</Text>
              </Pressable>
            </View>
          </View>
          <Text style={styles.note}>Admin menggunakan akun administrator khusus.</Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  keyboard: { flex: 1 },
  topBar: { minHeight: 58, backgroundColor: colors.primary, flexDirection: "row", alignItems: "center", paddingHorizontal: 18, gap: 14 },
  backButton: { width: 38, height: 38, borderRadius: 12, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(255,255,255,0.14)" },
  topTitle: { color: colors.white, fontSize: 16, fontWeight: "800" },
  content: { flex: 1, justifyContent: "center", paddingHorizontal: 24, paddingBottom: 24 },
  logo: { width: 66, height: 66, borderRadius: 20, backgroundColor: colors.white, alignItems: "center", justifyContent: "center", alignSelf: "center", marginBottom: 20 },
  eyebrow: { textAlign: "center", color: colors.success, fontSize: 10, fontWeight: "900", letterSpacing: 2 },
  title: { textAlign: "center", color: colors.text, fontSize: 28, fontWeight: "900", marginTop: 8 },
  subtitle: { textAlign: "center", color: colors.textSecondary, fontSize: 13, lineHeight: 20, marginTop: 8, marginBottom: 26 },
  form: { backgroundColor: colors.white, borderRadius: 20, padding: 18, borderWidth: 1, borderColor: colors.border },
  label: { color: colors.text, fontSize: 12, fontWeight: "800", marginBottom: 8, marginTop: 8 },
  inputWrap: { minHeight: 50, borderRadius: 13, borderWidth: 1, borderColor: colors.border, paddingHorizontal: 13, flexDirection: "row", alignItems: "center", gap: 10 },
  input: { flex: 1, color: colors.text, fontSize: 14, paddingVertical: 10 },
  error: { color: colors.danger, fontSize: 12, marginTop: 10 },
  loginButton: { minHeight: 50, borderRadius: 14, backgroundColor: colors.primary, flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 10, marginTop: 20 },
  loginText: { color: colors.white, fontWeight: "800", fontSize: 14 },
  registerRow: { flexDirection: "row", justifyContent: "center", marginTop: 18 },
  registerText: { color: colors.textSecondary, fontSize: 12 },
  registerLink: { color: colors.primary, fontSize: 12, fontWeight: "800" },
  note: { textAlign: "center", color: colors.textSecondary, fontSize: 11, marginTop: 18 },
});
