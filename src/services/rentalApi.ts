import { daftarBarang } from "@/data/barang";
import { daftarTransaksi } from "@/data/transaksi";
import { Barang } from "@/types/barang";
import { Transaksi } from "@/types/transaksi";
import { delay } from "@/utils/async";
import { buatTransaksi, DataTransaksiBaru } from "@/utils/transaksi";

/**
 * "Server palsu" untuk TendaKu. Data masih berasal dari file lokal, tetapi
 * diambil lewat fungsi async dengan jeda agar perilakunya sama seperti
 * memanggil API sungguhan (ada loading dan bisa gagal).
 */
const LATENSI_MS = 800;

// Ubah ke true untuk mencoba tampilan error saat demo.
const SIMULASI_GAGAL = false;

export async function getDaftarBarang(): Promise<Barang[]> {
  await delay(LATENSI_MS);
  if (SIMULASI_GAGAL) throw new Error("Server tidak dapat dihubungi.");
  return daftarBarang.map((b) => ({ ...b }));
}

export async function getDaftarTransaksi(): Promise<Transaksi[]> {
  await delay(LATENSI_MS);
  if (SIMULASI_GAGAL) throw new Error("Server tidak dapat dihubungi.");
  return daftarTransaksi.map((t) => ({ ...t }));
}

export async function kirimTransaksi(
  data: DataTransaksiBaru,
  stokSaatIni: number,
): Promise<Transaksi> {
  await delay(1000);
  if (SIMULASI_GAGAL) throw new Error("Gagal menyimpan transaksi ke server.");
  if (data.jumlah < 1 || data.jumlah > stokSaatIni) {
    throw new Error("Stok tidak mencukupi.");
  }
  return buatTransaksi(data);
}