import { $, useComputed$, useSignal, useStore } from "@builder.io/qwik";
import { extractErrorMessage } from "~/utils/error";
import type { PresensiIBKItem, PresensiStatus } from "~/types";
import { presensiIBKService } from "~/services/presensi-ibk.service";

interface UsePresensiIBKOptions {
  jadwalId: string;
  initialPage?: number;
  initialLimit?: number;
}

export function usePresensiIBK(options: UsePresensiIBKOptions) {
  const { jadwalId, initialPage = 1, initialLimit = 10 } = options;

  const loading = useSignal(false);
  const error = useSignal<string | null>(null);
  const success = useSignal<string | null>(null);

  const list = useStore<PresensiIBKItem[]>([]);
  const total = useSignal(0);
  const page = useSignal(initialPage);
  const limit = useSignal(initialLimit);
  const totalPage = useComputed$(
    () => Math.ceil(total.value / limit.value) || 1,
  );

  const selected = useSignal<PresensiIBKItem | null>(null);

  const fetchList = $(async (params?: { page?: number; limit?: number }) => {
    loading.value = true;
    error.value = null;
    try {
      const res = await presensiIBKService.listByJadwal(jadwalId, {
        page: params?.page ?? page.value,
        limit: params?.limit ?? limit.value,
      });
      list.splice(0, list.length, ...(res.data || []));
      total.value = res.meta?.totalData ?? res.data?.length ?? 0;
      page.value = res.meta?.currentPage ?? page.value;
      limit.value = res.meta?.limit ?? limit.value;
    } catch (err: unknown) {
      error.value = extractErrorMessage(err as string);
    } finally {
      loading.value = false;
    }
  });

  const fetchDetail = $(async (id: string) => {
    loading.value = true;
    error.value = null;
    try {
      const res = await presensiIBKService.detail(id);
      selected.value = res.data ?? null;
    } catch (err: unknown) {
      error.value = extractErrorMessage(err as string);
    } finally {
      loading.value = false;
    }
  });

  const addToPresensi = $(async (payload: { user_ibk_id: string }) => {
    loading.value = true;
    error.value = null;
    success.value = null;
    try {
      await presensiIBKService.add({ ...payload, jadwal_id: jadwalId });
      success.value = "Berhasil menambahkan IBK ke presensi.";
      await fetchList();
    } catch (err: unknown) {
      error.value = extractErrorMessage(err as string);
    } finally {
      loading.value = false;
    }
  });

  const updateStatus = $(async (id: string, status: PresensiStatus) => {
    loading.value = true;
    error.value = null;
    success.value = null;
    try {
      await presensiIBKService.updateStatus(id, status);
      success.value = "Status presensi berhasil diperbarui.";
      await fetchList();
    } catch (err: unknown) {
      error.value = extractErrorMessage(err as string);
    } finally {
      loading.value = false;
    }
  });

  const bulkUpdateStatus = $(
    async (
      updates: Array<{ user_ibk_id: string; status_presensi: PresensiStatus }>,
    ) => {
      loading.value = true;
      error.value = null;
      success.value = null;
      try {
        await presensiIBKService.bulkUpdate(jadwalId, updates);
        success.value = "Status presensi berhasil diperbarui (bulk).";
        await fetchList();
      } catch (err: unknown) {
        error.value = extractErrorMessage(err as string);
      } finally {
        loading.value = false;
      }
    },
  );

  const setPage = $(async (newPage: number) => {
    page.value = newPage;
    await fetchList({ page: newPage, limit: limit.value });
  });

  return {
    list,
    total,
    page,
    limit,
    totalPage,
    loading,
    error,
    success,
    selected,
    fetchList,
    fetchDetail,
    addToPresensi,
    updateStatus,
    bulkUpdateStatus,
    setPage,
  };
}
