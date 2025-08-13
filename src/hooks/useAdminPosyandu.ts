import { useSignal, $ } from "@builder.io/qwik";
import { adminService } from "~/services/api";
import type { AdminPosyanduItem } from "~/types/admin-posyandu-management";

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
      loading.value = true;
      error.value = null;
      try {
        const response = await adminService.listPosyandu({
          limit: params.limit ?? limit.value,
          page: params.page ?? page.value,
          nama_posyandu: params.nama_posyandu,
        });

        // Transform response to AdminPosyanduItem format
        const rows = Array.isArray(response.data)
          ? (response.data as Array<
              Partial<AdminPosyanduItem> & { deleted_at?: string | null }
            >)
          : [];
        items.value = rows.map(
          (
            item: Partial<AdminPosyanduItem> & { deleted_at?: string | null },
          ) => ({
            ...item,
            status: item.deleted_at ? "Tidak Aktif" : "Aktif",
          }),
        ) as AdminPosyanduItem[];
        totalData.value = response.meta?.count || 0;
        totalPage.value = response.meta?.totalPage || 1;
        page.value = response.meta?.currentPage || 1;
        limit.value = response.meta?.limit || 10;
      } catch (err: unknown) {
        const msg = (err as { message?: string })?.message;
        error.value = msg || "Gagal memuat data posyandu";
        items.value = [];
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
        // Only send required fields for creation
        const createData = {
          nama_posyandu: data.nama_posyandu,
          alamat: data.alamat,
          no_telp: data.no_telp,
        };
        await adminService.createPosyandu(createData);
        success.value = "Berhasil menambah posyandu";
        await fetchList(); // Refresh the list
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
      try {
        // Only send fields that can be updated
        const updateData = {
          id: data.id,
          nama_posyandu: data.nama_posyandu,
          alamat: data.alamat,
          no_telp: data.no_telp,
        };
        await adminService.updatePosyandu(updateData);
        success.value = "Berhasil memperbarui posyandu";
        await fetchList(); // Refresh the list
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
    try {
      await adminService.deletePosyandu(id);
      success.value = "Berhasil menghapus posyandu";
      await fetchList(); // Refresh the list
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
