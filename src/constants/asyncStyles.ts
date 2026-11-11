import { StyleSheet } from "react-native";
import { colors } from "./styles";

export const asyncStyles = StyleSheet.create({
  fullScreen: { flex: 1, backgroundColor: colors.background },
  center: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
    paddingHorizontal: 24,
  },
  loadingText: { marginTop: 12, color: colors.textSecondary, fontSize: 13 },
  errorTitle: { marginTop: 10, fontSize: 15, fontWeight: "800", color: colors.text },
  errorText: {
    marginTop: 6,
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: 18,
  },
  retryButton: {
    marginTop: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingHorizontal: 18,
    paddingVertical: 11,
  },
  retryText: { color: colors.white, fontWeight: "700", fontSize: 13 },
});

export const weatherStyles = StyleSheet.create({
  card: {
    marginTop: 19,
    padding: 16,
    borderRadius: 18,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
  },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  title: { fontSize: 16, fontWeight: "800", color: colors.text },
  subtitle: { fontSize: 12, color: colors.textSecondary, marginTop: 3 },
  refresh: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  firstRow: { marginTop: 12 },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
  },
  info: { flex: 1 },
  nama: { fontSize: 14, fontWeight: "700", color: colors.text },
  meta: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
  saran: { fontSize: 12, color: colors.primaryDark, marginTop: 4, fontWeight: "600" },
  suhu: { fontSize: 22, fontWeight: "800", color: colors.text },
  rowError: { fontSize: 12, color: colors.danger, marginTop: 2 },
});