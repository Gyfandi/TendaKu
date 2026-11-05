import { Ionicons } from "@expo/vector-icons";
import { Image, Pressable, Text, View, StyleSheet } from "react-native";
import { Barang } from "@/types/barang";
import { colors } from "@/constants/styles";
import { useAuth } from "@/context/AuthContext";
import { router } from "expo-router";

interface BarangCardProps {
  barang: Barang;
  onEdit?: (barang: Barang) => void;
  onDelete?: (barang: Barang) => void;
  cardWidth?: number | `${number}%`;
  imageHeight?: number;
  compact?: boolean;
}

const formatRupiah = (harga: number): string => `Rp${harga.toLocaleString("id-ID")}`;

export default function BarangCard({
  barang,
  onEdit,
  onDelete,
  cardWidth = "100%",
  imageHeight = 180,
  compact = false,
}: BarangCardProps) {
  const { isAdmin } = useAuth();
  const tersedia = barang.stok > 0;

  return (
    <View style={[cardStyles.card, { width: cardWidth }]}>
      <Pressable
        onPress={() =>
          router.push({
            pathname: "/barang/[id]",
            params: {
              id: String(barang.id),
            },
          })
        }
        accessibilityRole="button"
        accessibilityLabel={`Lihat detail ${barang.nama}`}
      >
        <Image
          source={barang.image}
          style={[cardStyles.image, { height: imageHeight }]}
          resizeMode="cover"
        />
      </Pressable>
      <View style={[cardStyles.content, compact && cardStyles.contentCompact]}>
        <View style={cardStyles.categoryRow}>
          <Text style={[cardStyles.category, compact && cardStyles.categoryCompact]} numberOfLines={1}>
            {barang.kategori}
          </Text>
          <View style={[cardStyles.statusBadge, compact && cardStyles.statusBadgeCompact, { backgroundColor: tersedia ? "#E7F5EC" : "#FDECEC" }]}>
            <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: tersedia ? colors.success : colors.danger, marginRight: 5 }} />
            <Text style={{ fontSize: compact ? 9 : 11, fontWeight: "700", color: tersedia ? colors.success : colors.danger }}>
              {tersedia ? "Tersedia" : "Habis"}
            </Text>
          </View>
        </View>
        <Text style={[cardStyles.name, compact && cardStyles.nameCompact]} numberOfLines={2}>
          {barang.nama}
        </Text>
        <View style={cardStyles.priceRow}>
          <Text style={[cardStyles.price, compact && cardStyles.priceCompact]} numberOfLines={1}>
            {formatRupiah(barang.hargaPerHari)}
          </Text>
          <Text style={[cardStyles.perDay, compact && cardStyles.perDayCompact]}> / hari</Text>
        </View>
        <View style={[cardStyles.footer, compact && cardStyles.footerCompact]}>
          <View style={cardStyles.stockContainer}>
            <Ionicons name="cube-outline" size={15} color={colors.textSecondary} />
            <Text style={[cardStyles.stock, compact && cardStyles.stockCompact]}>Stok {barang.stok}</Text>
          </View>
          {isAdmin && (
            <View style={cardStyles.actions}>
              <Pressable onPress={() => onEdit?.(barang)} accessibilityLabel={`Edit ${barang.nama}`} style={({ pressed }) => [cardStyles.actionButton, { opacity: pressed ? 0.6 : 1 }]}>
                <Ionicons name="create-outline" size={17} color={colors.primary} />
              </Pressable>
              <Pressable onPress={() => onDelete?.(barang)} accessibilityLabel={`Hapus ${barang.nama}`} style={({ pressed }) => [cardStyles.actionButton, { opacity: pressed ? 0.6 : 1 }]}>
                <Ionicons name="trash-outline" size={17} color={colors.danger} />
              </Pressable>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}

const cardStyles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: 18,
    marginBottom: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.border,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
  },
  image: { width: "100%" },
  content: { padding: 15 },
  contentCompact: { padding: 10 },
  categoryRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 5 },
  category: { fontSize: 12, fontWeight: "700", color: colors.primary, textTransform: "uppercase", letterSpacing: 0.5, flexShrink: 1 },
  categoryCompact: { fontSize: 9, letterSpacing: 0.2 },
  statusBadge: { flexDirection: "row", alignItems: "center", paddingHorizontal: 9, paddingVertical: 5, borderRadius: 12, flexShrink: 0 },
  statusBadgeCompact: { paddingHorizontal: 6, paddingVertical: 4 },
  name: { marginTop: 8, fontSize: 18, fontWeight: "800", color: colors.text },
  nameCompact: { fontSize: 14, lineHeight: 19, minHeight: 38 },
  priceRow: { flexDirection: "row", alignItems: "baseline", marginTop: 6, flexWrap: "wrap" },
  price: { fontSize: 16, fontWeight: "800", color: colors.primary },
  priceCompact: { fontSize: 13 },
  perDay: { fontSize: 12, color: colors.textSecondary },
  perDayCompact: { fontSize: 10 },
  footer: { marginTop: 14, paddingTop: 12, borderTopWidth: 1, borderTopColor: colors.border, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  footerCompact: { marginTop: 10, paddingTop: 9 },
  stockContainer: { flexDirection: "row", alignItems: "center", gap: 6 },
  stock: { fontSize: 12, color: colors.textSecondary },
  stockCompact: { fontSize: 10 },
  actions: { flexDirection: "row", gap: 8 },
  actionButton: { width: 34, height: 34, borderRadius: 10, alignItems: "center", justifyContent: "center", backgroundColor: colors.primaryLight },
});
