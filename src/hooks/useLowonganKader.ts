import { $, useSignal } from "@builder.io/qwik";
import { kaderLowonganService } from "~/services/api";
import { queryClient, DEFAULT_STALE_TIME } from "~/lib/query";
import type { LowonganItem, LowonganFilterOptions } from "~/types/lowongan";

const KEY_PREFIX = "lowongan:kader";

interface CachedListData {
  items: LowonganItem[];
  total: number;
  totalPage: number;
  page: number;
  limit: number;
}

export const useLowonganKader = () => {
  const items = useSignal<LowonganItem[]>([]);
  const loading = useSignal(false);
  const error = useSignal<string | null>(null);
  const total = useSignal(0);
  const totalPage = useSignal(1);
  const page = useSignal(1);
  const limit = useSignal(10);

  const fetchList = $(
    async (
      params: LowonganFilterOptions & { limit?: number; page?: number } = {},
    ) => {
      error.value = null;

      const resolvedPage = params.page ?? page.value;
      const resolvedLimit = params.limit ?? limit.value;

      const key = queryClient.buildKey(
        KEY_PREFIX,
        "list",
        resolvedPage,
        resolvedLimit,
        params.nama_lowongan,
        params.nama_perusahaan,
        params.jenis_pekerjaan,
        params.lokasi,
        params.jenis_difasilitas,
        params.status,
      );

      // Stale-while-revalidate: apply cached data immediately
      const cached = queryClient.getQueryData<CachedListData>(key);
      if (cached) {
        items.value = cached.items;
        total.value = cached.total;
        totalPage.value = cached.totalPage;
        page.value = cached.page;
        limit.value = cached.limit;

        if (queryClient.isFresh(key)) return;
      }

      if (!cached) loading.value = true;

      try {
        const data = await queryClient.fetchQuery(
          key,
          () =>
            kaderLowonganService.list({
              limit: resolvedLimit,
              page: resolvedPage,
              nama_lowongan: params.nama_lowongan,
              nama_perusahaan: params.nama_perusahaan,
              jenis_pekerjaan: params.jenis_pekerjaan,
              lokasi: params.lokasi,
              jenis_difasilitas: params.jenis_difasilitas,
              status: params.status,
            }),
          DEFAULT_STALE_TIME,
        );

        const responseItems = (data?.data || []) as LowonganItem[];
        const meta = data?.meta || {};
        const resolvedTotal = (meta.totalData ??
          meta.total ??
          responseItems.length) as number;
        const resolvedTotalPage =
          (meta.totalPage as number) ??
          Math.max(1, Math.ceil(resolvedTotal / resolvedLimit));

        const result: CachedListData = {
          items: responseItems,
          total: resolvedTotal,
          totalPage: resolvedTotalPage,
          page: resolvedPage,
          limit: resolvedLimit,
        };

        queryClient.setQueryData(key, result, DEFAULT_STALE_TIME);

        items.value = result.items;
        total.value = result.total;
        totalPage.value = result.totalPage;
        page.value = result.page;
        limit.value = result.limit;
      } catch (err: unknown) {
        if (!cached) {
          error.value = (err as Error)?.message || "Gagal memuat data";
        }
      } finally {
        loading.value = false;
      }
    },
  );

  const fetchDetail = $(async (id: string) => {
    error.value = null;

    const key = queryClient.buildKey(KEY_PREFIX, "detail", id);

    // Return cached detail if fresh
    const cached = queryClient.getQueryData<LowonganItem>(key);
    if (cached && queryClient.isFresh(key)) {
      return cached;
    }

    loading.value = true;

    try {
      const result = await queryClient.fetchQuery(
        key,
        () => kaderLowonganService.detail(id),
        DEFAULT_STALE_TIME,
      );

      queryClient.setQueryData(key, result, DEFAULT_STALE_TIME);
      return result as LowonganItem;
    } catch (err: unknown) {
      error.value = (err as Error)?.message || "Gagal memuat detail";
      return null;
    } finally {
      loading.value = false;
    }
  });

  return {
    items,
    loading,
    error,
    total,
    totalPage,
    page,
    limit,
    fetchList,
    fetchDetail,
  };
};
