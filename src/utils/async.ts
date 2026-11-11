/**
 * Kumpulan Custom Async Function (dibuat sendiri, tidak bawaan library).
 * Semuanya mengembalikan Promise dan dipakai dengan async/await.
 */

/** Custom #1 - Menunda eksekusi. Membungkus setTimeout (pre-built, berbasis callback) menjadi Promise. */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export class TimeoutError extends Error {
  constructor(ms: number) {
    super(`Permintaan melebihi batas waktu ${ms / 1000} detik.`);
    this.name = "TimeoutError";
  }
}

/** Custom #2 - Membatasi lama menunggu sebuah Promise. Gagal dengan TimeoutError jika kelamaan. */
export function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => reject(new TimeoutError(ms)), ms);
    promise.then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      (error) => {
        clearTimeout(timer);
        reject(error);
      },
    );
  });
}

/** Custom #3 - Mencoba ulang fungsi async yang gagal (jeda bertambah di tiap percobaan). */
export async function retry<T>(
  fn: () => Promise<T>,
  percobaan = 3,
  jedaMs = 500,
): Promise<T> {
  let errorTerakhir: unknown;
  for (let i = 1; i <= percobaan; i++) {
    try {
      return await fn();
    } catch (error) {
      errorTerakhir = error;
      if (i < percobaan) await delay(jedaMs * i);
    }
  }
  throw errorTerakhir;
}

/** Mengubah error apa pun menjadi pesan yang ramah dibaca pengguna. */
export function pesanError(
  error: unknown,
  fallback = "Terjadi kesalahan. Silakan coba lagi.",
): string {
  // fetch() melempar TypeError ketika jaringan putus.
  if (error instanceof TypeError) return "Tidak dapat terhubung ke internet.";
  if (error instanceof Error && error.message) return error.message;
  return fallback;
}