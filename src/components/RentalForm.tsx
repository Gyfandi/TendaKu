import { colors } from "@/constants/styles";
import { rentalStyles as s } from "@/constants/rentalStyles";
import { useRental } from "@/context/RentalContext";
import { Barang } from "@/types/barang";
import { formatRupiah, hitungDurasi, hitungTotalHarga } from "@/utils/hitung";
import { parseTanggal, tanggalDefault } from "@/utils/tanggal";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";

export interface FormPenyewaan {
  penyewa: string;
  tanggalPinjam: string;
  tanggalKembali: string;
  jumlah: number;
}

interface RentalFormProps {
  barang: Barang;
  onSubmit: (data: FormPenyewaan) => void;
}

export default function RentalForm({ barang, onSubmit }: RentalFormProps) {
  const { transaksi } = useRental();
  const [penyewa, setPenyewa] = useState("");
  const [tanggalPinjam, setTanggalPinjam] = useState(tanggalDefault(0));
  const [tanggalKembali, setTanggalKembali] = useState(tanggalDefault(1));
  const [jumlah, setJumlah] = useState(1);
  const [sudahCoba, setSudahCoba] = useState(false);

  // Layar di dalam Tabs tetap ter-mount, jadi form direset saat barang
  // berganti atau setelah sebuah transaksi tersimpan.
  useEffect(() => {
    setPenyewa("");
    setTanggalPinjam(tanggalDefault(0));
    setTanggalKembali(tanggalDefault(1));
    setJumlah(1);
    setSudahCoba(false);
  }, [barang.id, transaksi.length]);

  const tglPinjam = parseTanggal(tanggalPinjam);
  const tglKembali = parseTanggal(tanggalKembali);

  const errors = {
    penyewa: penyewa.trim() ? "" : "Nama penyewa wajib diisi.",
    tanggalPinjam: tglPinjam ? "" : "Gunakan format YYYY-MM-DD.",
    tanggalKembali: !tglKembali
      ? "Gunakan format YYYY-MM-DD."
      : tglPinjam && tglKembali <= tglPinjam
        ? "Tanggal kembali harus setelah tanggal pinjam."
        : "",
  };
  const formValid =
    !errors.penyewa && !errors.tanggalPinjam && !errors.tanggalKembali;

  const durasi = formValid ? hitungDurasi(tanggalPinjam, tanggalKembali) : 0;
  const total = formValid
    ? hitungTotalHarga(barang.hargaPerHari, durasi, jumlah)
    : 0;

  const kurangi = () => setJumlah((j) => Math.max(1, j - 1));
  const tambah = () => setJumlah((j) => Math.min(barang.stok, j + 1));

  const handleLanjut = () => {
    setSudahCoba(true);
    if (!formValid) return;
    onSubmit({
      penyewa: penyewa.trim(),
      tanggalPinjam,
      tanggalKembali,
      jumlah,
    });
  };

  return (
    <View>
      {/* Barang yang disewa */}
      <View style={s.itemCard}>
        <Text style={s.category}>{barang.kategori}</Text>
        <Text style={s.itemName}>{barang.nama}</Text>
        <Text style={s.itemPrice}>
          {formatRupiah(barang.hargaPerHari)} / hari · Stok {barang.stok}
        </Text>
      </View>

      <Text style={s.label}>Nama penyewa</Text>
      <TextInput
        value={penyewa}
        onChangeText={setPenyewa}
        placeholder="Contoh: Budi Santoso"
        placeholderTextColor={colors.textSecondary}
        style={s.input}
      />
      {sudahCoba && !!errors.penyewa && (
        <Text style={s.error}>{errors.penyewa}</Text>
      )}

      <Text style={s.label}>Tanggal pinjam</Text>
      <TextInput
        value={tanggalPinjam}
        onChangeText={setTanggalPinjam}
        placeholder="YYYY-MM-DD"
        placeholderTextColor={colors.textSecondary}
        keyboardType="numbers-and-punctuation"
        style={s.input}
      />
      {sudahCoba && !!errors.tanggalPinjam && (
        <Text style={s.error}>{errors.tanggalPinjam}</Text>
      )}

      <Text style={s.label}>Tanggal kembali</Text>
      <TextInput
        value={tanggalKembali}
        onChangeText={setTanggalKembali}
        placeholder="YYYY-MM-DD"
        placeholderTextColor={colors.textSecondary}
        keyboardType="numbers-and-punctuation"
        style={s.input}
      />
      {sudahCoba && !!errors.tanggalKembali && (
        <Text style={s.error}>{errors.tanggalKembali}</Text>
      )}

      <Text style={s.label}>Jumlah barang</Text>
      <View style={s.stepper}>
        <Pressable
          onPress={kurangi}
          disabled={jumlah <= 1}
          style={[s.stepButton, jumlah <= 1 && s.stepDisabled]}
        >
          <Ionicons name="remove" size={20} color={colors.white} />
        </Pressable>
        <Text style={s.stepValue}>{jumlah}</Text>
        <Pressable
          onPress={tambah}
          disabled={jumlah >= barang.stok}
          style={[s.stepButton, jumlah >= barang.stok && s.stepDisabled]}
        >
          <Ionicons name="add" size={20} color={colors.white} />
        </Pressable>
        <Text style={s.muted}>maks. {barang.stok} unit</Text>
      </View>

      <View style={s.totalCard}>
        <View style={s.totalRow}>
          <Text style={s.muted}>Durasi</Text>
          <Text style={s.totalValue}>{formValid ? `${durasi} hari` : "-"}</Text>
        </View>
        <View style={s.totalRow}>
          <Text style={s.muted}>Perkiraan total</Text>
          <Text style={s.totalPrice}>{formValid ? formatRupiah(total) : "-"}</Text>
        </View>
      </View>

      <Pressable
        onPress={handleLanjut}
        style={({ pressed }) => [s.button, { opacity: pressed ? 0.8 : 1 }]}
      >
        <Ionicons name="receipt-outline" size={20} color="#FFFFFF" />
        <Text style={s.buttonText}>Lihat Ringkasan</Text>
      </Pressable>
    </View>
  );
}