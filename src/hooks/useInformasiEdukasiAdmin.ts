import { useSignal, $ } from "@qwik.dev/core";
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
  const totalPage = useSignal<number>(1);

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
        items.value = (data?.data || []) as InformasiItem[];
        const meta = data?.meta || {};
        const resolvedTotal = (meta.totalData ??
          meta.total ??
          items.value.length) as number;
        const resolvedPage = (meta.currentPage ??
          meta.page ??
          page.value) as number;
        const resolvedLimit = (meta.limit ?? limit.value) as number;
        total.value = resolvedTotal || 0;
        page.value = resolvedPage || 1;
        limit.value = resolvedLimit || 10;
        totalPage.value =
          (meta.totalPage as number) ||
          Math.ceil((total.value || 0) / (limit.value || 10)) ||
          1;
      } catch (err: unknown) {
        const msg = (err as { message?: string })?.message;
        error.value = msg || "Gagal memuat data";
      } finally {
        loading.value = false;
      }
    },
  );

  const fetchDetail = $(async (id: string) => {
    loading.value = true;
    error.value = null;
    try {
      // Guard invalid id (avoid calling detail with non-UUID like "create")
      const isUuid =
        /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(
          id,
        );
      if (!isUuid) return null;
      return (await informasiEdukasiAdminService.detail(id)) as InformasiItem; // Cast to InformasiItem
    } catch (err: unknown) {
      const msg = (err as { message?: string })?.message;
      error.value = msg || "Gagal memuat detail";
      return null;
    } finally {
      loading.value = false;
    }
  });

  const updateItem = $(async (data: InformasiFormData & { id: string }) => {
    loading.value = true;
    error.value = null;
    success.value = null;
    try {
      await informasiEdukasiAdminService.update({
        id: data.id,
        judul: data.judul,
        tipe: data.tipe,
        deskripsi: data.deskripsi,
        file: (data.file as unknown as File) || undefined,
      });
      success.value = "Berhasil memperbarui informasi edukasi";
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
      await informasiEdukasiAdminService.delete(id);
      success.value = "Berhasil menghapus informasi edukasi";
    } catch (err: unknown) {
      const msg = (err as { message?: string })?.message;
      error.value = msg || "Gagal menghapus data";
      throw err;
    } finally {
      loading.value = false;
    }
  });

  const createItem = $(async (data: InformasiFormData) => {
    loading.value = true;
    error.value = null;
    success.value = null;
    try {
      await informasiEdukasiAdminService.create({
        judul: data.judul,
        tipe: data.tipe,
        deskripsi: data.deskripsi,
        file: (data.file as unknown as File) || undefined,
      });
      success.value = "Berhasil menambah informasi edukasi";
    } catch (err: unknown) {
      const msg = (err as { message?: string })?.message;
      error.value = msg || "Gagal menambah data";
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
    page,
    limit,
    fetchList,
    fetchDetail,
    updateItem,
    deleteItem,
    createItem,
    totalPage,
  };
};
