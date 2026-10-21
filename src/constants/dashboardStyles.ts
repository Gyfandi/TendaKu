import { StyleSheet } from "react-native";
import { colors } from "./styles";

export const dashboardStyles = StyleSheet.create({
  statGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  statCard: {
    width: "48%",
    backgroundColor: colors.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    marginBottom: 12,
  },
  statIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  statValue: { fontSize: 26, fontWeight: "800", color: colors.text },
  statLabel: { fontSize: 13, color: colors.textSecondary, marginTop: 2 },
  trxCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    marginBottom: 12,
  },
  trxRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  trxName: { fontSize: 15, fontWeight: "700", color: colors.text },
  trxDetail: { fontSize: 13, color: colors.textSecondary, marginTop: 4 },
  trxTotal: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.primary,
    marginTop: 8,
  },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  badgeText: { fontSize: 11, fontWeight: "700", color: colors.white },
    menuRow: { flexDirection: "row", gap: 12, marginBottom: 16 },
  menuButton: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, backgroundColor: colors.primary, borderRadius: 14, paddingVertical: 12 },
  menuText: { color: colors.white, fontWeight: "700", fontSize: 14 },
  backButton: { alignItems: "center", paddingVertical: 12, borderRadius: 14, borderWidth: 1, borderColor: colors.primary, marginTop: 8 },
  backText: { color: colors.primary, fontWeight: "700", fontSize: 14 },
});
