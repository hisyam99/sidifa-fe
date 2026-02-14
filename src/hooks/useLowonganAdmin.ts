import { useSignal, $ } from "@builder.io/qwik";
import { adminLowonganService } from "~/services/api";
import { queryClient, DEFAULT_STALE_TIME } from "~/lib/query";
import type {
  LowonganItem,
  LowonganFilterOptions,
  LowonganCreateRequest,
  LowonganUpdateRequest,
} from "~/types/lowongan";

const KEY_PREFIX = "lowongan:admin";

interface CachedListData {
  items: LowonganItem[];
  total: number;
  totalPage: number;
  page: number;
  limit: number;
}

export const useLowonganAdmin = () => {
  const items = useSignal<LowonganItem[]>([]);
  const loading = useSignal(false);
  const error = useSignal<string | null>(null);
  const success = useSignal<string | null>(null);
  const total = useSignal<number>(0);
  const totalPage = useSignal<number>(1);
  const page = useSignal<number>(1);
  const limit = useSignal<number>(10);

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
            adminLowonganService.list({
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
        const resolvedCurrentPage = (meta.currentPage ??
          meta.page ??
          resolvedPage) as number;
        const resolvedCurrentLimit = (meta.limit ?? resolvedLimit) as number;
        const resolvedTotalPage =
          (meta.totalPage as number) ||
          Math.ceil((resolvedTotal || 0) / (resolvedCurrentLimit || 10)) ||
          1;

        const result: CachedListData = {
          items: responseItems,
          total: resolvedTotal || 0,
          totalPage: resolvedTotalPage,
          page: resolvedCurrentPage || 1,
          limit: resolvedCurrentLimit || 10,
        };

        queryClient.setQueryData(key, result, DEFAULT_STALE_TIME);

        items.value = result.items;
        total.value = result.total;
        totalPage.value = result.totalPage;
        page.value = result.page;
        limit.value = result.limit;
      } catch (err: unknown) {
        if (!cached) {
          const msg = (err as { message?: string })?.message;
          error.value = msg || "Gagal memuat data";
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
        () => adminLowonganService.detail(id),
        DEFAULT_STALE_TIME,
      );

      queryClient.setQueryData(key, result, DEFAULT_STALE_TIME);
      return result as LowonganItem;
    } catch (err: unknown) {
      const msg = (err as { message?: string })?.message;
      error.value = msg || "Gagal memuat detail";
      return null;
    } finally {
      loading.value = false;
    }
  });

  const createItem = $(async (payload: LowonganCreateRequest) => {
    loading.value = true;
    error.value = null;
    success.value = null;
    try {
      await adminLowonganService.create(payload);
      success.value = "Berhasil menambah lowongan";
      queryClient.invalidateQueries(KEY_PREFIX);
      // Also invalidate kader lowongan cache since they view the same data
      queryClient.invalidateQueries("lowongan:kader");
    } catch (err: unknown) {
      const msg = (err as { message?: string })?.message;
      error.value = msg || "Gagal menambah data";
      throw err;
    } finally {
      loading.value = false;
    }
  });

  const updateItem = $(async ({ id, ...rest }: LowonganUpdateRequest) => {
    loading.value = true;
    error.value = null;
    success.value = null;
    try {
      await adminLowonganService.update(id, rest);
      success.value = "Berhasil memperbarui lowongan";
      queryClient.invalidateQueries(KEY_PREFIX);
      queryClient.invalidateQueries("lowongan:kader");
    } catch (err: unknown) {
      const msg = (err as { message?: string })?.message;
      error.value = msg || "Gagal memperbarui data";
      throw err;
    } finally {
      loading.value = false;
    }
  });

  const deleteItem = $(async (id: string) => {
    loading.value = true;
    error.value = null;
    success.value = null;
    try {
      await adminLowonganService.delete(id);
      success.value = "Berhasil menghapus lowongan";
      queryClient.invalidateQueries(KEY_PREFIX);
      queryClient.invalidateQueries("lowongan:kader");
    } catch (err: unknown) {
      const msg = (err as { message?: string })?.message;
      error.value = msg || "Gagal menghapus data";
      throw err;
    } finally {
      loading.value = false;
    }
  });

  return {
    items,
    loading,
    error,
    success,
    total,
    totalPage,
    page,
    limit,
    fetchList,
    fetchDetail,
    createItem,
    updateItem,
    deleteItem,
  };
};
