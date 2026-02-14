import { $, useComputed$, useSignal, useStore } from "@builder.io/qwik";
import { extractErrorMessage } from "~/utils/error";
import type { PresensiIBKItem, PresensiStatus } from "~/types";
import { presensiIBKService } from "~/services/presensi-ibk.service";
import { queryClient, DEFAULT_STALE_TIME } from "~/lib/query";

const KEY_PREFIX = "kader:presensi-ibk";

interface CachedListData {
  items: PresensiIBKItem[];
  total: number;
  page: number;
  limit: number;
}

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
    error.value = null;

    const resolvedPage = params?.page ?? page.value;
    const resolvedLimit = params?.limit ?? limit.value;

    const key = queryClient.buildKey(
      KEY_PREFIX,
      jadwalId,
      "list",
      resolvedPage,
      resolvedLimit,
    );

    // Stale-while-revalidate: apply cached data immediately
    const cached = queryClient.getQueryData<CachedListData>(key);
    if (cached) {
      list.splice(0, list.length, ...cached.items);
      total.value = cached.total;
      page.value = cached.page;
      limit.value = cached.limit;

      if (queryClient.isFresh(key)) return;
    }

    if (!cached) loading.value = true;

    try {
      const res = await queryClient.fetchQuery(
        key,
        () =>
          presensiIBKService.listByJadwal(jadwalId, {
            page: resolvedPage,
            limit: resolvedLimit,
          }),
        DEFAULT_STALE_TIME,
      );

      const result: CachedListData = {
        items: res.data || [],
        total: res.meta?.totalData ?? res.data?.length ?? 0,
        page: res.meta?.currentPage ?? resolvedPage,
        limit: res.meta?.limit ?? resolvedLimit,
      };

      queryClient.setQueryData(key, result, DEFAULT_STALE_TIME);

      list.splice(0, list.length, ...result.items);
      total.value = result.total;
      page.value = result.page;
      limit.value = result.limit;
    } catch (err: unknown) {
      if (!cached) {
        error.value = extractErrorMessage(err as string);
      }
    } finally {
      loading.value = false;
    }
  });

  const fetchDetail = $(async (id: string) => {
    error.value = null;

    const key = queryClient.buildKey(KEY_PREFIX, "detail", id);

    // Return cached detail if fresh
    const cached = queryClient.getQueryData<PresensiIBKItem>(key);
    if (cached && queryClient.isFresh(key)) {
      selected.value = cached;
      return;
    }

    loading.value = true;

    try {
      const res = await queryClient.fetchQuery(
        key,
        () => presensiIBKService.detail(id),
        DEFAULT_STALE_TIME,
      );

      const detail = res.data ?? null;
      if (detail) {
        queryClient.setQueryData(key, detail, DEFAULT_STALE_TIME);
      }
      selected.value = detail;
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
      queryClient.invalidateQueries(queryClient.buildKey(KEY_PREFIX, jadwalId));
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
      queryClient.invalidateQueries(queryClient.buildKey(KEY_PREFIX, jadwalId));
      queryClient.removeQuery(queryClient.buildKey(KEY_PREFIX, "detail", id));
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
        queryClient.invalidateQueries(
          queryClient.buildKey(KEY_PREFIX, jadwalId),
        );
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
