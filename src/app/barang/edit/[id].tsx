
import BarangForm from "@/components/barang-form";
import { useRental } from "@/context/RentalContext";
import type { DataBarangBaru } from "@/types/barang";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Alert, View } from "react-native";

export default function EditBarangScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { barang, editBarang, isLoading } = useRental();

  const [loading, setLoading] = useState(false);

  const idBarang = Number(id);
  const dataBarang = barang.find((item) => item.id === idBarang);

  const handleSubmit = async (data: DataBarangBaru) => {
    setLoading(true);

    try {
      const result = await editBarang(idBarang, data);

      if (!result.success) {
        throw new Error(result.message || "Barang gagal diperbarui.");
      }

      Alert.alert("Berhasil", "Barang berhasil diperbarui.", [
        {
          text: "OK",
          onPress: () => router.back(),
        },
      ]);
    } catch (error) {
      Alert.alert(
        "Gagal",
        error instanceof Error
          ? error.message
          : "Barang gagal diperbarui.",
      );
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!dataBarang) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <BarangForm
      initialBarang={dataBarang}
      onSubmit={handleSubmit}
      loading={loading}
    />
  );
}
