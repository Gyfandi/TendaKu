import { StyleSheet } from "react-native";

export const colors = {
  primary: "#216E45", primaryDark: "#164C31", primaryLight: "#E8F4EC",
  background: "#F7F9F6", white: "#FFFFFF", text: "#183126",
  textSecondary: "#6B766F", border: "#E2E8E4", success: "#23844B",
  danger: "#C93C3C", accent: "#F2B84B",
};

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: 20, paddingBottom: 100 },
  header: { paddingTop: 58, paddingBottom: 18 },
  greeting: { fontSize: 14, color: colors.textSecondary, marginBottom: 4 },
  title: { fontSize: 28, fontWeight: "800", color: colors.text },
  subtitle: { marginTop: 6, fontSize: 14, color: colors.textSecondary, lineHeight: 20 },
  searchContainer: { height: 50, backgroundColor: colors.white, borderRadius: 14, borderWidth: 1, borderColor: colors.border, flexDirection: "row", alignItems: "center", paddingHorizontal: 15, marginBottom: 20 },
  searchInput: { flex: 1, fontSize: 14, color: colors.text, marginLeft: 10 },
  sectionHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 14 },
  sectionTitle: { fontSize: 20, fontWeight: "800", color: colors.text },
  sectionLink: { fontSize: 13, fontWeight: "700", color: colors.primary },
  categoryScroll: { marginBottom: 20 },
  categoryItem: { paddingHorizontal: 16, paddingVertical: 9, borderRadius: 20, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.border, marginRight: 8 },
  categoryItemActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  categoryText: { fontSize: 13, fontWeight: "600", color: colors.textSecondary },
  categoryTextActive: { color: colors.white },
  emptyContainer: { alignItems: "center", justifyContent: "center", paddingVertical: 50 },
  emptyText: { color: colors.textSecondary, fontSize: 14, marginTop: 10 },
  bottomSpace: { height: 30 },
});
