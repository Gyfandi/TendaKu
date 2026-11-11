import type { Ionicons } from "@expo/vector-icons";

import type { WeatherCurrent } from "@/types/weather";

export interface InfoCuaca {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
}

/** Menerjemahkan kode cuaca WMO dari Open-Meteo. */
export function deskripsiCuaca(kode: number): InfoCuaca {
  if (kode === 0) return { label: "Cerah", icon: "sunny" };
  if (kode <= 2) return { label: "Cerah berawan", icon: "partly-sunny" };
  if (kode === 3) return { label: "Berawan", icon: "cloudy" };
  if (kode === 45 || kode === 48) return { label: "Berkabut", icon: "cloud" };
  if (kode >= 51 && kode <= 57) return { label: "Gerimis", icon: "rainy" };
  if (kode >= 61 && kode <= 67) return { label: "Hujan", icon: "rainy" };
  if (kode >= 71 && kode <= 77) return { label: "Salju", icon: "snow" };
  if (kode >= 80 && kode <= 82) return { label: "Hujan deras", icon: "rainy" };
  if (kode === 85 || kode === 86) return { label: "Salju lebat", icon: "snow" };
  if (kode >= 95) return { label: "Badai petir", icon: "thunderstorm" };
  return { label: "Tidak diketahui", icon: "cloud" };
}

/** Saran singkat yang dikaitkan dengan perlengkapan yang disewakan. */
export function saranKamping(cuaca: WeatherCurrent): string {
  const kode = cuaca.weather_code;
  if (kode >= 95) return "Badai petir, sebaiknya tunda pendakian.";
  if ((kode >= 51 && kode <= 67) || (kode >= 80 && kode <= 82)) {
    return "Bawa tenda double layer dan jas hujan.";
  }
  if (cuaca.temperature_2m < 15) return "Udara dingin, sewa sleeping bag.";
  if (cuaca.wind_speed_10m > 30) return "Angin kencang, pasang tenda dengan kuat.";
  return "Cuaca mendukung untuk berkemah.";
}