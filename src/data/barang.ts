import { Barang } from "@/types/barang";

export const daftarBarang: Barang[] = [
  {
    id: 1,
    nama: "Tenda Dome 4 Person",
    kategori: "Tenda",
    hargaPerHari: 75000,
    stok: 4,
    image: require("../../assets/barang/tenda-dome-4-person.jpeg"),
  },
  {
    id: 2,
    nama: "Carrier 60 Liter",
    kategori: "Carrier",
    hargaPerHari: 50000,
    stok: 6,
    image: require("../../assets/barang/carrier-60-liter.jpeg"),
  },
  {
    id: 3,
    nama: "Sleeping Bag",
    kategori: "Camping",
    hargaPerHari: 30000,
    stok: 8,
    image: require("../../assets/barang/sleeping-bag.jpeg"),
  },
  {
    id: 4,
    nama: "Kompor Portable",
    kategori: "Masak",
    hargaPerHari: 25000,
    stok: 5,
    image: require("../../assets/barang/kompor-portable.jpeg"),
  },
  {
    id: 5,
    nama: "Matras Camping",
    kategori: "Camping",
    hargaPerHari: 20000,
    stok: 10,
    image: require("../../assets/barang/matras-camping.jpeg"),
  },
  {
    id: 6,
    nama: "Headlamp Outdoor",
    kategori: "Elektronik",
    hargaPerHari: 15000,
    stok: 0,
    image: require("../../assets/barang/headlamp-outdoor.jpeg"),
  },
];
