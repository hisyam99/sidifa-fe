import { useSignal, $ } from "@builder.io/qwik";
import { informasiEdukasiAdminService } from "~/services/api";
import { queryClient, DEFAULT_STALE_TIME } from "~/lib/query";
import type { InformasiItem } from "~/types/informasi";
import type { InformasiFormData } from "~/components/admin/information/InformasiForm";

const KEY_PREFIX = "informasi:admin";

interface CachedListData {
  items: InformasiItem[];
  total: number;
  page: number;
  limit: number;
  totalPage: number;
}

export const useInformasiEdukasiAdmin = () => {
  const items = useSignal<InformasiItem[]>([]);
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
        tipe?: string;
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
        params.deskripsi,
        params.judul,
        params.tipe,
      );

      // Stale-while-revalidate: apply cached data immediately
      const cached = queryClient.getQueryData<CachedListData>(key);
      if (cached) {
        items.value = cached.items;
        total.value = cached.total;
        page.value = cached.page;
        limit.value = cached.limit;
        totalPage.value = cached.totalPage;

        if (queryClient.isFresh(key)) return;
      }

      if (!cached) loading.value = true;

      try {
        const data = await queryClient.fetchQuery(
          key,
          () =>
            informasiEdukasiAdminService.list({
              limit: resolvedLimit,
              page: resolvedPage,
              deskripsi: params.deskripsi,
              judul: params.judul,
              tipe: params.tipe,
            }),
          DEFAULT_STALE_TIME,
        );

        const responseItems = (data?.data || []) as InformasiItem[];
        const meta = data?.meta || {};
        const resolvedTotal = (meta.totalData ??
          meta.total ??
          responseItems.length) as number;
        const resolvedCurrentPage = (meta.currentPage ??
          meta.page ??
          resolvedPage) as number;
        const resolvedCurrentLimit = (meta.limit ?? resolvedLimit) as number;
        const resolvedTotalPage =
          (meta.totalPage as number) ||
          Math.ceil((resolvedTotal || 0) / (resolvedCurrentLimit || 10)) ||
          1;

        const result: CachedListData = {
          items: responseItems,
          total: resolvedTotal || 0,
          page: resolvedCurrentPage || 1,
          limit: resolvedCurrentLimit || 10,
          totalPage: resolvedTotalPage,
        };

        queryClient.setQueryData(key, result, DEFAULT_STALE_TIME);

        items.value = result.items;
        total.value = result.total;
        page.value = result.page;
        limit.value = result.limit;
        totalPage.value = result.totalPage;
      } catch (err: unknown) {
        if (!cached) {
          const msg = (err as { message?: string })?.message;
          error.value = msg || "Gagal memuat data";
        }
      } finally {
        loading.value = false;
      }
    },
  );

  const fetchDetail = $(async (id: string) => {
    error.value = null;

    // Guard invalid id (avoid calling detail with non-UUID like "create")
    const isUuid =
      /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(
        id,
      );
    if (!isUuid) return null;

    const key = queryClient.buildKey(KEY_PREFIX, "detail", id);

    // Return cached detail if fresh
    const cached = queryClient.getQueryData<InformasiItem>(key);
    if (cached && queryClient.isFresh(key)) {
      return cached;
    }

    loading.value = true;

    try {
      const result = await queryClient.fetchQuery(
        key,
        () => informasiEdukasiAdminService.detail(id),
        DEFAULT_STALE_TIME,
      );

      queryClient.setQueryData(key, result, DEFAULT_STALE_TIME);
      return result as InformasiItem;
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
      queryClient.invalidateQueries(KEY_PREFIX);
      // Also invalidate kader informasi cache since they view the same data
      queryClient.invalidateQueries("informasi:kader");
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
      queryClient.invalidateQueries(KEY_PREFIX);
      queryClient.invalidateQueries("informasi:kader");
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
      queryClient.invalidateQueries(KEY_PREFIX);
      queryClient.invalidateQueries("informasi:kader");
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
