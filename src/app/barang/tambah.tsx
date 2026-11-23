
import BarangForm from "@/components/barang-form";
import { useRental } from "@/context/RentalContext";
import { useRouter } from "expo-router";
import { Alert } from "react-native";

export default function TambahBarangScreen() {
  const router = useRouter();
  const { tambahBarangAsync } = useRental();

  const handleSubmit = async (
    data: Parameters<typeof tambahBarangAsync>[0],
  ) => {
    try {
      await tambahBarangAsync(data);

      Alert.alert(
        "Berhasil",
        "Barang berhasil ditambahkan.",
        [{ text: "OK", onPress: () => router.back() }],
      );
    } catch (error) {
      Alert.alert(
        "Gagal",
        error instanceof Error
          ? error.message
          : "Barang gagal ditambahkan.",
      );

      throw error;
    }
  };

  return <BarangForm onSubmit={handleSubmit} />;
}
