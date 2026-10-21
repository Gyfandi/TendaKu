import StatCard from "@/components/StatCard";
import { dashboardStyles } from "@/constants/dashboardStyles";
import { colors, styles } from "@/constants/styles";
import { useRental } from "@/context/RentalContext";
import { StatusTransaksi } from "@/types/transaksi";
import {
  formatRupiah,
  getStatusAktual,
  hitungDenda,
  hitungDurasi,
  hitungTotalHarga,
} from "@/utils/hitung";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

interface StatItem {
  id: string;
  label: string;
  nilai: number;
  icon: keyof typeof Ionicons.glyphMap;
  warna: string;
}

type FilterStatus = "semua" | StatusTransaksi;

const daftarFilter: { key: FilterStatus; label: string }[] = [
  { key: "semua", label: "Semua" },
  { key: "dipinjam", label: "Dipinjam" },
  { key: "terlambat", label: "Terlambat" },
  { key: "dikembalikan", label: "Dikembalikan" },
];

const warnaStatus = (status: StatusTransaksi): string => {
  if (status === "terlambat") return colors.danger;
  if (status === "dikembalikan") return colors.textSecondary;
  return colors.success;
};

export default function Dashboard() {
  const router = useRouter();
  const navigation = useNavigation();
  const { barang: daftarBarang, transaksi: daftarTransaksi } = useRental();

  // useState: filter status yang sedang dipilih
  const [filter, setFilter] = useState<FilterStatus>("semua");

  const transaksiAktif = daftarTransaksi.filter(
    (t) => getStatusAktual(t) !== "dikembalikan",
  );
  const transaksiTerlambat = daftarTransaksi.filter(
    (t) => getStatusAktual(t) === "terlambat",
  );
  const unitDisewa = transaksiAktif.reduce((total, t) => total + t.jumlah, 0);
  const totalPenyewa = new Set(daftarTransaksi.map((t) => t.penyewa)).size;

  // Transaksi yang ditampilkan mengikuti filter
  const transaksiTampil = daftarTransaksi.filter(
    (t) => filter === "semua" || getStatusAktual(t) === filter,
  );

  // useEffect: ubah judul header setiap jumlah transaksi terlambat berubah
  useEffect(() => {
    navigation.setOptions({
      title:
        transaksiTerlambat.length > 0
          ? `Dashboard (${transaksiTerlambat.length} terlambat)`
          : "Dashboard",
    });
  }, [navigation, transaksiTerlambat.length]);

  // canGoBack + back + replace
  const handleKembali = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/");
    }
  };

  const statList: StatItem[] = [
    {
      id: "1",
      label: "Total Barang",
      nilai: daftarBarang.length,
      icon: "cube",
      warna: colors.primary,
    },
    {
      id: "2",
      label: "Barang Tersedia",
      nilai: daftarBarang.filter((b) => b.stok > 0).length,
      icon: "checkmark-circle",
      warna: colors.success,
    },
    {
      id: "3",
      label: "Unit Disewa",
      nilai: unitDisewa,
      icon: "bag-handle",
      warna: colors.accent,
    },
    {
      id: "4",
      label: "Total Penyewa",
      nilai: totalPenyewa,
      icon: "people",
      warna: colors.primaryDark,
    },
    {
      id: "5",
      label: "Transaksi Aktif",
      nilai: transaksiAktif.length,
      icon: "document-text",
      warna: "#3B82F6",
    },
    {
      id: "6",
      label: "Terlambat",
      nilai: transaksiTerlambat.length,
      icon: "alert-circle",
      warna: colors.danger,
    },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Ringkasan rental</Text>
        <Text style={styles.title}>Dashboard</Text>
      </View>

      <View style={dashboardStyles.statGrid}>
        {statList.map((item) => (
          <StatCard
            key={item.id}
            label={item.label}
            nilai={item.nilai}
            icon={item.icon}
            warna={item.warna}
          />
        ))}
      </View>

      {/* Menu navigasi pakai router.push() */}
      <View style={dashboardStyles.menuRow}>
        <Pressable
          style={dashboardStyles.menuButton}
          onPress={() => router.push("/penyewa")}
        >
          <Ionicons name="people" size={18} color={colors.white} />
          <Text style={dashboardStyles.menuText}>Penyewa</Text>
        </Pressable>
        <Pressable
          style={dashboardStyles.menuButton}
          onPress={() => router.push("/penyewaan/ringkasan")}
        >
          <Ionicons name="receipt" size={18} color={colors.white} />
          <Text style={dashboardStyles.menuText}>Ringkasan</Text>
        </Pressable>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Daftar Transaksi</Text>
        <Text style={styles.sectionLink}>{transaksiTampil.length} transaksi</Text>
      </View>

      {/* Chip filter status */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoryScroll}
      >
        {daftarFilter.map((item) => {
          const active = filter === item.key;
          return (
            <Pressable
              key={item.key}
              onPress={() => setFilter(item.key)}
              style={[styles.categoryItem, active && styles.categoryItemActive]}
            >
              <Text
                style={[styles.categoryText, active && styles.categoryTextActive]}
              >
                {item.label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {transaksiTampil.length === 0 && (
        <Text style={styles.emptyText}>Tidak ada transaksi.</Text>
      )}

      {transaksiTampil.map((t) => {
        const barang = daftarBarang.find((b) => b.id === t.barangId);
        const durasi = hitungDurasi(t.tanggalPinjam, t.tanggalKembali);
        const total = hitungTotalHarga(
          barang?.hargaPerHari ?? 0,
          durasi,
          t.jumlah,
        );
        const denda = hitungDenda(t);
        const status = getStatusAktual(t);

        return (
          <View key={t.id} style={dashboardStyles.trxCard}>
            <View style={dashboardStyles.trxRow}>
              <Text style={dashboardStyles.trxName}>{t.penyewa}</Text>
              <View
                style={[
                  dashboardStyles.badge,
                  { backgroundColor: warnaStatus(status) },
                ]}
              >
                <Text style={dashboardStyles.badgeText}>
                  {status.toUpperCase()}
                </Text>
              </View>
            </View>
            <Text style={dashboardStyles.trxDetail}>
              {barang?.nama} x{t.jumlah} · {durasi} hari
            </Text>
            <Text style={dashboardStyles.trxDetail}>
              {t.tanggalPinjam} → {t.tanggalKembali}
            </Text>
            <Text style={dashboardStyles.trxTotal}>
              Total: {formatRupiah(total)}
            </Text>
            {denda > 0 && (
              <Text
                style={{
                  color: colors.danger,
                  fontSize: 13,
                  fontWeight: "700",
                  marginTop: 4,
                }}
              >
                Denda: {formatRupiah(denda)}
              </Text>
            )}
          </View>
        );
      })}

      <Pressable style={dashboardStyles.backButton} onPress={handleKembali}>
        <Text style={dashboardStyles.backText}>Kembali</Text>
      </Pressable>

      <View style={styles.bottomSpace} />
    </ScrollView>
  );
}