
import type { ImageSourcePropType } from "react-native";

export interface Barang {
  id: number;
  nama: string;
  kategori: string;
  hargaPerHari: number;
  stok: number;
  image: ImageSourcePropType;
}

export interface DataBarangBaru {
  nama: string;
  kategori: string;
  hargaPerHari: number;
  stok: number;
  imageUrl?: string | null;
}
