import { useSignal, useStore, $, useComputed$ } from "@builder.io/qwik";
import type {
  JadwalPosyanduItem,
  JadwalPosyanduCreateRequest,
  JadwalPosyanduUpdateRequest,
} from "~/types";
import { jadwalPosyanduService } from "~/services/jadwal-posyandu.service";
import { queryClient, DEFAULT_STALE_TIME } from "~/lib/query";

const KEY_PREFIX = "kader:jadwal-posyandu";

interface CachedListData {
  items: JadwalPosyanduItem[];
  total: number;
  page: number;
  limit: number;
}

interface UseJadwalPosyanduOptions {
  posyanduId: string;
  initialPage?: number;
  initialLimit?: number;
}

export function useJadwalPosyandu(options: UseJadwalPosyanduOptions) {
  const { posyanduId, initialPage = 1, initialLimit = 10 } = options;
  const loading = useSignal(false);
  const error = useSignal<string | null>(null);
  const success = useSignal<string | null>(null);
  const jadwalList = useStore<JadwalPosyanduItem[]>([]);
  const total = useSignal(0);
  const page = useSignal(initialPage);
  const limit = useSignal(initialLimit);
  const selectedJadwal = useSignal<JadwalPosyanduItem | null>(null);
  const totalPage = useComputed$(
    () => Math.ceil(total.value / limit.value) || 1,
  );

  const fetchList = $(async (params?: { page?: number; limit?: number }) => {
    error.value = null;

    const resolvedPage = params?.page ?? page.value;
    const resolvedLimit = params?.limit ?? limit.value;

    const key = queryClient.buildKey(
      KEY_PREFIX,
      posyanduId,
      "list",
      resolvedPage,
      resolvedLimit,
    );

    // Stale-while-revalidate: apply cached data immediately
    const cached = queryClient.getQueryData<CachedListData>(key);
    if (cached) {
      jadwalList.splice(0, jadwalList.length, ...cached.items);
      total.value = cached.total;
      page.value = cached.page;
      limit.value = cached.limit;

      if (queryClient.isFresh(key)) return;
    }

    if (!cached) loading.value = true;

    try {
      const res = await queryClient.fetchQuery(
        key,
        () =>
          jadwalPosyanduService.getJadwalList(posyanduId, {
            page: resolvedPage,
            limit: resolvedLimit,
          }),
        DEFAULT_STALE_TIME,
      );

      const result: CachedListData = {
        items: res.data || [],
        total: res.meta?.totalData ?? 0,
        page: res.meta?.currentPage ?? 1,
        limit: res.meta?.limit ?? 10,
      };

      queryClient.setQueryData(key, result, DEFAULT_STALE_TIME);

      jadwalList.splice(0, jadwalList.length, ...result.items);
      total.value = result.total;
      page.value = result.page;
      limit.value = result.limit;
    } catch (err: unknown) {
      if (!cached) {
        error.value =
          (err as Error)?.message || "Gagal memuat jadwal posyandu.";
      }
    } finally {
      loading.value = false;
    }
  });

  const fetchDetail = $(async (id: string) => {
    error.value = null;

    const key = queryClient.buildKey(KEY_PREFIX, "detail", id);

    // Return cached detail if fresh
    const cached = queryClient.getQueryData<JadwalPosyanduItem>(key);
    if (cached && queryClient.isFresh(key)) {
      selectedJadwal.value = cached;
      return;
    }

    loading.value = true;

    try {
      const res = await queryClient.fetchQuery(
        key,
        () => jadwalPosyanduService.getJadwalDetail(id),
        DEFAULT_STALE_TIME,
      );

      const data = res.data || res || {};
      const detail: JadwalPosyanduItem = {
        ...data,
        tanggal: data?.tanggal ? data.tanggal.substring(0, 10) : "",
        file_name: data?.file_name || "",
        waktu_mulai: data?.waktu_mulai || "",
        waktu_selesai: data?.waktu_selesai || "",
        nama_kegiatan: data?.nama_kegiatan || "",
        jenis_kegiatan: data?.jenis_kegiatan || "",
        deskripsi: data?.deskripsi || "",
        lokasi: data?.lokasi || "",
        posyandu_id: data?.posyandu_id || "",
      };

      queryClient.setQueryData(key, detail, DEFAULT_STALE_TIME);
      selectedJadwal.value = detail;
    } catch (err: unknown) {
      error.value = (err as Error)?.message || "Gagal memuat detail jadwal.";
    } finally {
      loading.value = false;
    }
  });

  const createJadwal = $(async (data: JadwalPosyanduCreateRequest) => {
    loading.value = true;
    error.value = null;
    success.value = null;
    try {
      await jadwalPosyanduService.createJadwal(data);
      success.value = "Jadwal berhasil dibuat.";
      queryClient.invalidateQueries(
        queryClient.buildKey(KEY_PREFIX, posyanduId),
      );
      await fetchList();
    } catch (err: unknown) {
      error.value = (err as Error)?.message || "Gagal membuat jadwal.";
    } finally {
      loading.value = false;
    }
  });

  const updateJadwal = $(
    async (id: string, data: JadwalPosyanduUpdateRequest) => {
      loading.value = true;
      error.value = null;
      success.value = null;
      try {
        await jadwalPosyanduService.updateJadwal(id, data);
        success.value = "Jadwal berhasil diupdate.";
        queryClient.invalidateQueries(
          queryClient.buildKey(KEY_PREFIX, posyanduId),
        );
        queryClient.removeQuery(queryClient.buildKey(KEY_PREFIX, "detail", id));
        await fetchList();
      } catch (err: unknown) {
        error.value = (err as Error)?.message || "Gagal mengupdate jadwal.";
      } finally {
        loading.value = false;
      }
    },
  );

  const deleteJadwal = $(async (id: string) => {
    loading.value = true;
    error.value = null;
    success.value = null;
    try {
      await jadwalPosyanduService.deleteJadwal(id);
      success.value = "Jadwal berhasil dihapus.";
      queryClient.invalidateQueries(
        queryClient.buildKey(KEY_PREFIX, posyanduId),
      );
      queryClient.removeQuery(queryClient.buildKey(KEY_PREFIX, "detail", id));
      await fetchList();
    } catch (err: unknown) {
      error.value = (err as Error)?.message || "Gagal menghapus jadwal.";
    } finally {
      loading.value = false;
    }
  });

  const setPage = $(async (newPage: number) => {
    page.value = newPage;
    await fetchList({ page: newPage, limit: limit.value });
  });

  return {
    jadwalList,
    total,
    page,
    limit,
    totalPage,
    loading,
    error,
    success,
    selectedJadwal,
    fetchList,
    fetchDetail,
    createJadwal,
    updateJadwal,
    deleteJadwal,
    setPage,
  };
}
