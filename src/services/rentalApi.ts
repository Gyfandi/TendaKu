
import { supabase } from "@/lib/supabase";
import { daftarBarang } from "@/data/barang";
import { daftarTransaksi } from "@/data/transaksi";
import { Barang, DataBarangBaru } from "@/types/barang";
import { Transaksi } from "@/types/transaksi";
import { buatTransaksi, DataTransaksiBaru } from "@/utils/transaksi";

interface BarangDatabase {
  id: number;
  nama: string;
  kategori: string;
  harga_per_hari: number;
  stok: number;
  image_url: string | null;
}

const ubahKeBarang = (data: BarangDatabase): Barang => {
  const gambarLokal = daftarBarang.find(
    (item) => item.id === data.id,
  )?.image;

  return {
    id: data.id,
    nama: data.nama,
    kategori: data.kategori,
    hargaPerHari: data.harga_per_hari,
    stok: data.stok,
    image: data.image_url
      ? { uri: data.image_url }
      : gambarLokal ?? require("../../assets/barang/tenda-dome-4-person.jpeg"),
  };
};

// Mengambil daftar barang dari Supabase.
export async function getDaftarBarang(): Promise<Barang[]> {
  const { data, error } = await supabase
    .from("barang")
    .select("*")
    .order("id", { ascending: true });

  if (error) {
    throw new Error(`Gagal memuat barang: ${error.message}`);
  }

  return (data as BarangDatabase[]).map(ubahKeBarang);
}

// Menambahkan barang baru.
export async function tambahBarang(
  input: DataBarangBaru,
): Promise<Barang> {
  const { data, error } = await supabase
    .from("barang")
    .insert({
      nama: input.nama,
      kategori: input.kategori,
      harga_per_hari: input.hargaPerHari,
      stok: input.stok,
      image_url: input.imageUrl ?? null,
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Gagal menambahkan barang: ${error.message}`);
  }

  return ubahKeBarang(data as BarangDatabase);
}

// Memperbarui barang.
export async function ubahBarang(
  id: number,
  input: DataBarangBaru,
): Promise<Barang> {
  const { data, error } = await supabase
    .from("barang")
    .update({
      nama: input.nama,
      kategori: input.kategori,
      harga_per_hari: input.hargaPerHari,
      stok: input.stok,
      image_url: input.imageUrl ?? null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error(`Gagal mengubah barang: ${error.message}`);
  }

  return ubahKeBarang(data as BarangDatabase);
}

// Menghapus barang.
export async function hapusBarang(id: number): Promise<void> {
  const { error } = await supabase
    .from("barang")
    .delete()
    .eq("id", id);

  if (error) {
    throw new Error(`Gagal menghapus barang: ${error.message}`);
  }
}

// Data transaksi masih menggunakan simulasi lokal.
// Integrasi cloud transaksi dilakukan pada tahap berikutnya.
export async function getDaftarTransaksi(): Promise<Transaksi[]> {
  return daftarTransaksi.map((t) => ({ ...t }));
}

export async function kirimTransaksi(
  data: DataTransaksiBaru,
  stokSaatIni: number,
): Promise<Transaksi> {
  if (data.jumlah < 1 || data.jumlah > stokSaatIni) {
    throw new Error("Stok tidak mencukupi.");
  }

  return buatTransaksi(data);
}
