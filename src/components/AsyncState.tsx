import { Ionicons } from "@expo/vector-icons";
import { ReactNode } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";

import { asyncStyles as s } from "@/constants/asyncStyles";
import { colors } from "@/constants/styles";

interface AsyncStateProps {
  loading: boolean;
  error: string | null;
  onRetry?: () => void;
  loadingText?: string;
  /** Pakai true jika menggantikan seluruh layar. */
  fullScreen?: boolean;
  children?: ReactNode;
}

/**
 * Menampilkan salah satu dari: loading, error (dengan tombol coba lagi),
 * atau konten (children) ketika data sudah siap.
 */
export default function AsyncState({
  loading,
  error,
  onRetry,
  loadingText = "Memuat data...",
  fullScreen = false,
  children,
}: AsyncStateProps) {
  const wrapper = [s.center, fullScreen && s.fullScreen];

  if (loading) {
    return (
      <View style={wrapper}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={s.loadingText}>{loadingText}</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={wrapper}>
        <Ionicons name="alert-circle-outline" size={44} color={colors.danger} />
        <Text style={s.errorTitle}>Data gagal dimuat</Text>
        <Text style={s.errorText}>{error}</Text>
        {onRetry && (
          <Pressable
            onPress={onRetry}
            style={({ pressed }) => [s.retryButton, pressed && { opacity: 0.8 }]}
          >
            <Ionicons name="refresh" size={16} color={colors.white} />
            <Text style={s.retryText}>Coba lagi</Text>
          </Pressable>
        )}
      </View>
    );
  }

  return <>{children}</>;
}