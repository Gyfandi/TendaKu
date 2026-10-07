import StatCard from "@/components/StatCard";
import { dashboardStyles } from "@/constants/dashboardStyles";
import { colors, styles } from "@/constants/styles";
import { daftarBarang } from "@/data/barang";
import { daftarTransaksi } from "@/data/transaksi";
import { StatusTransaksi } from "@/types/transaksi";
import {
  formatRupiah,
  getStatusAktual,
  hitungDenda,
  hitungDurasi,
  hitungTotalHarga,
} from "@/utils/hitung";
import { Ionicons } from "@expo/vector-icons";
import { ScrollView, Text, View } from "react-native";

interface StatItem {
  id: string;
  label: string;
  nilai: number;
  icon: keyof typeof Ionicons.glyphMap;
  warna: string;
}

const warnaStatus = (status: StatusTransaksi): string => {
  if (status === "terlambat") return colors.danger;
  if (status === "dikembalikan") return colors.textSecondary;
  return colors.success;
};

export default function Dashboard() {
  const transaksiAktif = daftarTransaksi.filter(
    (t) => getStatusAktual(t) !== "dikembalikan",
  );
  const transaksiTerlambat = daftarTransaksi.filter(
    (t) => getStatusAktual(t) === "terlambat",
  );
  const unitDisewa = transaksiAktif.reduce((total, t) => total + t.jumlah, 0);
  const totalPenyewa = new Set(daftarTransaksi.map((t) => t.penyewa)).size;

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

      <View style={[styles.sectionHeader, { marginTop: 8 }]}>
        <Text style={styles.sectionTitle}>Transaksi Aktif</Text>
      </View>

      {transaksiAktif.map((t) => {
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

      <View style={styles.bottomSpace} />
    </ScrollView>
  );
}
