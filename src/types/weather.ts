
export interface WeatherCurrent {
  time: string;
  temperature_2m: number;
  relative_humidity_2m: number;
  apparent_temperature: number;
  weather_code: number;
  wind_speed_10m: number;
}

export interface WeatherUnits {
  time: string;
  temperature_2m: string;
  relative_humidity_2m: string;
  apparent_temperature: string;
  weather_code: string;
  wind_speed_10m: string;
}

export interface WeatherResponse {
  latitude: number;
  longitude: number;
  timezone: string;
  current_units: WeatherUnits;
  current: WeatherCurrent;
}
