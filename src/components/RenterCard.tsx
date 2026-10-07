import { Alert, Text, TouchableOpacity, View } from "react-native";
import { renterStyles } from "../constants/renterStyles";
import { Renter } from "../types/renter";

interface RenterCardProps {
  renter: Renter;
}

// Custom function
const getStatusColor = (status: Renter["status"]) => {
  return status === "Aktif" ? "green" : "gray";
};

export default function RenterCard({ renter }: RenterCardProps) {
  const handleDetail = () => {
    Alert.alert(
      renter.name,
      `No. HP: ${renter.phone}\nAlamat: ${renter.address}\nStatus: ${renter.status}`
    );
  };

  return (
    <View style={renterStyles.card}>
      <View style={renterStyles.cardHeader}>
        <Text style={renterStyles.name}>👤 {renter.name}</Text>

        {/* INLINE STYLE: warna badge berubah sesuai status */}
        <View
          style={{
            backgroundColor: getStatusColor(renter.status),
            paddingHorizontal: 10,
            paddingVertical: 3,
            borderRadius: 12,
          }}
        >
          <Text style={renterStyles.badgeText}>{renter.status}</Text>
        </View>
      </View>

      <Text style={renterStyles.info}>{renter.phone}</Text>
      <Text style={renterStyles.info}>{renter.address}</Text>

      <TouchableOpacity
        style={renterStyles.detailButton}
        onPress={handleDetail}
      >
        <Text style={renterStyles.detailButtonText}>Lihat Detail</Text>
      </TouchableOpacity>
    </View>
  );
}