import { Ionicons } from "@expo/vector-icons";
import { Image, Pressable, Text, View, StyleSheet } from "react-native";
import { Barang } from "@/types/barang";
import { colors } from "@/constants/styles";

interface BarangCardProps { barang: Barang; onEdit?: (barang: Barang) => void; onDelete?: (barang: Barang) => void; }
const formatRupiah = (harga: number): string => `Rp${harga.toLocaleString("id-ID")}`;

export default function BarangCard({ barang, onEdit, onDelete }: BarangCardProps) {
  const tersedia = barang.stok > 0;
  return (
    <View style={cardStyles.card}>
      <Image source={barang.image} style={cardStyles.image} resizeMode="cover" />
      <View style={cardStyles.content}>
        <View style={cardStyles.categoryRow}>
          <Text style={cardStyles.category}>{barang.kategori}</Text>
          <View style={[cardStyles.statusBadge, { backgroundColor: tersedia ? "#E7F5EC" : "#FDECEC" }]}>
            <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: tersedia ? colors.success : colors.danger, marginRight: 5 }} />
            <Text style={{ fontSize: 11, fontWeight: "700", color: tersedia ? colors.success : colors.danger }}>{tersedia ? "Tersedia" : "Habis"}</Text>
          </View>
        </View>
        <Text style={cardStyles.name} numberOfLines={1}>{barang.nama}</Text>
        <View style={cardStyles.priceRow}><Text style={cardStyles.price}>{formatRupiah(barang.hargaPerHari)}</Text><Text style={cardStyles.perDay}> / hari</Text></View>
        <View style={cardStyles.footer}>
          <View style={cardStyles.stockContainer}><Ionicons name="cube-outline" size={15} color={colors.textSecondary} /><Text style={cardStyles.stock}>Stok {barang.stok}</Text></View>
          <View style={cardStyles.actions}>
            <Pressable onPress={() => onEdit?.(barang)} style={({ pressed }) => [cardStyles.actionButton, { opacity: pressed ? 0.6 : 1 }]}><Ionicons name="create-outline" size={17} color={colors.primary} /></Pressable>
            <Pressable onPress={() => onDelete?.(barang)} style={({ pressed }) => [cardStyles.actionButton, { opacity: pressed ? 0.6 : 1 }]}><Ionicons name="trash-outline" size={17} color={colors.danger} /></Pressable>
          </View>
        </View>
      </View>
    </View>
  );
}

const cardStyles = StyleSheet.create({
  card: { backgroundColor: colors.white, borderRadius: 18, marginBottom: 16, overflow: "hidden", borderWidth: 1, borderColor: colors.border, elevation: 2, shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 8, shadowOffset: { width: 0, height: 3 } },
  image: { width: "100%", height: 180 }, content: { padding: 15 },
  categoryRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  category: { fontSize: 12, fontWeight: "700", color: colors.primary, textTransform: "uppercase", letterSpacing: 0.5 },
  statusBadge: { flexDirection: "row", alignItems: "center", paddingHorizontal: 9, paddingVertical: 5, borderRadius: 12 },
  name: { marginTop: 8, fontSize: 18, fontWeight: "800", color: colors.text },
  priceRow: { flexDirection: "row", alignItems: "baseline", marginTop: 6 },
  price: { fontSize: 16, fontWeight: "800", color: colors.primary }, perDay: { fontSize: 12, color: colors.textSecondary },
  footer: { marginTop: 14, paddingTop: 12, borderTopWidth: 1, borderTopColor: colors.border, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  stockContainer: { flexDirection: "row", alignItems: "center", gap: 6 }, stock: { fontSize: 12, color: colors.textSecondary },
  actions: { flexDirection: "row", gap: 8 }, actionButton: { width: 34, height: 34, borderRadius: 10, alignItems: "center", justifyContent: "center", backgroundColor: colors.primaryLight },
});
