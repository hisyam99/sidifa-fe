import { useSignal, $ } from "@builder.io/qwik";
import { adminService } from "~/services/api";
import { queryClient, DEFAULT_STALE_TIME } from "~/lib/query";
import type { AdminPosyanduItem } from "~/types/admin-posyandu-management";

const KEY_PREFIX = "admin:posyandu";

interface CachedListData {
  items: AdminPosyanduItem[];
  totalData: number;
  totalPage: number;
  page: number;
  limit: number;
}

export const useAdminPosyandu = () => {
  const items = useSignal<AdminPosyanduItem[]>([]);
  const loading = useSignal(false);
  const error = useSignal<string | null>(null);
  const success = useSignal<string | null>(null);
  const totalData = useSignal<number>(0);
  const totalPage = useSignal<number>(1);
  const page = useSignal<number>(1);
  const limit = useSignal<number>(10);

  const fetchList = $(
    async (
      params: {
        limit?: number;
        page?: number;
        nama_posyandu?: string;
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
        params.nama_posyandu,
      );

      // Stale-while-revalidate: apply cached data immediately
      const cached = queryClient.getQueryData<CachedListData>(key);
      if (cached) {
        items.value = cached.items;
        totalData.value = cached.totalData;
        totalPage.value = cached.totalPage;
        page.value = cached.page;
        limit.value = cached.limit;

        // If data is still fresh, skip the network request entirely
        if (queryClient.isFresh(key)) return;
        // Otherwise fall through to background refetch (no loading spinner)
      }

      // Only show loading spinner when there is no cached data to display
      if (!cached) loading.value = true;

      try {
        const response = await queryClient.fetchQuery(
          key,
          () =>
            adminService.listPosyandu({
              limit: resolvedLimit,
              page: resolvedPage,
              nama_posyandu: params.nama_posyandu,
            }),
          DEFAULT_STALE_TIME,
        );

        // Transform response to AdminPosyanduItem format
        const rows = Array.isArray(response.data)
          ? (response.data as Array<
              Partial<AdminPosyanduItem> & { deleted_at?: string | null }
            >)
          : [];
        const transformed = rows.map(
          (
            item: Partial<AdminPosyanduItem> & { deleted_at?: string | null },
          ) => ({
            ...item,
            status: item.deleted_at ? "Tidak Aktif" : "Aktif",
          }),
        ) as AdminPosyanduItem[];

        const result: CachedListData = {
          items: transformed,
          totalData: response.meta?.count || 0,
          totalPage: response.meta?.totalPage || 1,
          page: response.meta?.currentPage || 1,
          limit: response.meta?.limit || 10,
        };

        // Update cache with the transformed result for instant re-use
        queryClient.setQueryData(key, result, DEFAULT_STALE_TIME);

        items.value = result.items;
        totalData.value = result.totalData;
        totalPage.value = result.totalPage;
        page.value = result.page;
        limit.value = result.limit;
      } catch (err: unknown) {
        // Only surface the error if there was no cached fallback
        if (!cached) {
          const msg = (err as { message?: string })?.message;
          error.value = msg || "Gagal memuat data posyandu";
          items.value = [];
        }
      } finally {
        loading.value = false;
      }
    },
  );

  const createItem = $(
    async (data: {
      nama_posyandu: string;
      alamat: string;
      no_telp: string;
    }) => {
      loading.value = true;
      error.value = null;
      success.value = null;
      try {
        const createData = {
          nama_posyandu: data.nama_posyandu,
          alamat: data.alamat,
          no_telp: data.no_telp,
        };
        await adminService.createPosyandu(createData);
        success.value = "Berhasil menambah posyandu";
        queryClient.invalidateQueries(KEY_PREFIX);
        await fetchList();
      } catch (err: unknown) {
        const msg = (err as { message?: string })?.message;
        error.value = msg || "Gagal menambah posyandu";
      } finally {
        loading.value = false;
      }
    },
  );

  const updateItem = $(
    async (data: {
      id: string;
      nama_posyandu?: string;
      alamat?: string;
      no_telp?: string;
      status?: "Aktif" | "Tidak Aktif";
    }) => {
      loading.value = true;
      error.value = null;
      success.value = null;
      try {
        const updateData = {
          id: data.id,
          nama_posyandu: data.nama_posyandu,
          alamat: data.alamat,
          no_telp: data.no_telp,
        };
        await adminService.updatePosyandu(updateData);
        success.value = "Berhasil memperbarui posyandu";
        queryClient.invalidateQueries(KEY_PREFIX);
        await fetchList();
      } catch (err: unknown) {
        const msg = (err as { message?: string })?.message;
        error.value = msg || "Gagal memperbarui posyandu";
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
      await adminService.deletePosyandu(id);
      success.value = "Berhasil menghapus posyandu";
      queryClient.invalidateQueries(KEY_PREFIX);
      await fetchList();
    } catch (err: unknown) {
      const msg = (err as { message?: string })?.message;
      error.value = msg || "Gagal menghapus posyandu";
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
    totalData,
    totalPage,
    page,
    limit,
    fetchList,
    createItem,
    updateItem,
    deleteItem,
    clearMessages,
  };
};
