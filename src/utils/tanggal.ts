// Helper tanggal untuk fitur penyewaan. Format: YYYY-MM-DD

export const formatTanggal = (date: Date): string => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

// Tanggal hari ini ditambah sekian hari, dalam format YYYY-MM-DD
export const tanggalDefault = (tambahHari: number): string => {
  const date = new Date();
  date.setDate(date.getDate() + tambahHari);
  return formatTanggal(date);
};

// Mengembalikan Date jika teks valid, null jika tidak
export const parseTanggal = (teks: string): Date | null => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(teks)) return null;

  const [y, m, d] = teks.split("-").map(Number);
  const date = new Date(y, m - 1, d);

  const valid =
    date.getFullYear() === y &&
    date.getMonth() === m - 1 &&
    date.getDate() === d;

  return valid ? date : null;
};