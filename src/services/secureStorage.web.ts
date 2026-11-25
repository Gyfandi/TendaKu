const memoryStorage = new Map<string, string>();

function getWebStorage(): Storage | null {
  try {
    if (typeof window !== "undefined") {
      return window.localStorage;
    }
  } catch {
    // localStorage mungkin tidak tersedia pada lingkungan tertentu.
  }

  return null;
}

export const secureStorage = {
  getItem: async (key: string): Promise<string | null> => {
    const storage = getWebStorage();

    if (storage) {
      try {
        return storage.getItem(key);
      } catch {
        // Gunakan penyimpanan sementara jika localStorage gagal.
      }
    }

    return memoryStorage.get(key) ?? null;
  },

  setItem: async (key: string, value: string): Promise<void> => {
    const storage = getWebStorage();

    if (storage) {
      try {
        storage.setItem(key, value);
        return;
      } catch {
        // Gunakan penyimpanan sementara jika localStorage gagal.
      }
    }

    memoryStorage.set(key, value);
  },

  removeItem: async (key: string): Promise<void> => {
    const storage = getWebStorage();

    if (storage) {
      try {
        storage.removeItem(key);
      } catch {
        // Lanjutkan dengan menghapus penyimpanan sementara.
      }
    }

    memoryStorage.delete(key);
  },
};
