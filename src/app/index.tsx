import { Ionicons } from "@expo/vector-icons";
import { useMemo, useState } from "react";
import { FlatList, Pressable, SafeAreaView, ScrollView, Text, TextInput, View } from "react-native";
import BarangCard from "@/components/BarangCard";
import { colors, styles } from "@/constants/styles";
import { daftarBarang } from "@/data/barang";
import { Barang } from "@/types/barang";

const kategori = ["Semua", "Tenda", "Carrier", "Camping", "Masak", "Elektronik"];

export default function HomeScreen() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const filteredBarang = useMemo(() => daftarBarang.filter((barang) => {
    const cocokSearch = barang.nama.toLowerCase().includes(search.toLowerCase());
    const cocokKategori = selectedCategory === "Semua" || barang.kategori === selectedCategory;
    return cocokSearch && cocokKategori;
  }), [search, selectedCategory]);
  const handleEdit = (barang: Barang) => console.log("Edit barang:", barang.nama);
  const handleDelete = (barang: Barang) => console.log("Hapus barang:", barang.nama);

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={filteredBarang}
        renderItem={({ item }) => <BarangCard barang={item} onEdit={handleEdit} onDelete={handleDelete} />}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={<>
          <View style={styles.header}>
            <Text style={styles.greeting}>Kelola perlengkapan rental</Text>
            <Text style={styles.title}>Halo, TendaKu 👋</Text>
            <Text style={styles.subtitle}>Temukan dan kelola perlengkapan outdoor dengan mudah.</Text>
          </View>
          <View style={styles.searchContainer}>
            <Ionicons name="search-outline" size={19} color={colors.textSecondary} />
            <TextInput value={search} onChangeText={setSearch} placeholder="Cari perlengkapan..." placeholderTextColor="#9AA39D" style={styles.searchInput} />
          </View>
          <View style={styles.sectionHeader}><Text style={styles.sectionTitle}>Kategori</Text></View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
            {kategori.map((item) => { const active = selectedCategory === item; return (
              <Pressable key={item} onPress={() => setSelectedCategory(item)} style={[styles.categoryItem, active && styles.categoryItemActive]}>
                <Text style={[styles.categoryText, active && styles.categoryTextActive]}>{item}</Text>
              </Pressable>
            ); })}
          </ScrollView>
          <View style={styles.sectionHeader}><Text style={styles.sectionTitle}>Peralatan Outdoor</Text><Text style={styles.sectionLink}>{filteredBarang.length} barang</Text></View>
        </>}
        ListEmptyComponent={<View style={styles.emptyContainer}><Ionicons name="search-outline" size={42} color={colors.textSecondary} /><Text style={styles.emptyText}>Barang tidak ditemukan.</Text></View>}
        ListFooterComponent={<View style={styles.bottomSpace} />}
      />
      <Pressable onPress={() => console.log("Tambah barang")} style={({ pressed }) => ({ position: "absolute", right: 20, bottom: 25, width: 58, height: 58, borderRadius: 29, backgroundColor: colors.primary, alignItems: "center", justifyContent: "center", elevation: 5, opacity: pressed ? 0.75 : 1 })}>
        <Ionicons name="add" size={28} color={colors.white} />
      </Pressable>
    </SafeAreaView>
  );
}
