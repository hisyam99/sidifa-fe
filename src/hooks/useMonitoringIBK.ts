import { $, useComputed$, useSignal, useStore } from "@builder.io/qwik";
import { extractErrorMessage } from "~/utils/error";
import type {
  MonitoringIBKItem,
  MonitoringIBKCreateRequest,
  MonitoringIBKUpdateRequest,
} from "~/types";
import { monitoringIBKService } from "~/services/monitoring-ibk.service";

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
    loading.value = true;
    error.value = null;
    try {
      const res = await monitoringIBKService.listByJadwal(jadwalId, {
        page: params?.page ?? page.value,
        limit: params?.limit ?? limit.value,
      });
      list.splice(0, list.length, ...(res.data || []));
      total.value = res.meta?.totalData ?? res.data?.length ?? 0;
      page.value = res.meta?.currentPage ?? page.value;
      limit.value = res.meta?.limit ?? limit.value;
    } catch (err: any) {
      error.value = extractErrorMessage(err);
    } finally {
      loading.value = false;
    }
  });

  const fetchDetail = $(async (id: string) => {
    loading.value = true;
    error.value = null;
    try {
      const res = await monitoringIBKService.detail(id);
      selected.value = res.data || (res as any);
    } catch (err: any) {
      error.value = extractErrorMessage(err);
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
      await fetchList();
    } catch (err: any) {
      error.value = extractErrorMessage(err);
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
        await fetchList();
      } catch (err: any) {
        error.value = extractErrorMessage(err);
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
    createItem,
    updateItem,
    setPage,
  };
}
