import { useSignal, $ } from "@builder.io/qwik";
import { adminLowonganService } from "~/services/api";
import type {
  LowonganItem,
  LowonganFilterOptions,
  LowonganCreateRequest,
  LowonganUpdateRequest,
} from "~/types/lowongan";

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
      loading.value = true;
      error.value = null;
      try {
        const data = await adminLowonganService.list({
          limit: params.limit ?? limit.value,
          page: params.page ?? page.value,
          nama_lowongan: params.nama_lowongan,
          nama_perusahaan: params.nama_perusahaan,
          jenis_pekerjaan: params.jenis_pekerjaan,
          lokasi: params.lokasi,
          jenis_difasilitas: params.jenis_difasilitas,
          status: params.status,
        });
        items.value = (data?.data || []) as LowonganItem[];
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
      return (await adminLowonganService.detail(id)) as LowonganItem;
    } catch (err: any) {
      error.value = err.message || "Gagal memuat detail";
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
      await adminLowonganService.create(payload as any);
      success.value = "Berhasil menambah lowongan";
    } catch (err: any) {
      error.value = err.message || "Gagal menambah data";
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
      await adminLowonganService.update(id, rest as any);
      success.value = "Berhasil memperbarui lowongan";
    } catch (err: any) {
      error.value = err.message || "Gagal memperbarui data";
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
    } catch (err: any) {
      error.value = err.message || "Gagal menghapus data";
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
