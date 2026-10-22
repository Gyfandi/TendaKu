import { Ionicons } from "@expo/vector-icons";
import { useMemo, useState } from "react";
import { useRouter } from "expo-router";
import {
  FlatList,
  Image,
  ImageBackground,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  View,
  StyleSheet,
} from "react-native";
import BarangCard from "@/components/BarangCard";
import { colors } from "@/constants/styles";
import { daftarBarang } from "@/data/barang";
import { Barang } from "@/types/barang";

const kategori = [
  { label: "Semua", icon: "apps-outline" as const },
  { label: "Tenda", icon: "home-outline" as const },
  { label: "Carrier", icon: "bag-handle-outline" as const },
  { label: "Camping", icon: "bonfire-outline" as const },
  { label: "Masak", icon: "restaurant-outline" as const },
  { label: "Elektronik", icon: "flashlight-outline" as const },
];

export default function HomeScreen() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");

  const filteredBarang = useMemo(
    () =>
      daftarBarang.filter((barang) => {
        const cocokSearch = barang.nama.toLowerCase().includes(search.toLowerCase());
        const cocokKategori =
          selectedCategory === "Semua" ||
          barang.kategori.toLowerCase() === selectedCategory.toLowerCase();
        return cocokSearch && cocokKategori;
      }),
    [search, selectedCategory, daftarBarang],
  );

  const handleEdit = (barang: Barang) => console.log("Edit barang:", barang.nama);
  const handleDelete = (barang: Barang) => console.log("Hapus barang:", barang.nama);

  return (
    <SafeAreaView style={s.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primaryDark} />
      <FlatList
        data={filteredBarang}
        renderItem={({ item }) => (
          <BarangCard barang={item} onEdit={handleEdit} onDelete={handleDelete} />
        )}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={s.listContent}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View>
            <View style={s.topBar}>
              <View style={s.brandLockup}>
                <View style={s.brandIcon}>
                  <Ionicons name="trail-sign-outline" size={24} color={colors.primary} />
                </View>
                <View>
                  <Text style={s.brandName}>TendaKu</Text>
                  <Text style={s.brandTagline}>OUTDOOR RENTAL</Text>
                </View>
              </View>
              <View style={s.topActions}>
                <Pressable
                  accessibilityLabel="Buka dashboard"
                  onPress={() => router.push("/dashboard")}
                  style={s.topAction}
                >
                  <Ionicons name="stats-chart-outline" size={21} color={colors.white} />
                </Pressable>
                <Pressable
                  accessibilityLabel="Buka penyewa"
                  onPress={() => router.push("/penyewa")}
                  style={s.topAction}
                >
                  <Ionicons name="people-outline" size={22} color={colors.white} />
                </Pressable>
              </View>
            </View>

            <View style={s.intro}>
              <Text style={s.eyebrow}>PETUALANGAN DIMULAI DI SINI</Text>
              <Text style={s.greeting}>Halo, Petualang! 🌿</Text>
              <Text style={s.introCopy}>Siapkan perlengkapanmu, jelajahi alam lebih jauh.</Text>
            </View>

            <ImageBackground
              source={require("@/assets/barang/tenda-dome-4-person.jpeg")}
              imageStyle={s.heroImage}
              style={s.hero}
            >
              <View style={s.heroShade} />
              <View style={s.heroContent}>
                <View style={s.heroPill}>
                  <Ionicons name="leaf" size={12} color="#D9F99D" />
                  <Text style={s.heroPillText}>GEAR UP & GO</Text>
                </View>
                <Text style={s.heroTitle}>Alam memanggil.{`\n`}Kamu siap berangkat?</Text>
                <Text style={s.heroSubtitle}>Perlengkapan outdoor untuk setiap perjalanan.</Text>
                <Pressable
                  onPress={() => {
                    setSelectedCategory("Semua");
                    setSearch("");
                  }}
                  style={({ pressed }) => [s.heroButton, pressed && { opacity: 0.8 }]}
                >
                  <Text style={s.heroButtonText}>Jelajahi perlengkapan</Text>
                  <Ionicons name="arrow-forward" size={16} color={colors.primaryDark} />
                </Pressable>
              </View>
            </ImageBackground>

            <View style={s.sectionHeading}>
              <View>
                <Text style={s.sectionTitle}>Cari perlengkapan</Text>
                <Text style={s.sectionSubtitle}>Pilih gear sesuai petualanganmu</Text>
              </View>
            </View>

            <View style={s.searchBox}>
              <Ionicons name="search-outline" size={20} color={colors.textSecondary} />
              <TextInput
                value={search}
                onChangeText={setSearch}
                placeholder="Cari tenda, carrier, dan lainnya..."
                placeholderTextColor="#8A968E"
                style={s.searchInput}
                returnKeyType="search"
              />
              {search.length > 0 && (
                <Pressable onPress={() => setSearch("")} accessibilityLabel="Hapus pencarian">
                  <Ionicons name="close-circle" size={19} color={colors.textSecondary} />
                </Pressable>
              )}
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={s.categoryRow}
            >
              {kategori.map((item) => {
                const active = selectedCategory === item.label;
                return (
                  <Pressable
                    key={item.label}
                    onPress={() => setSelectedCategory(item.label)}
                    style={({ pressed }) => [
                      s.categoryItem,
                      active && s.categoryItemActive,
                      pressed && { opacity: 0.78 },
                    ]}
                  >
                    <View style={[s.categoryIcon, active && s.categoryIconActive]}>
                      <Ionicons
                        name={item.icon}
                        size={21}
                        color={active ? colors.white : colors.primary}
                      />
                    </View>
                    <Text style={[s.categoryText, active && s.categoryTextActive]}>
                      {item.label}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>

            <View style={s.featureStrip}>
              <View style={s.featureIcon}>
                <Ionicons name="shield-checkmark-outline" size={22} color={colors.primary} />
              </View>
              <View style={s.featureCopy}>
                <Text style={s.featureTitle}>Petualangan lebih siap</Text>
                <Text style={s.featureSubtitle}>Cek stok dan pilih perlengkapan sebelum berangkat.</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.primary} />
            </View>

            <View style={s.itemsHeading}>
              <View>
                <Text style={s.sectionTitle}>
                  {selectedCategory === "Semua" ? "Perlengkapan pilihan" : selectedCategory}
                </Text>
                <Text style={s.sectionSubtitle}>Temukan gear untuk perjalananmu</Text>
              </View>
              <View style={s.countBadge}>
                <Text style={s.countText}>{filteredBarang.length} item</Text>
              </View>
            </View>
          </View>
        }
        ListEmptyComponent={
          <View style={s.emptyContainer}>
            <View style={s.emptyIcon}>
              <Ionicons name="search-outline" size={32} color={colors.primary} />
            </View>
            <Text style={s.emptyTitle}>Perlengkapan belum ditemukan</Text>
            <Text style={s.emptyText}>Coba kata kunci atau kategori yang berbeda.</Text>
          </View>
        }
        ListFooterComponent={<View style={{ height: 34 }} />}
      />
      <Pressable
        onPress={() => console.log("Tambah barang")}
        accessibilityLabel="Tambah barang"
        style={({ pressed }) => [s.fab, pressed && { opacity: 0.8, transform: [{ scale: 0.97 }] }]}
      >
        <Ionicons name="add" size={29} color={colors.white} />
      </Pressable>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  listContent: { paddingBottom: 20 },
  topBar: {
    minHeight: 76,
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 12,
    backgroundColor: colors.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  brandLockup: { flexDirection: "row", alignItems: "center", gap: 10 },
  brandIcon: {
    width: 42, height: 42, borderRadius: 14, backgroundColor: colors.white,
    alignItems: "center", justifyContent: "center",
  },
  brandName: { color: colors.white, fontSize: 21, fontWeight: "900", letterSpacing: 0.2 },
  brandTagline: { color: "#D7E9DC", fontSize: 9, fontWeight: "800", letterSpacing: 1.6, marginTop: 1 },
  topActions: { flexDirection: "row", gap: 10 },
  topAction: {
    width: 40, height: 40, borderRadius: 14, backgroundColor: "rgba(255,255,255,0.13)",
    alignItems: "center", justifyContent: "center",
  },
  intro: { paddingHorizontal: 20, paddingTop: 24, paddingBottom: 17 },
  eyebrow: { color: colors.success, fontSize: 10, fontWeight: "900", letterSpacing: 1.7, marginBottom: 7 },
  greeting: { color: colors.text, fontSize: 25, fontWeight: "900", letterSpacing: -0.5 },
  introCopy: { color: colors.textSecondary, fontSize: 13, lineHeight: 19, marginTop: 5 },
  hero: {
    marginHorizontal: 18, height: 218, borderRadius: 23, overflow: "hidden",
    justifyContent: "center", backgroundColor: colors.primaryDark,
  },
  heroImage: { borderRadius: 23 },
  heroShade: {
  ...StyleSheet.absoluteFill,
  backgroundColor: "rgba(12, 48, 30, 0.76)",
  },
  heroContent: { paddingHorizontal: 19, paddingVertical: 17, alignItems: "flex-start" },
  heroPill: {
    flexDirection: "row", alignItems: "center", gap: 5, paddingHorizontal: 9,
    paddingVertical: 5, borderRadius: 20, backgroundColor: "rgba(255,255,255,0.16)",
  },
  heroPillText: { color: "#F0FDF4", fontSize: 9, fontWeight: "900", letterSpacing: 1.1 },
  heroTitle: { color: colors.white, fontSize: 24, lineHeight: 29, fontWeight: "900", marginTop: 12 },
  heroSubtitle: { color: "#E0EDE3", fontSize: 11, lineHeight: 16, marginTop: 6, maxWidth: 250 },
  heroButton: {
    marginTop: 13, backgroundColor: "#F2F7E9", borderRadius: 12, paddingHorizontal: 12,
    paddingVertical: 9, flexDirection: "row", alignItems: "center", gap: 9,
  },
  heroButtonText: { color: colors.primaryDark, fontSize: 11, fontWeight: "800" },
  sectionHeading: { paddingHorizontal: 20, marginTop: 25, marginBottom: 12 },
  sectionTitle: { fontSize: 18, fontWeight: "900", color: colors.text, letterSpacing: -0.3 },
  sectionSubtitle: { fontSize: 11, color: colors.textSecondary, marginTop: 4, lineHeight: 16 },
  searchBox: {
    height: 50, marginHorizontal: 18, borderRadius: 15, backgroundColor: colors.white,
    borderWidth: 1, borderColor: colors.border, flexDirection: "row", alignItems: "center",
    paddingHorizontal: 14, gap: 10,
  },
  searchInput: { flex: 1, fontSize: 13, color: colors.text, paddingVertical: 0 },
  categoryRow: { paddingHorizontal: 18, paddingTop: 16, paddingBottom: 3, gap: 10 },
  categoryItem: {
    minWidth: 72, alignItems: "center", justifyContent: "center", paddingVertical: 10,
    paddingHorizontal: 11, borderRadius: 17, backgroundColor: colors.white,
    borderWidth: 1, borderColor: colors.border,
  },
  categoryItemActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  categoryIcon: {
    width: 39, height: 39, borderRadius: 13, backgroundColor: colors.primaryLight,
    alignItems: "center", justifyContent: "center", marginBottom: 7,
  },
  categoryIconActive: { backgroundColor: "rgba(255,255,255,0.18)" },
  categoryText: { fontSize: 11, color: colors.textSecondary, fontWeight: "700" },
  categoryTextActive: { color: colors.white },
  featureStrip: {
    marginHorizontal: 18, marginTop: 18, padding: 13, borderRadius: 17,
    backgroundColor: "#EAF3E8", flexDirection: "row", alignItems: "center", gap: 11,
  },
  featureIcon: { width: 42, height: 42, borderRadius: 14, backgroundColor: colors.white, alignItems: "center", justifyContent: "center" },
  featureCopy: { flex: 1 },
  featureTitle: { color: colors.text, fontWeight: "800", fontSize: 12 },
  featureSubtitle: { color: colors.textSecondary, fontSize: 10, lineHeight: 14, marginTop: 3 },
  itemsHeading: {
    paddingHorizontal: 20, marginTop: 25, marginBottom: 14,
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
  },
  countBadge: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 20, backgroundColor: colors.primaryLight },
  countText: { color: colors.primary, fontWeight: "800", fontSize: 11 },
  emptyContainer: { alignItems: "center", justifyContent: "center", paddingHorizontal: 28, paddingVertical: 38 },
  emptyIcon: { width: 62, height: 62, borderRadius: 22, backgroundColor: colors.primaryLight, alignItems: "center", justifyContent: "center" },
  emptyTitle: { marginTop: 14, color: colors.text, fontWeight: "800", fontSize: 15 },
  emptyText: { color: colors.textSecondary, fontSize: 12, textAlign: "center", marginTop: 6, lineHeight: 18 },
  fab: {
    position: "absolute", right: 20, bottom: 24, width: 58, height: 58, borderRadius: 22,
    backgroundColor: colors.primary, alignItems: "center", justifyContent: "center", elevation: 6,
    shadowColor: "#0B2F1D", shadowOpacity: 0.22, shadowRadius: 10, shadowOffset: { width: 0, height: 5 },
  },
});
