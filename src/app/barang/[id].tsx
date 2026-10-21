import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import {
    Image,
    Pressable,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";

import { colors } from "@/constants/styles";
import { daftarBarang } from "@/data/barang";

const formatRupiah = (harga: number) => `Rp${harga.toLocaleString("id-ID")}`;

export default function DetailBarangScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const barang = daftarBarang.find((item) => item.id === Number(id));

  if (!barang) {
    return (
      <SafeAreaView style={styles.container}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={22} color={colors.text} />
          <Text style={styles.backText}>Kembali</Text>
        </Pressable>

        <View style={styles.center}>
          <Ionicons
            name="alert-circle-outline"
            size={48}
            color={colors.danger}
          />
          <Text style={styles.title}>Barang tidak ditemukan</Text>
          <Text style={styles.description}>
            Data barang yang kamu cari tidak tersedia.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const tersedia = barang.stok > 0;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={22} color={colors.text} />
          <Text style={styles.backText}>Kembali ke daftar</Text>
        </Pressable>

        <Image source={barang.image} style={styles.image} resizeMode="cover" />

        <View style={styles.content}>
          <Text style={styles.category}>{barang.kategori}</Text>
          <Text style={styles.title}>{barang.nama}</Text>

          <Text style={styles.price}>
            {formatRupiah(barang.hargaPerHari)}
            <Text style={styles.perDay}> / hari</Text>
          </Text>

          <View
            style={[
              styles.stockBadge,
              {
                backgroundColor: tersedia ? "#E7F5EC" : "#FDECEC",
              },
            ]}
          >
            <Ionicons
              name={tersedia ? "checkmark-circle" : "close-circle"}
              size={18}
              color={tersedia ? colors.success : colors.danger}
            />
            <Text
              style={{
                color: tersedia ? colors.success : colors.danger,
                fontWeight: "700",
              }}
            >
              {tersedia ? `Stok tersedia: ${barang.stok}` : "Stok habis"}
            </Text>
          </View>

          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>Informasi Barang</Text>

            <View style={styles.infoRow}>
              <Text style={styles.label}>Nama barang</Text>
              <Text style={styles.value}>{barang.nama}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.label}>Kategori</Text>
              <Text style={styles.value}>{barang.kategori}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.label}>Harga sewa</Text>
              <Text style={styles.value}>
                {formatRupiah(barang.hargaPerHari)} / hari
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.label}>Stok</Text>
              <Text style={styles.value}>{barang.stok} unit</Text>
            </View>
          </View>

          <Pressable
            onPress={() => router.push("/penyewa")}
            disabled={!tersedia}
            style={({ pressed }) => [
              styles.rentButton,
              {
                opacity: !tersedia ? 0.5 : pressed ? 0.8 : 1,
              },
            ]}
          >
            <Ionicons name="calendar-outline" size={20} color="#FFFFFF" />
            <Text style={styles.rentButtonText}>
              {tersedia ? "Lanjut ke Penyewaan" : "Stok Habis"}
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  backText: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text,
  },
  image: {
    width: "100%",
    height: 280,
    backgroundColor: colors.primaryLight,
  },
  content: {
    padding: 20,
  },
  category: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  title: {
    marginTop: 8,
    fontSize: 25,
    fontWeight: "800",
    color: colors.text,
  },
  price: {
    marginTop: 12,
    fontSize: 22,
    fontWeight: "800",
    color: colors.primary,
  },
  perDay: {
    fontSize: 14,
    fontWeight: "400",
    color: colors.textSecondary,
  },
  stockBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: 7,
    marginTop: 16,
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 12,
  },
  infoCard: {
    marginTop: 24,
    padding: 16,
    backgroundColor: colors.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  infoTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: colors.text,
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  label: {
    flex: 1,
    fontSize: 13,
    color: colors.textSecondary,
  },
  value: {
    flex: 1,
    fontSize: 13,
    fontWeight: "600",
    color: colors.text,
    textAlign: "right",
  },
  rentButton: {
    marginTop: 22,
    minHeight: 52,
    borderRadius: 14,
    backgroundColor: colors.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  rentButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  description: {
    marginTop: 8,
    textAlign: "center",
    color: colors.textSecondary,
  },
});
