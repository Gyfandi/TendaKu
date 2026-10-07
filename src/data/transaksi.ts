import { Transaksi } from "@/types/transaksi";

export const daftarTransaksi: Transaksi[] = [
  {
    id: "T001",
    penyewa: "Budi Santoso",
    barangId: 1,
    jumlah: 1,
    tanggalPinjam: "2026-10-02",
    tanggalKembali: "2026-10-05",
    status: "dipinjam",
  },
  {
    id: "T002",
    penyewa: "Siti Rahma",
    barangId: 2,
    jumlah: 2,
    tanggalPinjam: "2026-10-06",
    tanggalKembali: "2026-10-09",
    status: "dipinjam",
  },
  {
    id: "T003",
    penyewa: "Andi Pratama",
    barangId: 3,
    jumlah: 2,
    tanggalPinjam: "2026-09-28",
    tanggalKembali: "2026-09-30",
    status: "dikembalikan",
  },
  {
    id: "T004",
    penyewa: "Dewi Lestari",
    barangId: 4,
    jumlah: 1,
    tanggalPinjam: "2026-10-01",
    tanggalKembali: "2026-10-04",
    status: "dipinjam",
  },
  {
    id: "T005",
    penyewa: "Budi Santoso",
    barangId: 5,
    jumlah: 3,
    tanggalPinjam: "2026-10-07",
    tanggalKembali: "2026-10-10",
    status: "dipinjam",
  },
];
