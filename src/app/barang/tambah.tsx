import BarangForm from "@/components/barang-form";
import { useRental } from "@/context/RentalContext";
import { useRouter } from "expo-router";
import { Alert } from "react-native";
import type { DataBarangBaru } from "@/types/barang";

export default function TambahBarangScreen() {
  const router = useRouter();
  const { tambahBarang } = useRental();

  const handleSubmit = async (data: DataBarangBaru) => {
    const result = await tambahBarang(data);

    if (!result.success) {
      throw new Error(result.message || "Barang gagal ditambahkan.");
    }

    Alert.alert(
      "Berhasil",
      "Barang berhasil ditambahkan.",
      [{ text: "OK", onPress: () => router.back() }],
    );
  };

  return <BarangForm onSubmit={handleSubmit} />;
}