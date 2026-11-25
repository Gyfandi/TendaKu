
import { daftarBarang } from "@/data/barang";
import { supabase } from "@/lib/supabase";
import { Barang, DataBarangBaru } from "@/types/barang";
import { Transaksi } from "@/types/transaksi";
import { delay } from "@/utils/async";
import { buatTransaksi, DataTransaksiBaru } from "@/utils/transaksi";
import { daftarTransaksi } from "@/data/transaksi";

interface BarangSupabase {
  id: number;
  nama: string;
  kategori: string;
  harga_per_hari: number;
  stok: number;
  image_url: string | null;
}

// Mengubah format kolom Supabase menjadi format Barang aplikasi.
function ubahKeBarang(row: BarangSupabase): Barang {
  const barangLokal = daftarBarang.find((item) => item.id === row.id);

  return {
    id: row.id,
    nama: row.nama,
    kategori: row.kategori,
    hargaPerHari: row.harga_per_hari,
    stok: row.stok,
    image: row.image_url || barangLokal?.image || "",
  };
}

// Mengambil seluruh data barang dari Supabase.
export async function getDaftarBarang(): Promise<Barang[]> {
  const { data, error } = await supabase
    .from("barang")
    .select("*")
    .order("id", { ascending: true });

  if (error) {
    throw new Error(`Gagal mengambil data barang: ${error.message}`);
  }

  return (data as BarangSupabase[]).map(ubahKeBarang);
}

// Menambahkan barang baru ke Supabase.
export async function tambahBarang(
  data: DataBarangBaru,
): Promise<Barang> {
  const { data: hasil, error } = await supabase
    .from("barang")
    .insert({
      nama: data.nama,
      kategori: data.kategori,
      harga_per_hari: data.hargaPerHari,
      stok: data.stok,
      image_url: data.imageUrl,
    })
    .select("*")
    .single();

  if (error) {
    throw new Error(`Gagal menambahkan barang: ${error.message}`);
  }

  return ubahKeBarang(hasil as BarangSupabase);
}

// Mengubah data barang berdasarkan ID.
export async function editBarang(
  id: number,
  data: DataBarangBaru,
): Promise<Barang> {
  const { data: hasil, error } = await supabase
    .from("barang")
    .update({
      nama: data.nama,
      kategori: data.kategori,
      harga_per_hari: data.hargaPerHari,
      stok: data.stok,
      image_url: data.imageUrl,
    })
    .eq("id", id)
    .select("*")
    .single();

  if (error) {
    throw new Error(`Gagal mengubah barang: ${error.message}`);
  }

  return ubahKeBarang(hasil as BarangSupabase);
}

// Menghapus barang berdasarkan ID.
export async function hapusBarang(id: number): Promise<void> {
  const { error } = await supabase
    .from("barang")
    .delete()
    .eq("id", id)
    .select("id")
    .single();

  if (error) {
    throw new Error(`Gagal menghapus barang: ${error.message}`);
  }
}

// Transaksi masih menggunakan simulasi lokal.
export async function getDaftarTransaksi(): Promise<Transaksi[]> {
  await delay(800);
  return daftarTransaksi.map((t) => ({ ...t }));
}

export async function kirimTransaksi(
  data: DataTransaksiBaru,
  stokSaatIni: number,
): Promise<Transaksi> {
  await delay(1000);

  if (data.jumlah < 1 || data.jumlah > stokSaatIni) {
    throw new Error("Stok tidak mencukupi.");
  }

  return buatTransaksi(data);
}
