import { Transaksi } from "@/types/transaksi";

export type DataTransaksiBaru = Omit<Transaksi, "id" | "status">;

// Membuat objek transaksi baru sesuai tipe Transaksi
export const buatTransaksi = (data: DataTransaksiBaru): Transaksi => ({
  id: `TRX-${Date.now()}`,
  penyewa: data.penyewa,
  barangId: data.barangId,
  jumlah: data.jumlah,
  tanggalPinjam: data.tanggalPinjam,
  tanggalKembali: data.tanggalKembali,
  status: "dipinjam",
});