import type { WeatherCurrent } from "@/types/weather";

/**
 * Mengecek apakah cuaca layak untuk camping.
 * Aman  -> Promise.resolve(pesan)
 * Bahaya -> Promise.reject(Error)
 */
export function cekKelayakanCamping(current: WeatherCurrent): Promise<string> {
  // Kode WMO 95-99 = badai petir
  if (current.weather_code >= 95) {
    return Promise.reject(
      new Error("Badai petir terdeteksi, tidak disarankan camping."),
    );
  }

  if (current.wind_speed_10m > 40) {
    return Promise.reject(
      new Error(`Angin terlalu kencang (${current.wind_speed_10m} km/jam).`),
    );
  }

  return Promise.resolve("Cuaca mendukung, aman untuk camping.");
}