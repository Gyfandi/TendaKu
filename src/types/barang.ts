import type { ImageSourcePropType } from "react-native";

export interface Barang {
  id: number;
  nama: string;
  kategori: string;
  hargaPerHari: number;
  stok: number;
  image: ImageSourcePropType;
}
