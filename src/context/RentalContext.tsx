import { daftarBarang } from "@/data/barang";
import { daftarTransaksi } from "@/data/transaksi";
import { Barang } from "@/types/barang";
import { Transaksi } from "@/types/transaksi";
import { buatTransaksi, DataTransaksiBaru } from "@/utils/transaksi";
import { createContext, ReactNode, useContext, useState } from "react";

interface RentalContextValue {
  barang: Barang[];
  transaksi: Transaksi[];
  // Mengembalikan true jika berhasil, false jika stok tidak cukup
  sewaBarang: (data: DataTransaksiBaru) => boolean;
}

const RentalContext = createContext<RentalContextValue | null>(null);

export function RentalProvider({ children }: { children: ReactNode }) {
  const [barang, setBarang] = useState<Barang[]>(daftarBarang);
  const [transaksi, setTransaksi] = useState<Transaksi[]>(daftarTransaksi);

  const sewaBarang = (data: DataTransaksiBaru): boolean => {
    const target = barang.find((b) => b.id === data.barangId);
    if (!target || data.jumlah < 1 || data.jumlah > target.stok) return false;

    // Kurangi stok
    setBarang((prev) =>
      prev.map((b) =>
        b.id === data.barangId ? { ...b, stok: b.stok - data.jumlah } : b,
      ),
    );
    // Tambah transaksi
    setTransaksi((prev) => [...prev, buatTransaksi(data)]);
    return true;
  };

  return (
    <RentalContext.Provider value={{ barang, transaksi, sewaBarang }}>
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