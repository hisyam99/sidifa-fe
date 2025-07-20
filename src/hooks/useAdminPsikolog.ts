import { useSignal, $ } from "@builder.io/qwik";
import { adminService } from "~/services/api";
import type { AdminPsikologItem } from "~/types/admin-psikolog-management";

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
      loading.value = true;
      error.value = null;
      try {
        const response = await adminService.listPsikolog({
          limit: params.limit ?? limit.value,
          page: params.page ?? page.value,
          nama: params.nama,
          spesialisasi: params.spesialisasi,
          status: params.status,
        });

        items.value = response.data as AdminPsikologItem[];
        total.value = response.meta?.total || 0;
        page.value = response.meta?.currentPage || 1;
        limit.value = response.meta?.limit || 10;
      } catch (err: any) {
        error.value = err.message || "Gagal memuat data psikolog";
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
      try {
        await adminService.createPsikolog(data);
        success.value = "Berhasil menambah psikolog";
        await fetchList();
      } catch (err: any) {
        error.value = err.message || "Gagal menambah psikolog";
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
      try {
        await adminService.updatePsikolog(data);
        success.value = "Berhasil memperbarui psikolog";
        await fetchList();
      } catch (err: any) {
        error.value = err.message || "Gagal memperbarui psikolog";
      } finally {
        loading.value = false;
      }
    },
  );

  const deleteItem = $(async (id: string) => {
    loading.value = true;
    error.value = null;
    try {
      await adminService.deletePsikolog(id);
      success.value = "Berhasil menghapus psikolog";
      await fetchList();
    } catch (err: any) {
      error.value = err.message || "Gagal menghapus psikolog";
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
