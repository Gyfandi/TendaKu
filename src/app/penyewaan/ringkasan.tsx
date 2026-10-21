import { rentalStyles as s } from "@/constants/rentalStyles";
import { colors } from "@/constants/styles";
import { useRental } from "@/context/RentalContext";
import { formatRupiah, hitungDurasi, hitungTotalHarga } from "@/utils/hitung";
import { parseTanggal } from "@/utils/tanggal";
import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Row = ({ label, value }: { label: string; value: string }) => (
  <View style={s.row}>
    <Text style={s.rowLabel}>{label}</Text>
    <Text style={s.rowValue}>{value}</Text>
  </View>
);

export default function RingkasanTransaksiScreen() {
  const { id, penyewa, tanggalPinjam, tanggalKembali, jumlah } =
    useLocalSearchParams<{
      id: string;
      penyewa: string;
      tanggalPinjam: string;
      tanggalKembali: string;
      jumlah: string;
    }>();

  const { barang: daftarBarang, sewaBarang } = useRental();
  const [tersimpan, setTersimpan] = useState(false);
  const [gagal, setGagal] = useState(false);

  // Layar tab tetap ter-mount: reset status setiap layar dibuka lagi
  useFocusEffect(
    useCallback(() => {
      setTersimpan(false);
      setGagal(false);
    }, []),
  );

  const barang = daftarBarang.find((item) => item.id === Number(id));
  const jumlahUnit = Number(jumlah);

  const dataValid =
    !!barang &&
    !!penyewa &&
    !!parseTanggal(tanggalPinjam ?? "") &&
    !!parseTanggal(tanggalKembali ?? "") &&
    Number.isInteger(jumlahUnit) &&
    jumlahUnit > 0;

  if (!dataValid || !barang) {
    return (
      <SafeAreaView style={s.container}>
        <View style={s.center}>
          <Ionicons name="alert-circle-outline" size={48} color={colors.danger} />
          <Text style={s.title}>Data transaksi tidak lengkap</Text>
          <Pressable onPress={() => router.replace("/")} style={s.button}>
            <Text style={s.buttonText}>Kembali ke daftar barang</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const durasi = hitungDurasi(tanggalPinjam, tanggalKembali);
  const subtotalPerHari = barang.hargaPerHari * jumlahUnit;
  const total = hitungTotalHarga(barang.hargaPerHari, durasi, jumlahUnit);

  const handleSelesai = () => {
    if (tersimpan) return; // cegah transaksi ganda
    setTersimpan(true);

    const berhasil = sewaBarang({
      barangId: barang.id,
      penyewa,
      jumlah: jumlahUnit,
      tanggalPinjam,
      tanggalKembali,
    });

    if (!berhasil) {
      setGagal(true);
      setTersimpan(false);
      return;
    }

    router.replace("/");
  };

  return (
    <SafeAreaView style={s.container}>
      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
        <Pressable onPress={() => router.back()} style={s.backButtonInline}>
          <Ionicons name="arrow-back" size={22} color={colors.text} />
          <Text style={s.backText}>Ubah data</Text>
        </Pressable>

        <Text style={s.title}>Ringkasan Transaksi</Text>
        <Text style={s.muted}>Periksa kembali sebelum menyelesaikan.</Text>

        <View style={s.card}>
          <Text style={s.cardTitle}>Penyewa</Text>
          <Row label="Nama" value={penyewa} />
          <Row label="Tanggal pinjam" value={tanggalPinjam} />
          <Row label="Tanggal kembali" value={tanggalKembali} />
          <Row label="Durasi" value={`${durasi} hari`} />
        </View>

        <View style={s.card}>
          <Text style={s.cardTitle}>Barang</Text>
          <Row label="Nama barang" value={barang.nama} />
          <Row label="Kategori" value={barang.kategori} />
          <Row label="Harga per hari" value={formatRupiah(barang.hargaPerHari)} />
          <Row label="Jumlah" value={`${jumlahUnit} unit`} />
        </View>

        <View style={s.card}>
          <Text style={s.cardTitle}>Rincian Biaya</Text>
          <Row
            label={`${formatRupiah(barang.hargaPerHari)} x ${jumlahUnit} unit`}
            value={formatRupiah(subtotalPerHari)}
          />
          <Row label={`x ${durasi} hari`} value={formatRupiah(total)} />
          <View style={s.grandTotalRow}>
            <Text style={s.grandTotalLabel}>Total</Text>
            <Text style={s.grandTotalValue}>{formatRupiah(total)}</Text>
          </View>
        </View>

        {gagal && (
          <Text style={[s.muted, { color: colors.danger, marginTop: 16 }]}>
            Stok tidak mencukupi. Kembali dan kurangi jumlah.
          </Text>
        )}

        <Pressable
          onPress={handleSelesai}
          disabled={tersimpan}
          style={({ pressed }) => [
            s.button,
            { opacity: tersimpan ? 0.5 : pressed ? 0.8 : 1 },
          ]}
        >
          <Ionicons name="checkmark-circle-outline" size={20} color="#FFFFFF" />
          <Text style={s.buttonText}>Selesai</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}