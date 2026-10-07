import { useState } from "react";
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";
import { renterStyles } from "../constants/renterStyles";

interface RenterFormProps {
  onSave: (name: string, phone: string, address: string) => void;
}

export default function RenterForm({ onSave }: RenterFormProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  // Custom function untuk tombol Simpan
  const handleSave = () => {
    if (name.trim() === "" || phone.trim() === "" || address.trim() === "") {
      Alert.alert("Peringatan", "Semua field wajib diisi!");
      return;
    }
    onSave(name, phone, address);
    setName("");
    setPhone("");
    setAddress("");
  };

  const isFilled = name !== "" && phone !== "" && address !== "";

  return (
    <View style={renterStyles.formBox}>
      <Text style={renterStyles.sectionTitle}>Tambah Penyewa</Text>

      <Text style={renterStyles.label}>Nama</Text>
      <TextInput
        style={renterStyles.input}
        placeholder="Masukkan nama"
        value={name}
        onChangeText={setName}
      />

      <Text style={renterStyles.label}>No. HP</Text>
      <TextInput
        style={renterStyles.input}
        placeholder="08xxxxxxxxxx"
        keyboardType="phone-pad"
        value={phone}
        onChangeText={setPhone}
      />

      <Text style={renterStyles.label}>Alamat</Text>
      <TextInput
        style={renterStyles.input}
        placeholder="Masukkan alamat"
        value={address}
        onChangeText={setAddress}
      />

      {/* INLINE STYLE: warna tombol berubah jika form sudah terisi */}
      <TouchableOpacity
        style={[
          renterStyles.saveButton,
          { backgroundColor: isFilled ? "#2E7D32" : "#9E9E9E" },
        ]}
        onPress={handleSave}
      >
        <Text style={renterStyles.saveButtonText}>Simpan</Text>
      </TouchableOpacity>
    </View>
  );
}