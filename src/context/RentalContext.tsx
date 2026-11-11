import {
  getDaftarBarang,
  getDaftarTransaksi,
  kirimTransaksi,
} from "@/services/rentalApi";
import { Barang } from "@/types/barang";
import { Transaksi } from "@/types/transaksi";
import { pesanError } from "@/utils/async";
import { buatTransaksi, DataTransaksiBaru } from "@/utils/transaksi";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

export interface HasilSewa {
  success: boolean;
  message?: string;
}

interface RentalContextValue {
  barang: Barang[];
  transaksi: Transaksi[];
  /** true selama data awal (barang + transaksi) sedang dimuat */
  isLoading: boolean;
  /** pesan error jika pemuatan data awal gagal */
  error: string | null;
  muatUlang: () => Promise<void>;
  // Versi sinkron (tetap ada agar kode lama tidak rusak).
  // Mengembalikan true jika berhasil, false jika stok tidak cukup.
  sewaBarang: (data: DataTransaksiBaru) => boolean;
  // Versi async: ada proses "kirim ke server", bisa berhasil atau gagal.
  sewaBarangAsync: (data: DataTransaksiBaru) => Promise<HasilSewa>;
}

const RentalContext = createContext<RentalContextValue | null>(null);

export function RentalProvider({ children }: { children: ReactNode }) {
  const [barang, setBarang] = useState<Barang[]>([]);
  const [transaksi, setTransaksi] = useState<Transaksi[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const muatUlang = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Dua permintaan berjalan paralel (pre-built: Promise.all).
      const [dataBarang, dataTransaksi] = await Promise.all([
        getDaftarBarang(),
        getDaftarTransaksi(),
      ]);
      setBarang(dataBarang);
      setTransaksi(dataTransaksi);
    } catch (e) {
      setError(pesanError(e, "Gagal memuat data rental."));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void muatUlang();
  }, [muatUlang]);

  const kurangiStok = (barangId: number, jumlah: number) =>
    setBarang((prev) =>
      prev.map((b) => (b.id === barangId ? { ...b, stok: b.stok - jumlah } : b)),
    );

  const sewaBarang = (data: DataTransaksiBaru): boolean => {
    const target = barang.find((b) => b.id === data.barangId);
    if (!target || data.jumlah < 1 || data.jumlah > target.stok) return false;

    kurangiStok(data.barangId, data.jumlah);
    setTransaksi((prev) => [...prev, buatTransaksi(data)]);
    return true;
  };

  const sewaBarangAsync = async (data: DataTransaksiBaru): Promise<HasilSewa> => {
    const target = barang.find((b) => b.id === data.barangId);
    if (!target) return { success: false, message: "Barang tidak ditemukan." };

    try {
      const transaksiBaru = await kirimTransaksi(data, target.stok);
      // Stok & riwayat hanya berubah setelah "server" menyatakan berhasil.
      kurangiStok(data.barangId, data.jumlah);
      setTransaksi((prev) => [...prev, transaksiBaru]);
      return { success: true };
    } catch (e) {
      return { success: false, message: pesanError(e, "Penyewaan gagal. Coba lagi.") };
    }
  };

  return (
    <RentalContext.Provider
      value={{
        barang,
        transaksi,
        isLoading,
        error,
        muatUlang,
        sewaBarang,
        sewaBarangAsync,
      }}
    >
      {children}
    </RentalContext.Provider>
  );
}

export function useRental(): RentalContextValue {
  const ctx = useContext(RentalContext);
  if (!ctx) {
    throw new Error("useRental harus dipakai di dalam RentalProvider");
  }
  return ctx;
}