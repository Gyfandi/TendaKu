
import type { WeatherResponse } from "../types/weather";

const BASE_URL = "https://api.open-meteo.com/v1/forecast";

export async function fetchWeather(
  latitude: number,
  longitude: number
): Promise<WeatherResponse> {
  const params = new URLSearchParams({
    latitude: latitude.toString(),
    longitude: longitude.toString(),
    current: [
      "temperature_2m",
      "relative_humidity_2m",
      "apparent_temperature",
      "weather_code",
      "wind_speed_10m",
    ].join(","),
    timezone: "Asia/Jakarta",
  });

  const response = await fetch(`${BASE_URL}?${params.toString()}`);

  if (!response.ok) {
    throw new Error(`Gagal mengambil data cuaca: ${response.status}`);
  }

  const data: WeatherResponse = await response.json();

  return data;
}
