import { useSignal, $ } from "@qwik.dev/core";
import { informasiEdukasiKaderService } from "~/services/api";
import type { InformasiItem } from "~/types/informasi";

export const useInformasiEdukasiKader = () => {
  const items = useSignal<InformasiItem[]>([]);
  const loading = useSignal(false);
  const error = useSignal<string | null>(null);
  const total = useSignal<number>(0);
  const totalPage = useSignal<number>(1);
  const page = useSignal<number>(1);
  const limit = useSignal<number>(9);

  const fetchList = $(
    async (
      params: {
        limit?: number;
        page?: number;
        deskripsi?: string;
        judul?: string;
      } = {},
    ) => {
      loading.value = true;
      error.value = null;
      try {
        const data = await informasiEdukasiKaderService.list({
          limit: params.limit ?? limit.value,
          page: params.page ?? page.value,
          deskripsi: params.deskripsi,
          judul: params.judul,
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
        limit.value = resolvedLimit || 9;
        totalPage.value =
          (meta.totalPage as number) ||
          Math.ceil((total.value || 0) / (limit.value || 9)) ||
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
      const isUuid =
        /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(
          id,
        );
      if (!isUuid) return null;
      return (await informasiEdukasiKaderService.detail(id)) as InformasiItem;
    } catch (err: unknown) {
      const msg = (err as { message?: string })?.message;
      error.value = msg || "Gagal memuat detail";
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
