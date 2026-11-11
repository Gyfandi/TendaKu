import { useCallback, useEffect, useRef, useState } from "react";

import { pesanError } from "@/utils/async";

interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

/**
 * Hook generik untuk menjalankan fungsi async dan mengelola state
 * loading / error / data.
 *
 * `fn` harus stabil (fungsi di luar komponen atau dibungkus useCallback),
 * karena perubahan `fn` akan memicu pemanggilan ulang.
 */
export function useAsync<T>(fn: () => Promise<T>) {
  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    loading: true,
    error: null,
  });
  const requestId = useRef(0);

  const jalankan = useCallback(async () => {
    const id = ++requestId.current;
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const hasil = await fn();
      // Abaikan hasil lama jika sudah ada permintaan baru / komponen sudah unmount.
      if (id === requestId.current) {
        setState({ data: hasil, loading: false, error: null });
      }
    } catch (error) {
      if (id === requestId.current) {
        setState((prev) => ({ ...prev, loading: false, error: pesanError(error) }));
      }
    }
  }, [fn]);

  useEffect(() => {
    void jalankan();
    return () => {
      requestId.current++;
    };
  }, [jalankan]);

  return { ...state, muatUlang: jalankan };
}