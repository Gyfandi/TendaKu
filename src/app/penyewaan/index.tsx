import RentalForm, { FormPenyewaan } from "@/components/RentalForm";
import { rentalStyles as s } from "@/constants/rentalStyles";
import { colors } from "@/constants/styles";
import { useRental } from "@/context/RentalContext";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PenyewaanScreen() {
  // Nama parameter "id" disepakati dengan Anggota 1 (barang/[id].tsx)
  const { id } = useLocalSearchParams<{ id: string }>();
  const { barang: daftarBarang } = useRental();
  const barang = daftarBarang.find((item) => item.id === Number(id));

  if (!barang) {
    return (
      <SafeAreaView style={s.container}>
        <Pressable onPress={() => router.back()} style={s.backButton}>
          <Ionicons name="arrow-back" size={22} color={colors.text} />
          <Text style={s.backText}>Kembali</Text>
        </Pressable>
        <View style={s.center}>
          <Ionicons name="alert-circle-outline" size={48} color={colors.danger} />
          <Text style={s.title}>Barang tidak ditemukan</Text>
          <Text style={s.muted}>Pilih barang dari daftar terlebih dahulu.</Text>
        </View>
      </SafeAreaView>
    );
  }

  const handleSubmit = (data: FormPenyewaan) => {
    router.push({
      pathname: "/penyewaan/ringkasan",
      params: {
        id: String(barang.id),
        penyewa: data.penyewa,
        tanggalPinjam: data.tanggalPinjam,
        tanggalKembali: data.tanggalKembali,
        jumlah: String(data.jumlah),
      },
    });
  };

  return (
    <SafeAreaView style={s.container}>
      <ScrollView
        contentContainerStyle={s.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Pressable onPress={() => router.back()} style={s.backButtonInline}>
          <Ionicons name="arrow-back" size={22} color={colors.text} />
          <Text style={s.backText}>Kembali ke detail</Text>
        </Pressable>

        <Text style={s.title}>Form Penyewaan</Text>

        <RentalForm barang={barang} onSubmit={handleSubmit} />
      </ScrollView>
    </SafeAreaView>
  );
}