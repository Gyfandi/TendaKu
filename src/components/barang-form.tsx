
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import type { Barang, DataBarangBaru } from "@/types/barang";

interface BarangFormProps {
  initialBarang?: Barang;
  loading?: boolean;
  onSubmit: (data: DataBarangBaru) => Promise<void>;
}

export default function BarangForm({
  initialBarang,
  loading = false,
  onSubmit,
}: BarangFormProps) {
  const gambarAwal =
    typeof initialBarang?.image === "object" &&
    initialBarang.image !== null &&
    "uri" in initialBarang.image
      ? initialBarang.image.uri ?? ""
      : "";

  const [nama, setNama] = useState(initialBarang?.nama ?? "");
  const [kategori, setKategori] = useState(initialBarang?.kategori ?? "");
  const [harga, setHarga] = useState(
    initialBarang?.hargaPerHari.toString() ?? "",
  );
  const [stok, setStok] = useState(
    initialBarang?.stok.toString() ?? "",
  );
  const [imageUrl, setImageUrl] = useState(gambarAwal);

  const handleSubmit = async () => {
    const namaBersih = nama.trim();
    const kategoriBersih = kategori.trim();
    const hargaAngka = Number(harga);
    const stokAngka = Number(stok);

    if (!namaBersih || !kategoriBersih) {
      Alert.alert("Validasi", "Nama dan kategori wajib diisi.");
      return;
    }

    if (
      harga.trim() === "" ||
      !Number.isInteger(hargaAngka) ||
      hargaAngka < 0
    ) {
      Alert.alert("Validasi", "Harga harus berupa bilangan bulat nonnegatif.");
      return;
    }

    if (
      stok.trim() === "" ||
      !Number.isInteger(stokAngka) ||
      stokAngka < 0
    ) {
      Alert.alert("Validasi", "Stok harus berupa bilangan bulat nonnegatif.");
      return;
    }

    const urlBersih = imageUrl.trim();

    if (urlBersih && !/^https?:\/\/.+/i.test(urlBersih)) {
      Alert.alert(
        "Validasi",
        "URL gambar harus diawali http:// atau https://.",
      );
      return;
    }

    try {
      await onSubmit({
        nama: namaBersih,
        kategori: kategoriBersih,
        hargaPerHari: hargaAngka,
        stok: stokAngka,
        imageUrl: urlBersih || null,
      });
    } catch {
      // Error ditangani oleh halaman pemanggil.
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={styles.title}>
            {initialBarang ? "Edit Barang" : "Tambah Barang"}
          </Text>
          <Text style={styles.subtitle}>
            Lengkapi informasi barang rental TendaKu.
          </Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>Nama Barang *</Text>
          <TextInput
            style={styles.input}
            placeholder="Contoh: Tenda Dome 4 Person"
            value={nama}
            onChangeText={setNama}
            editable={!loading}
          />

          <Text style={styles.label}>Kategori *</Text>
          <TextInput
            style={styles.input}
            placeholder="Contoh: Tenda, Carrier, Camping"
            value={kategori}
            onChangeText={setKategori}
            editable={!loading}
          />

          <Text style={styles.label}>Harga per Hari (Rp) *</Text>
          <TextInput
            style={styles.input}
            placeholder="Contoh: 75000"
            value={harga}
            onChangeText={setHarga}
            keyboardType="number-pad"
            editable={!loading}
          />

          <Text style={styles.label}>Stok Barang *</Text>
          <TextInput
            style={styles.input}
            placeholder="Contoh: 5"
            value={stok}
            onChangeText={setStok}
            keyboardType="number-pad"
            editable={!loading}
          />

          <Text style={styles.label}>URL Gambar (Opsional)</Text>
          <TextInput
            style={styles.input}
            placeholder="https://contoh.com/gambar.jpg"
            value={imageUrl}
            onChangeText={setImageUrl}
            autoCapitalize="none"
            keyboardType="url"
            editable={!loading}
          />

          <Text style={styles.helper}>
            Kosongkan URL gambar untuk menggunakan gambar lokal jika tersedia.
          </Text>

          <Pressable
            style={[
              styles.submitButton,
              loading && styles.disabledButton,
            ]}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.submitText}>
                {initialBarang ? "Simpan Perubahan" : "Tambah Barang"}
              </Text>
            )}
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1E293B",
  },
  subtitle: {
    fontSize: 14,
    color: "#64748B",
    marginTop: 6,
  },
  form: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#334155",
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: "#1E293B",
    backgroundColor: "#FFFFFF",
  },
  helper: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 8,
    lineHeight: 18,
  },
  submitButton: {
    backgroundColor: "#155E75",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 28,
  },
  disabledButton: {
    opacity: 0.6,
  },
  submitText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 15,
  },
});
