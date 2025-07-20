import { useSignal, $ } from "@builder.io/qwik";
import { informasiEdukasiAdminService } from "~/services/api";
import type { InformasiItem } from "~/types/informasi"; // Changed to InformasiItem
import type { InformasiFormData } from "~/components/admin/information/InformasiForm"; // Import form data type

export const useInformasiEdukasiAdmin = () => {
  const items = useSignal<InformasiItem[]>([]); // Changed to InformasiItem[]
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
        deskripsi?: string;
        judul?: string;
        tipe?: string; // Added tipe filter
      } = {},
    ) => {
      loading.value = true;
      error.value = null;
      try {
        const data = await informasiEdukasiAdminService.list({
          limit: params.limit ?? limit.value,
          page: params.page ?? page.value,
          deskripsi: params.deskripsi,
          judul: params.judul,
          tipe: params.tipe,
        });
        items.value = data.data as InformasiItem[]; // Cast to InformasiItem[]
        total.value = data.meta?.total || 0;
        page.value = data.meta?.currentPage || 1;
        limit.value = data.meta?.limit || 10;
      } catch (err: any) {
        error.value = err.message || "Gagal memuat data";
      } finally {
        loading.value = false;
      }
    },
  );

  const fetchDetail = $(async (id: string) => {
    loading.value = true;
    error.value = null;
    try {
      return (await informasiEdukasiAdminService.detail(id)) as InformasiItem; // Cast to InformasiItem
    } catch (err: any) {
      error.value = err.message || "Gagal memuat detail";
      return null;
    } finally {
      loading.value = false;
    }
  });

  const updateItem = $(async (data: InformasiFormData & { id: string }) => {
    loading.value = true;
    error.value = null;
    try {
      await informasiEdukasiAdminService.update(data);
      success.value = "Berhasil memperbarui informasi edukasi";
    } catch (err: any) {
      error.value = err.message || "Gagal memperbarui data";
    } finally {
      loading.value = false;
    }
  });

  const deleteItem = $(async (id: string) => {
    loading.value = true;
    error.value = null;
    try {
      await informasiEdukasiAdminService.delete(id);
      success.value = "Berhasil menghapus informasi edukasi";
    } catch (err: any) {
      error.value = err.message || "Gagal menghapus data";
    } finally {
      loading.value = false;
    }
  });

  const createItem = $(async (data: InformasiFormData) => {
    loading.value = true;
    error.value = null;
    try {
      await informasiEdukasiAdminService.create(data);
      success.value = "Berhasil menambah informasi edukasi";
    } catch (err: any) {
      error.value = err.message || "Gagal menambah data";
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
    page,
    limit,
    fetchList,
    fetchDetail,
    updateItem,
    deleteItem,
    createItem,
  };
};
