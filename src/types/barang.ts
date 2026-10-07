export interface Barang {
  id: number;
  nama: string;
  kategori: string;
  hargaPerHari: number;
  stok: number;
  image: ReturnType<typeof require>;
}
