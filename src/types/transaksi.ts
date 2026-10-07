export type StatusTransaksi = "dipinjam" | "dikembalikan" | "terlambat";

export interface Transaksi {
  readonly id: string;
  penyewa: string;
  barangId: number;
  jumlah: number;
  tanggalPinjam: string;
  tanggalKembali: string;
  status: StatusTransaksi;
}
