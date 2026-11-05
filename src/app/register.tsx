import { colors } from "@/constants/styles";
import { useAuth } from "@/context/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator, KeyboardAvoidingView, Platform, Pressable,
  ScrollView, StyleSheet, Text, TextInput, View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RegisterScreen() {
  const router = useRouter();
  const { register } = useAuth();
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleRegister = async () => {
    setError("");
    if (!fullName.trim() || !username.trim() || !password || !confirmPassword) {
      setError("Semua kolom wajib diisi.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Konfirmasi password tidak sama.");
      return;
    }
    setSubmitting(true);
    const result = await register(fullName, username, password);
    setSubmitting(false);
    if (result.success) router.replace("/profile");
    else setError(result.message ?? "Pendaftaran gagal.");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView style={styles.keyboard} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <View style={styles.topBar}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={22} color={colors.white} />
          </Pressable>
          <Text style={styles.topTitle}>Buat Akun TendaKu</Text>
        </View>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <View style={styles.logo}><Ionicons name="person-add-outline" size={32} color={colors.primary} /></View>
          <Text style={styles.eyebrow}>GABUNG BERSAMA KAMI</Text>
          <Text style={styles.title}>Buat akun baru</Text>
          <Text style={styles.subtitle}>Daftar untuk mulai menyewa perlengkapan outdoor.</Text>
          <View style={styles.form}>
            <Text style={styles.label}>Nama lengkap</Text>
            <View style={styles.inputWrap}>
              <Ionicons name="person-outline" size={19} color={colors.textSecondary} />
              <TextInput value={fullName} onChangeText={setFullName} placeholder="Nama lengkap"
                placeholderTextColor="#8A968E" style={styles.input} />
            </View>
            <Text style={styles.label}>Username</Text>
            <View style={styles.inputWrap}>
              <Ionicons name="at-outline" size={19} color={colors.textSecondary} />
              <TextInput value={username} onChangeText={setUsername} placeholder="Buat username"
                placeholderTextColor="#8A968E" autoCapitalize="none" autoCorrect={false} style={styles.input} />
            </View>
            <Text style={styles.label}>Password</Text>
            <View style={styles.inputWrap}>
              <Ionicons name="lock-closed-outline" size={19} color={colors.textSecondary} />
              <TextInput value={password} onChangeText={setPassword} placeholder="Minimal 6 karakter"
                placeholderTextColor="#8A968E" secureTextEntry={!showPassword} autoCapitalize="none" style={styles.input} />
              <Pressable onPress={() => setShowPassword((v) => !v)}>
                <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={19} color={colors.textSecondary} />
              </Pressable>
            </View>
            <Text style={styles.label}>Konfirmasi password</Text>
            <View style={styles.inputWrap}>
              <Ionicons name="shield-checkmark-outline" size={19} color={colors.textSecondary} />
              <TextInput value={confirmPassword} onChangeText={setConfirmPassword} placeholder="Ulangi password"
                placeholderTextColor="#8A968E" secureTextEntry={!showPassword} autoCapitalize="none"
                style={styles.input} onSubmitEditing={handleRegister} />
            </View>
            {!!error && <Text style={styles.error}>{error}</Text>}
            <Pressable onPress={handleRegister} disabled={submitting}
              style={({ pressed }) => [styles.primaryButton, (pressed || submitting) && { opacity: 0.75 }]}>
              {submitting ? <ActivityIndicator color={colors.white} /> : <>
                <Text style={styles.buttonText}>Daftar sebagai User</Text>
                <Ionicons name="arrow-forward" size={19} color={colors.white} />
              </>}
            </Pressable>
            <View style={styles.loginRow}>
              <Text style={styles.note}>Sudah punya akun?</Text>
              <Pressable onPress={() => router.replace("/login")}>
                <Text style={styles.loginLink}> Login</Text>
              </Pressable>
            </View>
          </View>
          <Text style={styles.footerNote}>Pendaftaran mandiri hanya membuat akun User, bukan Admin.</Text>
        </ScrollView>
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
  content: { flexGrow: 1, justifyContent: "center", paddingHorizontal: 24, paddingVertical: 24 },
  logo: { width: 62, height: 62, borderRadius: 19, backgroundColor: colors.white, alignItems: "center", justifyContent: "center", alignSelf: "center", marginBottom: 16 },
  eyebrow: { textAlign: "center", color: colors.success, fontSize: 10, fontWeight: "900", letterSpacing: 2 },
  title: { textAlign: "center", color: colors.text, fontSize: 26, fontWeight: "900", marginTop: 8 },
  subtitle: { textAlign: "center", color: colors.textSecondary, fontSize: 13, lineHeight: 20, marginTop: 8, marginBottom: 22 },
  form: { backgroundColor: colors.white, borderRadius: 20, padding: 18, borderWidth: 1, borderColor: colors.border },
  label: { color: colors.text, fontSize: 12, fontWeight: "800", marginBottom: 7, marginTop: 9 },
  inputWrap: { minHeight: 48, borderRadius: 13, borderWidth: 1, borderColor: colors.border, paddingHorizontal: 13, flexDirection: "row", alignItems: "center", gap: 10 },
  input: { flex: 1, color: colors.text, fontSize: 14, paddingVertical: 9 },
  error: { color: colors.danger, fontSize: 12, marginTop: 10 },
  primaryButton: { minHeight: 50, borderRadius: 14, backgroundColor: colors.primary, flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 10, marginTop: 20 },
  buttonText: { color: colors.white, fontWeight: "800", fontSize: 14 },
  loginRow: { flexDirection: "row", justifyContent: "center", marginTop: 18 },
  note: { color: colors.textSecondary, fontSize: 12 },
  loginLink: { color: colors.primary, fontSize: 12, fontWeight: "800" },
  footerNote: { textAlign: "center", color: colors.textSecondary, fontSize: 11, marginTop: 18 },
});
