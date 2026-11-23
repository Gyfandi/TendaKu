
import BarangForm from "@/components/barang-form";
import { useRental } from "@/context/RentalContext";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  ActivityIndicator,
  Alert,
  Text,
  View,
} from "react-native";

export default function EditBarangScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const {
    barang,
    isLoading,
    ubahBarangAsync,
  } = useRental();

  const idBarang = Number(id);

  const barangDipilih = barang.find(
    (item) => item.id === idBarang,
  );

  const handleSubmit = async (
    data: Parameters<typeof ubahBarangAsync>[1],
  ) => {
    try {
      await ubahBarangAsync(idBarang, data);

      Alert.alert(
        "Berhasil",
        "Data barang berhasil diperbarui.",
        [{ text: "OK", onPress: () => router.back() }],
      );
    } catch (error) {
      Alert.alert(
        "Gagal",
        error instanceof Error
          ? error.message
          : "Data barang gagal diperbarui.",
      );

      throw error;
    }
  };

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" color="#155E75" />
        <Text style={{ marginTop: 12 }}>Memuat data barang...</Text>
      </View>
    );
  }

  if (!Number.isInteger(idBarang) || !barangDipilih) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          padding: 24,
        }}
      >
        <Text style={{ fontSize: 16, fontWeight: "600" }}>
          Barang tidak ditemukan.
        </Text>
        <Text
          onPress={() => router.back()}
          style={{
            color: "#155E75",
            marginTop: 12,
            fontWeight: "600",
          }}
        >
          Kembali
        </Text>
      </View>
    );
  }

  return (
    <BarangForm
      initialBarang={barangDipilih}
      onSubmit={handleSubmit}
    />
  );
}
