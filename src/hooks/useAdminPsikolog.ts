import { useSignal, $ } from "@builder.io/qwik";
import { adminService } from "~/services/api";
import { queryClient, DEFAULT_STALE_TIME } from "~/lib/query";
import type { AdminPsikologItem } from "~/types/admin-psikolog-management";

const KEY_PREFIX = "admin:psikolog";

interface CachedListData {
  items: AdminPsikologItem[];
  total: number;
  page: number;
  limit: number;
}

export const useAdminPsikolog = () => {
  const items = useSignal<AdminPsikologItem[]>([]);
  const loading = useSignal(false);
  const error = useSignal<string | null>(null);
  const success = useSignal<string | null>(null);
  const total = useSignal<number>(0);
  const page = useSignal<number>(1);
  const limit = useSignal<number>(10);

  const fetchList = $(
    async (
      params: {
        limit?: number;
        page?: number;
        nama?: string;
        spesialisasi?: string;
        status?: "Aktif" | "Tidak Aktif" | "";
      } = {},
    ) => {
      error.value = null;

      const resolvedPage = params.page ?? page.value;
      const resolvedLimit = params.limit ?? limit.value;

      const key = queryClient.buildKey(
        KEY_PREFIX,
        "list",
        resolvedPage,
        resolvedLimit,
        params.nama,
        params.spesialisasi,
        params.status,
      );

      // Stale-while-revalidate: apply cached data immediately
      const cached = queryClient.getQueryData<CachedListData>(key);
      if (cached) {
        items.value = cached.items;
        total.value = cached.total;
        page.value = cached.page;
        limit.value = cached.limit;

        if (queryClient.isFresh(key)) return;
      }

      if (!cached) loading.value = true;

      try {
        const response = await queryClient.fetchQuery(
          key,
          () =>
            adminService.listPsikolog({
              limit: resolvedLimit,
              page: resolvedPage,
              nama: params.nama,
              spesialisasi: params.spesialisasi,
              status: params.status,
            }),
          DEFAULT_STALE_TIME,
        );

        const result: CachedListData = {
          items: response.data as AdminPsikologItem[],
          total: response.meta?.total || 0,
          page: response.meta?.currentPage || 1,
          limit: response.meta?.limit || 10,
        };

        queryClient.setQueryData(key, result, DEFAULT_STALE_TIME);

        items.value = result.items;
        total.value = result.total;
        page.value = result.page;
        limit.value = result.limit;
      } catch (err: unknown) {
        if (!cached) {
          error.value = (err as Error)?.message || "Gagal memuat data psikolog";
        }
      } finally {
        loading.value = false;
      }
    },
  );

  const createItem = $(
    async (data: {
      nama: string;
      email: string;
      no_telp: string;
      spesialisasi: string;
    }) => {
      loading.value = true;
      error.value = null;
      success.value = null;
      try {
        await adminService.createPsikolog(data);
        success.value = "Berhasil menambah psikolog";
        queryClient.invalidateQueries(KEY_PREFIX);
        await fetchList();
      } catch (err: unknown) {
        error.value = (err as Error)?.message || "Gagal menambah psikolog";
      } finally {
        loading.value = false;
      }
    },
  );

  const updateItem = $(
    async (data: {
      id: string;
      nama?: string;
      email?: string;
      no_telp?: string;
      spesialisasi?: string;
      status?: "Aktif" | "Tidak Aktif";
    }) => {
      loading.value = true;
      error.value = null;
      success.value = null;
      try {
        await adminService.updatePsikolog(data);
        success.value = "Berhasil memperbarui psikolog";
        queryClient.invalidateQueries(KEY_PREFIX);
        await fetchList();
      } catch (err: unknown) {
        error.value = (err as Error)?.message || "Gagal memperbarui psikolog";
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
      await adminService.deletePsikolog(id);
      success.value = "Berhasil menghapus psikolog";
      queryClient.invalidateQueries(KEY_PREFIX);
      await fetchList();
    } catch (err: unknown) {
      error.value = (err as Error)?.message || "Gagal menghapus psikolog";
    } finally {
      loading.value = false;
    }
  });

  const clearMessages = $(() => {
    error.value = null;
    success.value = null;
  });

  return {
    items,
    loading,
    error,
    success,
    total,
    page,
    limit,
    fetchList,
    createItem,
    updateItem,
    deleteItem,
    clearMessages,
  };
};
