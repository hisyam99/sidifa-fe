import { $, useSignal } from "@builder.io/qwik";
import { kaderLowonganService } from "~/services/api";
import type { LowonganItem, LowonganFilterOptions } from "~/types/lowongan";

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
      loading.value = true;
      error.value = null;
      try {
        page.value = params.page ?? page.value;
        limit.value = params.limit ?? limit.value;

        const data = await kaderLowonganService.list({
          limit: limit.value,
          page: page.value,
          nama_lowongan: params.nama_lowongan,
          nama_perusahaan: params.nama_perusahaan,
          jenis_pekerjaan: params.jenis_pekerjaan,
          lokasi: params.lokasi,
          jenis_difasilitas: params.jenis_difasilitas,
          status: params.status,
        });

        items.value = (data?.data || []) as LowonganItem[];
        const meta = data?.meta || {};
        total.value = meta.totalData ?? meta.total ?? items.value.length;
        totalPage.value =
          meta.totalPage ?? Math.max(1, Math.ceil(total.value / limit.value));
      } catch (err: unknown) {
        error.value = (err as Error)?.message || "Gagal memuat data";
      } finally {
        loading.value = false;
      }
    },
  );

  const fetchDetail = $(async (id: string) => {
    loading.value = true;
    error.value = null;
    try {
      return (await kaderLowonganService.detail(id)) as LowonganItem;
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
