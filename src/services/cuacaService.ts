import type { WeatherResponse } from "@/types/weather";
import { pesanError, retry, withTimeout } from "@/utils/async";
import { fetchWeather } from "./weatherApi";

export interface LokasiKamping {
  id: string;
  nama: string;
  latitude: number;
  longitude: number;
}

// Koordinat perkiraan.
export const daftarLokasi: LokasiKamping[] = [
  { id: "bromo", nama: "Gunung Bromo", latitude: -7.9425, longitude: 112.953 },
  { id: "semeru", nama: "Ranu Pani (Semeru)", latitude: -8.0136, longitude: 112.9197 },
  { id: "arjuno", nama: "Gunung Arjuno", latitude: -7.7667, longitude: 112.5833 },
];

export interface CuacaLokasi {
  lokasi: LokasiKamping;
  cuaca: WeatherResponse | null;
  error: string | null;
}

/**
 * Mengambil cuaca semua lokasi sekaligus (paralel) memakai Promise.allSettled,
 * sehingga satu lokasi yang gagal tidak membatalkan lokasi lainnya.
 * Setiap permintaan dibatasi waktu (8 detik) dan dicoba ulang 2 kali.
 */
export async function ambilCuacaSemuaLokasi(): Promise<CuacaLokasi[]> {
  const hasil = await Promise.allSettled(
    daftarLokasi.map((lokasi) =>
      retry(
        () => withTimeout(fetchWeather(lokasi.latitude, lokasi.longitude), 8000),
        2,
        600,
      ),
    ),
  );

  // Jika semuanya gagal, lempar error agar UI menampilkan pesan + tombol coba lagi.
  const gagalSemua = hasil.every((h) => h.status === "rejected");
  if (gagalSemua) {
    const pertama = hasil[0];
    throw pertama.status === "rejected"
      ? pertama.reason
      : new Error("Gagal mengambil data cuaca.");
  }

  return hasil.map((h, i) =>
    h.status === "fulfilled"
      ? { lokasi: daftarLokasi[i], cuaca: h.value, error: null }
      : { lokasi: daftarLokasi[i], cuaca: null, error: pesanError(h.reason) },
  );
}