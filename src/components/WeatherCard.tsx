import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";

import AsyncState from "@/components/AsyncState";
import { weatherStyles as s } from "@/constants/asyncStyles";
import { colors } from "@/constants/styles";
import { useAsync } from "@/hooks/use-async";
import { ambilCuacaSemuaLokasi } from "@/services/cuacaService";
import { cekKelayakanCamping } from "@/services/kelayakanService";
import type { WeatherCurrent } from "@/types/weather";
import { deskripsiCuaca, saranKamping } from "@/utils/cuaca";

/**
 * Menampilkan hasil cekKelayakanCamping() untuk satu lokasi.
 * Dibuat sebagai komponen sendiri karena hook (useState/useEffect)
 * tidak boleh dipanggil di dalam data.map(...).
 */
function KelayakanBadge({ current }: { current: WeatherCurrent }) {
  const [hasil, setHasil] = useState<{ layak: boolean; pesan: string } | null>(null);

  useEffect(() => {
    cekKelayakanCamping(current).then(
      // Promise.resolve -> layak
      (pesan) => setHasil({ layak: true, pesan }),
      // Promise.reject -> tidak layak
      (err: Error) => setHasil({ layak: false, pesan: err.message }),
    );
  }, [current]);

  if (!hasil) return null;

  const warna = hasil.layak ? colors.success : colors.danger;

  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginTop: 6 }}>
      <Ionicons
        name={hasil.layak ? "checkmark-circle" : "close-circle"}
        size={16}
        color={warna}
      />
      <Text style={{ color: warna, fontSize: 11, fontWeight: "700", flexShrink: 1 }}>
        {hasil.layak ? "Layak" : "Tidak layak"}: {hasil.pesan}
      </Text>
    </View>
  );
}

export default function WeatherCard() {
  const { data, loading, error, muatUlang } = useAsync(ambilCuacaSemuaLokasi);

  return (
    <View style={s.card}>
      <View style={s.header}>
        <View>
          <Text style={s.title}>Cuaca lokasi camping</Text>
          <Text style={s.subtitle}>Cek cuaca sebelum menentukan perlengkapan</Text>
        </View>
        <Pressable
          onPress={muatUlang}
          disabled={loading}
          accessibilityLabel="Muat ulang cuaca"
          style={s.refresh}
        >
          {loading && data ? (
            <ActivityIndicator size="small" color={colors.primary} />
          ) : (
            <Ionicons name="refresh" size={18} color={colors.primary} />
          )}
        </Pressable>
      </View>

      {/* Loading layar penuh hanya saat belum ada data sama sekali */}
      <AsyncState
        loading={loading && !data}
        error={error}
        onRetry={muatUlang}
        loadingText="Mengambil data cuaca..."
      >
        {data?.map(({ lokasi, cuaca, error: errorLokasi }, index) => {
          if (!cuaca) {
            return (
              <View key={lokasi.id} style={[s.row, index === 0 && s.firstRow]}>
                <View style={s.iconWrap}>
                  <Ionicons name="cloud-offline-outline" size={22} color={colors.danger} />
                </View>
                <View style={s.info}>
                  <Text style={s.nama}>{lokasi.nama}</Text>
                  <Text style={s.rowError}>{errorLokasi}</Text>
                </View>
              </View>
            );
          }

          const { current, current_units: unit } = cuaca;
          const info = deskripsiCuaca(current.weather_code);

          return (
            <View key={lokasi.id} style={[s.row, index === 0 && s.firstRow]}>
              <View style={s.iconWrap}>
                <Ionicons name={info.icon} size={24} color={colors.primary} />
              </View>
              <View style={s.info}>
                <Text style={s.nama}>{lokasi.nama}</Text>
                <Text style={s.meta}>
                  {info.label} · Lembap {current.relative_humidity_2m}
                  {unit.relative_humidity_2m} · Angin {current.wind_speed_10m} {unit.wind_speed_10m}
                </Text>
                <Text style={s.saran}>{saranKamping(current)}</Text>
                <KelayakanBadge current={current} />
              </View>
              <Text style={s.suhu}>
                {Math.round(current.temperature_2m)}
                {unit.temperature_2m}
              </Text>
            </View>
          );
        })}
      </AsyncState>
    </View>
  );
}