import { Ionicons } from "@expo/vector-icons";
import { useMemo, useState } from "react";
import { useRouter } from "expo-router";
import { useAuth } from "@/context/AuthContext";
import { useRental } from "@/context/RentalContext";
import {
  FlatList,
  Image,
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  View,
  StyleSheet,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncState from "@/components/AsyncState";
import BarangCard from "@/components/BarangCard";
import WeatherCard from "@/components/WeatherCard";
import { colors } from "@/constants/styles";
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
  const { isAdmin, user } = useAuth();
  // Data barang kini dimuat secara async lewat RentalContext.
  const { barang: daftarBarang, isLoading, error, muatUlang } = useRental();
  const { width } = useWindowDimensions();
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");

  // Breakpoint: mobile < 600, tablet 600-1023, desktop >= 1024.
  const isMobile = width < 600;
  const isTablet = width >= 600 && width < 1024;
  const columns = width >= 1200 ? 4 : width >= 768 ? 3 : 2;
  const horizontalPadding = isMobile ? 20 : isTablet ? 28 : 36;
  const cardWidth = columns === 4 ? "23.5%" : columns === 3 ? "31.5%" : "48.5%";
  const cardImageHeight = isMobile ? 128 : isTablet ? 158 : 184;

  const filteredBarang = useMemo(
    () =>
      daftarBarang.filter((barang) => {
        const cocokSearch = barang.nama.toLowerCase().includes(search.toLowerCase());
        const cocokKategori =
          selectedCategory === "Semua" ||
          barang.kategori.toLowerCase() === selectedCategory.toLowerCase();
        return cocokSearch && cocokKategori;
      }),
    [daftarBarang, search, selectedCategory],
  );

  const handleEdit = (barang: Barang) => console.log("Edit barang:", barang.nama);
  const handleDelete = (barang: Barang) => console.log("Hapus barang:", barang.nama);

  return (
    <SafeAreaView style={s.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primaryDark} />
      <FlatList
        key={`barang-grid-${columns}`}
        data={filteredBarang}
        numColumns={columns}
        columnWrapperStyle={s.gridRow}
        renderItem={({ item }) => (
          <BarangCard
            barang={item}
            onEdit={handleEdit}
            onDelete={handleDelete}
            cardWidth={cardWidth}
            imageHeight={cardImageHeight}
            compact={isMobile}
          />
        )}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={s.listContent}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View>
            <View style={[s.topBar, { paddingHorizontal: horizontalPadding }]}>
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
                {isAdmin && (
                  <>
                    <Pressable
                      accessibilityLabel="Buka dashboard admin"
                      onPress={() => router.push("/dashboard")}
                      style={s.topAction}
                    >
                      <Ionicons name="stats-chart-outline" size={21} color={colors.white} />
                    </Pressable>
                    <Pressable
                      accessibilityLabel="Buka data penyewa"
                      onPress={() => router.push("/penyewa")}
                      style={s.topAction}
                    >
                      <Ionicons name="people-outline" size={22} color={colors.white} />
                    </Pressable>
                  </>
                )}
                <Pressable
                  accessibilityLabel={user ? "Buka profil" : "Login atau daftar"}
                  onPress={() => router.push(user ? "/profile" : "/login")}
                  style={s.topAction}
                >
                  <Ionicons name="person-circle-outline" size={23} color={colors.white} />
                </Pressable>
              </View>
            </View>

            <View style={[s.pageContent, { paddingHorizontal: horizontalPadding }]}>
              <View style={s.intro}>
                <Text style={s.eyebrow}>PETUALANGAN DIMULAI DI SINI</Text>
                <Text style={[s.greeting, { fontSize: isMobile ? 25 : isTablet ? 29 : 34 }]}>
                  Halo, Petualang! 🌿
                </Text>
                <Text style={s.introCopy}>Siapkan perlengkapanmu, jelajahi alam lebih jauh.</Text>
              </View>

              <View
                style={[
                  s.hero,
                  {
                    height: isMobile ? 218 : isTablet ? 260 : 300,
                    borderRadius: isMobile ? 23 : 28,
                  },
                ]}
              >
                <Image
                  source={require("@/assets/barang/tenda-dome-4-person.jpeg")}
                  style={s.heroImage}
                  resizeMode="cover"
                />
                <View style={s.heroShade} />
                <View style={[s.heroContent, { paddingHorizontal: isMobile ? 19 : 32 }]}>
                  <View style={s.heroPill}>
                    <Ionicons name="leaf" size={12} color="#D9F99D" />
                    <Text style={s.heroPillText}>GEAR UP & GO</Text>
                  </View>
                  <Text style={[s.heroTitle, { fontSize: isMobile ? 24 : isTablet ? 30 : 36, lineHeight: isMobile ? 29 : isTablet ? 36 : 43 }]}>
                    Alam memanggil.{`\n`}Kamu siap berangkat?
                  </Text>
                  <Text style={[s.heroSubtitle, { fontSize: isMobile ? 11 : 14, lineHeight: isMobile ? 16 : 21 }]}>
                    Perlengkapan outdoor untuk setiap perjalanan.
                  </Text>
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
              </View>

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

              {/* Cuaca lokasi camping (data dari External API, dimuat async) */}
              <WeatherCard />

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
          </View>
        }
        ListEmptyComponent={
          isLoading || error ? (
            <AsyncState
              loading={isLoading}
              error={error}
              onRetry={muatUlang}
              loadingText="Memuat perlengkapan..."
            />
          ) : (
            <View style={s.emptyContainer}>
              <View style={s.emptyIcon}>
                <Ionicons name="search-outline" size={32} color={colors.primary} />
              </View>
              <Text style={s.emptyTitle}>Perlengkapan belum ditemukan</Text>
              <Text style={s.emptyText}>Coba kata kunci atau kategori yang berbeda.</Text>
            </View>
          )
        }
        ListFooterComponent={<View style={{ height: 34 }} />}
      />
      {isAdmin && (
        <Pressable
          onPress={() => console.log("Tambah barang")}
          accessibilityLabel="Tambah barang"
          style={({ pressed }) => [s.fab, pressed && { opacity: 0.8, transform: [{ scale: 0.97 }] }]}
        >
          <Ionicons name="add" size={29} color={colors.white} />
        </Pressable>
      )}
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  listContent: { paddingBottom: 20 },
  gridRow: {
    width: "100%",
    paddingHorizontal: 20,
    justifyContent: "space-between",
    alignSelf: "center",
    maxWidth: 1440,
  },
  topBar: {
    minHeight: 76,
    paddingTop: 10,
    paddingBottom: 12,
    backgroundColor: colors.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  brandLockup: { flexDirection: "row", alignItems: "center", gap: 10 },
  brandIcon: {
    width: 46, height: 46, borderRadius: 15, backgroundColor: colors.white,
    alignItems: "center", justifyContent: "center",
  },
  brandName: { color: colors.white, fontSize: 22, fontWeight: "900", letterSpacing: 0.2 },
  brandTagline: { color: "#D7E9DC", fontSize: 9, fontWeight: "800", letterSpacing: 1.6, marginTop: 1 },
  topActions: { flexDirection: "row", gap: 10 },
  topAction: {
    width: 42, height: 42, borderRadius: 14, backgroundColor: "rgba(255,255,255,0.13)",
    alignItems: "center", justifyContent: "center",
  },
  pageContent: { width: "100%", maxWidth: 1440, alignSelf: "center" },
  intro: { paddingTop: 24, paddingBottom: 17 },
  eyebrow: { color: colors.success, fontSize: 10, fontWeight: "900", letterSpacing: 1.7, marginBottom: 7 },
  greeting: { color: colors.text, fontWeight: "900", letterSpacing: -0.5 },
  introCopy: { color: colors.textSecondary, fontSize: 13, lineHeight: 19, marginTop: 5 },
  hero: {
    marginBottom: 0, borderRadius: 28, overflow: "hidden",
    justifyContent: "center", backgroundColor: colors.primaryDark,
  },
  heroImage: { ...StyleSheet.absoluteFill },
  heroShade: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(12, 48, 30, 0.70)",
  },
  heroContent: { paddingVertical: 20, alignItems: "flex-start" },
  heroPill: {
    flexDirection: "row", alignItems: "center", gap: 5, paddingHorizontal: 9,
    paddingVertical: 5, borderRadius: 20, backgroundColor: "rgba(255,255,255,0.16)",
  },
  heroPillText: { color: "#F0FDF4", fontSize: 9, fontWeight: "900", letterSpacing: 1.1 },
  heroTitle: { color: colors.white, fontWeight: "900", marginTop: 12, maxWidth: 620 },
  heroSubtitle: { color: "#E0EDE3", marginTop: 6, maxWidth: 420 },
  heroButton: {
    marginTop: 15, backgroundColor: "#F2F7E9", borderRadius: 13, paddingHorizontal: 15,
    paddingVertical: 11, flexDirection: "row", alignItems: "center", gap: 9,
  },
  heroButtonText: { color: colors.primaryDark, fontSize: 12, fontWeight: "800" },
  sectionHeading: { marginTop: 27, marginBottom: 12 },
  sectionTitle: { fontSize: 19, fontWeight: "900", color: colors.text, letterSpacing: -0.3 },
  sectionSubtitle: { fontSize: 12, color: colors.textSecondary, marginTop: 4, lineHeight: 17 },
  searchBox: {
    height: 52, borderRadius: 16, backgroundColor: colors.white,
    borderWidth: 1, borderColor: colors.border, flexDirection: "row", alignItems: "center",
    paddingHorizontal: 15, gap: 10,
  },
  searchInput: { flex: 1, fontSize: 14, color: colors.text, paddingVertical: 0 },
  categoryRow: { paddingTop: 16, paddingBottom: 3, gap: 10 },
  categoryItem: {
    minWidth: 76, alignItems: "center", justifyContent: "center", paddingVertical: 10,
    paddingHorizontal: 12, borderRadius: 17, backgroundColor: colors.white,
    borderWidth: 1, borderColor: colors.border,
  },
  categoryItemActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  categoryIcon: {
    width: 40, height: 40, borderRadius: 13, backgroundColor: colors.primaryLight,
    alignItems: "center", justifyContent: "center", marginBottom: 7,
  },
  categoryIconActive: { backgroundColor: "rgba(255,255,255,0.18)" },
  categoryText: { fontSize: 11, color: colors.textSecondary, fontWeight: "700" },
  categoryTextActive: { color: colors.white },
  featureStrip: {
    marginTop: 19, padding: 14, borderRadius: 18,
    backgroundColor: "#EAF3E8", flexDirection: "row", alignItems: "center", gap: 12,
  },
  featureIcon: { width: 44, height: 44, borderRadius: 14, backgroundColor: colors.white, alignItems: "center", justifyContent: "center" },
  featureCopy: { flex: 1 },
  featureTitle: { color: colors.text, fontWeight: "800", fontSize: 13 },
  featureSubtitle: { color: colors.textSecondary, fontSize: 11, lineHeight: 15, marginTop: 3 },
  itemsHeading: {
    marginTop: 27, marginBottom: 15,
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
  },
  countBadge: { paddingHorizontal: 11, paddingVertical: 7, borderRadius: 20, backgroundColor: colors.primaryLight },
  countText: { color: colors.primary, fontWeight: "800", fontSize: 11 },
  emptyContainer: { alignItems: "center", justifyContent: "center", paddingHorizontal: 28, paddingVertical: 38 },
  emptyIcon: { width: 62, height: 62, borderRadius: 22, backgroundColor: colors.primaryLight, alignItems: "center", justifyContent: "center" },
  emptyTitle: { marginTop: 14, color: colors.text, fontWeight: "800", fontSize: 15 },
  emptyText: { color: colors.textSecondary, fontSize: 12, textAlign: "center", marginTop: 6, lineHeight: 18 },
  fab: {
    position: "absolute", right: 24, bottom: 24, width: 58, height: 58, borderRadius: 22,
    backgroundColor: colors.primary, alignItems: "center", justifyContent: "center", elevation: 6,
    shadowColor: "#0B2F1D", shadowOpacity: 0.22, shadowRadius: 10, shadowOffset: { width: 0, height: 5 },
  },
});