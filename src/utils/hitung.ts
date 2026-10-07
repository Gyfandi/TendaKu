import { daftarBarang } from "@/data/barang";
import { StatusTransaksi, Transaksi } from "@/types/transaksi";

const MS_PER_HARI = 1000 * 60 * 60 * 24;

export const hitungDurasi = (pinjam: string, kembali: string): number => {
  const selisih = new Date(kembali).getTime() - new Date(pinjam).getTime();
  return Math.max(1, Math.ceil(selisih / MS_PER_HARI));
};

export const hitungTotalHarga = (
  hargaPerHari: number,
  durasi: number,
  jumlah: number = 1,
): number => hargaPerHari * durasi * jumlah;

const hitungHariTelat = (tanggalKembali: string, hariIni: Date): number => {
  const selisih = hariIni.getTime() - new Date(tanggalKembali).getTime();
  return Math.max(0, Math.floor(selisih / MS_PER_HARI));
};

export const getStatusAktual = (
  t: Transaksi,
  hariIni: Date = new Date(),
): StatusTransaksi => {
  if (t.status === "dikembalikan") return "dikembalikan";
  return hitungHariTelat(t.tanggalKembali, hariIni) > 0
    ? "terlambat"
    : "dipinjam";
};

// denda: 50% harga sewa per unit per hari telat
export const hitungDenda = (
  t: Transaksi,
  hariIni: Date = new Date(),
): number => {
  if (t.status === "dikembalikan") return 0;
  const barang = daftarBarang.find((b) => b.id === t.barangId);
  if (!barang) return 0;
  return (
    hitungHariTelat(t.tanggalKembali, hariIni) *
    barang.hargaPerHari *
    t.jumlah *
    0.5
  );
};

export const formatRupiah = (angka: number): string =>
  "Rp " + angka.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
