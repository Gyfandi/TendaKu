import { useState } from "react";
import { ScrollView, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import RenterCard from "../components/RenterCard";
import RenterForm from "../components/RenterForm";
import { renterStyles } from "../constants/renterStyles";
import { initialRenters } from "../data/renters";
import { Renter } from "../types/renter";

export default function PenyewaScreen() {
  const [renters, setRenters] = useState<Renter[]>(initialRenters);

  const handleAddRenter = (name: string, phone: string, address: string) => {
    const newRenter: Renter = {
      id: Date.now(),
      name,
      phone,
      address,
      status: "Aktif",
    };
    setRenters([...renters, newRenter]);
  };

  return (
    <SafeAreaView style={renterStyles.container}>
      <ScrollView
        contentContainerStyle={renterStyles.content}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={renterStyles.title}>Penyewa</Text>

        <RenterForm onSave={handleAddRenter} />

        <Text style={renterStyles.sectionTitle}>
          Daftar Penyewa ({renters.length})
        </Text>

        {/* LOOP + CONDITION */}
        {renters.length > 0 ? (
          renters.map((renter) => <RenterCard key={renter.id} renter={renter} />)
        ) : (
          <Text style={renterStyles.emptyText}>Belum ada penyewa</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}