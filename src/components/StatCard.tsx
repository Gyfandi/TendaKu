import { dashboardStyles } from "@/constants/dashboardStyles";
import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";

interface StatCardProps {
  label: string;
  nilai: number | string;
  icon: keyof typeof Ionicons.glyphMap;
  warna: string;
}

export default function StatCard({ label, nilai, icon, warna }: StatCardProps) {
  return (
    <View style={dashboardStyles.statCard}>
      {/* inline style: warnanya dinamis dari props */}
      <View style={[dashboardStyles.statIcon, { backgroundColor: warna }]}>
        <Ionicons name={icon} size={20} color="#FFFFFF" />
      </View>
      <Text style={dashboardStyles.statValue}>{nilai}</Text>
      <Text style={dashboardStyles.statLabel}>{label}</Text>
    </View>
  );
}
