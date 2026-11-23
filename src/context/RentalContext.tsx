
import {
  getDaftarBarang,
  getDaftarTransaksi,
  kirimTransaksi,
  tambahBarang as apiTambahBarang,
  ubahBarang as apiUbahBarang,
  hapusBarang as apiHapusBarang,
} from "@/services/rentalApi";
import { Barang, DataBarangBaru } from "@/types/barang";
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
  isLoading: boolean;
  error: string | null;
  muatUlang: () => Promise<void>;

  // Cloud CRUD barang.
  tambahBarangAsync: (data: DataBarangBaru) => Promise<Barang>;
  ubahBarangAsync: (id: number, data: DataBarangBaru) => Promise<Barang>;
  hapusBarangAsync: (id: number) => Promise<void>;

  // Fitur penyewaan yang sudah ada.
  sewaBarang: (data: DataTransaksiBaru) => boolean;
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

  // ==========================================
  // CLOUD CRUD BARANG
  // ==========================================

  const tambahBarangAsync = async (
    data: DataBarangBaru,
  ): Promise<Barang> => {
    const barangBaru = await apiTambahBarang(data);

    setBarang((prev) => [...prev, barangBaru]);

    return barangBaru;
  };

  const ubahBarangAsync = async (
    id: number,
    data: DataBarangBaru,
  ): Promise<Barang> => {
    const barangDiperbarui = await apiUbahBarang(id, data);

    setBarang((prev) =>
      prev.map((item) =>
        item.id === id ? barangDiperbarui : item,
      ),
    );

    return barangDiperbarui;
  };

  const hapusBarangAsync = async (id: number): Promise<void> => {
    await apiHapusBarang(id);

    setBarang((prev) =>
      prev.filter((item) => item.id !== id),
    );
  };

  // ==========================================
  // FITUR PENYEWAAN LAMA
  // ==========================================

  const kurangiStok = (barangId: number, jumlah: number) =>
    setBarang((prev) =>
      prev.map((b) =>
        b.id === barangId
          ? { ...b, stok: b.stok - jumlah }
          : b,
      ),
    );

  const sewaBarang = (data: DataTransaksiBaru): boolean => {
    const target = barang.find((b) => b.id === data.barangId);

    if (!target || data.jumlah < 1 || data.jumlah > target.stok) {
      return false;
    }

    kurangiStok(data.barangId, data.jumlah);
    setTransaksi((prev) => [...prev, buatTransaksi(data)]);

    return true;
  };

  const sewaBarangAsync = async (
    data: DataTransaksiBaru,
  ): Promise<HasilSewa> => {
    const target = barang.find((b) => b.id === data.barangId);

    if (!target) {
      return {
        success: false,
        message: "Barang tidak ditemukan.",
      };
    }

    try {
      const transaksiBaru = await kirimTransaksi(data, target.stok);

      kurangiStok(data.barangId, data.jumlah);
      setTransaksi((prev) => [...prev, transaksiBaru]);

      return { success: true };
    } catch (e) {
      return {
        success: false,
        message: pesanError(e, "Penyewaan gagal. Coba lagi."),
      };
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
        tambahBarangAsync,
        ubahBarangAsync,
        hapusBarangAsync,
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
