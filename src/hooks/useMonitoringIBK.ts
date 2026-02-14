import { $, useComputed$, useSignal, useStore } from "@builder.io/qwik";
import { extractErrorMessage } from "~/utils/error";
import type {
  MonitoringIBKItem,
  MonitoringIBKCreateRequest,
  MonitoringIBKUpdateRequest,
} from "~/types";
import { monitoringIBKService } from "~/services/monitoring-ibk.service";
import { queryClient, DEFAULT_STALE_TIME } from "~/lib/query";

const KEY_PREFIX = "kader:monitoring-ibk";

interface CachedListData {
  items: MonitoringIBKItem[];
  total: number;
  page: number;
  limit: number;
}

interface UseMonitoringIBKOptions {
  jadwalId: string;
  initialPage?: number;
  initialLimit?: number;
}

export function useMonitoringIBK(options: UseMonitoringIBKOptions) {
  const { jadwalId, initialPage = 1, initialLimit = 10 } = options;

  const loading = useSignal(false);
  const error = useSignal<string | null>(null);
  const success = useSignal<string | null>(null);

  const list = useStore<MonitoringIBKItem[]>([]);
  const total = useSignal(0);
  const page = useSignal(initialPage);
  const limit = useSignal(initialLimit);
  const totalPage = useComputed$(
    () => Math.ceil(total.value / limit.value) || 1,
  );

  const selected = useSignal<MonitoringIBKItem | null>(null);

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
          monitoringIBKService.listByJadwal(jadwalId, {
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
    const cached = queryClient.getQueryData<MonitoringIBKItem>(key);
    if (cached && queryClient.isFresh(key)) {
      selected.value = cached;
      return;
    }

    loading.value = true;

    try {
      const res = await queryClient.fetchQuery(
        key,
        () => monitoringIBKService.detail(id),
        DEFAULT_STALE_TIME,
      );

      // Handle different possible response structures
      const detailData = res.data ?? res ?? null;
      if (detailData) {
        queryClient.setQueryData(key, detailData, DEFAULT_STALE_TIME);
      }
      selected.value = detailData;
    } catch (err: unknown) {
      error.value = extractErrorMessage(err as string);
    } finally {
      loading.value = false;
    }
  });

  const createItem = $(async (payload: MonitoringIBKCreateRequest) => {
    loading.value = true;
    error.value = null;
    success.value = null;
    try {
      await monitoringIBKService.create(payload);
      success.value = "Monitoring berhasil dibuat.";
      queryClient.invalidateQueries(queryClient.buildKey(KEY_PREFIX, jadwalId));
      await fetchList();
    } catch (err: unknown) {
      error.value = extractErrorMessage(err as string);
    } finally {
      loading.value = false;
    }
  });

  const updateItem = $(
    async (id: string, payload: MonitoringIBKUpdateRequest) => {
      loading.value = true;
      error.value = null;
      success.value = null;
      try {
        await monitoringIBKService.update(id, payload);
        success.value = "Monitoring berhasil diupdate.";
        queryClient.invalidateQueries(
          queryClient.buildKey(KEY_PREFIX, jadwalId),
        );
        queryClient.removeQuery(queryClient.buildKey(KEY_PREFIX, "detail", id));
        await fetchList();
      } catch (err: unknown) {
        error.value = extractErrorMessage(err as string);
      } finally {
        loading.value = false;
      }
    },
  );

  const deleteItem = $(async (id: string) => {
    loading.value = true;
    error.value = null;
    success.value = null;
    try {
      await monitoringIBKService.delete(id);
      success.value = "Monitoring berhasil dihapus.";
      queryClient.invalidateQueries(queryClient.buildKey(KEY_PREFIX, jadwalId));
      queryClient.removeQuery(queryClient.buildKey(KEY_PREFIX, "detail", id));
      await fetchList();
    } catch (err: unknown) {
      error.value = extractErrorMessage(err as string);
    } finally {
      loading.value = false;
    }
  });

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
    createItem,
    updateItem,
    deleteItem,
    setPage,
  };
}
