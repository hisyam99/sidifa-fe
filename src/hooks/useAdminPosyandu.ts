import { useSignal, $ } from "@builder.io/qwik";
import { adminService } from "~/services/api";
import type { PosyanduDetail } from "~/types";

export const useAdminPosyandu = () => {
  const items = useSignal<PosyanduDetail[]>([]);
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
        nama_posyandu?: string;
      } = {},
    ) => {
      loading.value = true;
      error.value = null;
      try {
        const data = await adminService.listPosyandu({
          limit: params.limit ?? limit.value,
          page: params.page ?? page.value,
          nama_posyandu: params.nama_posyandu,
        });
        items.value = data.data;
        total.value = data.meta?.total || 0;
        page.value = data.meta?.currentPage || 1;
        limit.value = data.meta?.limit || 10;
      } catch (err: any) {
        error.value = err.message || "Gagal memuat data posyandu";
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
      try {
        await adminService.createPosyandu(data);
        success.value = "Berhasil menambah posyandu";
        await fetchList(); // Refresh the list
      } catch (err: any) {
        error.value = err.message || "Gagal menambah posyandu";
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
    }) => {
      loading.value = true;
      error.value = null;
      try {
        await adminService.updatePosyandu(data);
        success.value = "Berhasil memperbarui posyandu";
        await fetchList(); // Refresh the list
      } catch (err: any) {
        error.value = err.message || "Gagal memperbarui posyandu";
      } finally {
        loading.value = false;
      }
    },
  );

  const deleteItem = $(async (id: string) => {
    loading.value = true;
    error.value = null;
    try {
      await adminService.deletePosyandu(id);
      success.value = "Berhasil menghapus posyandu";
      await fetchList(); // Refresh the list
    } catch (err: any) {
      error.value = err.message || "Gagal menghapus posyandu";
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
