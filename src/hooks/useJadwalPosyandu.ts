import { useSignal, useStore, $, useComputed$ } from "@builder.io/qwik";
import type {
  JadwalPosyanduItem,
  JadwalPosyanduCreateRequest,
  JadwalPosyanduUpdateRequest,
} from "~/types";
import { jadwalPosyanduService } from "~/services/jadwal-posyandu.service";

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
    loading.value = true;
    error.value = null;
    try {
      const res = await jadwalPosyanduService.getJadwalList(posyanduId, {
        page: params?.page ?? page.value,
        limit: params?.limit ?? limit.value,
      });
      jadwalList.splice(0, jadwalList.length, ...(res.data || []));
      total.value = res.meta?.totalData ?? 0;
      page.value = res.meta?.currentPage ?? 1;
      limit.value = res.meta?.limit ?? 10;
      // Debug logs
      console.log("[JadwalPosyandu] API response:", res);
      console.log(
        "[JadwalPosyandu] total:",
        total.value,
        "limit:",
        limit.value,
        "page:",
        page.value,
      );
      // If you use useComputed$ for totalPage, log it here too
      // (If not available here, log in the component after import)
    } catch (err: unknown) {
      error.value = (err as Error)?.message || "Gagal memuat jadwal posyandu.";
    } finally {
      loading.value = false;
    }
  });

  const fetchDetail = $(async (id: string) => {
    loading.value = true;
    error.value = null;
    try {
      const res = await jadwalPosyanduService.getJadwalDetail(id);
      console.log("DEBUG raw API response", res);
      const data = res.data || res || {};
      selectedJadwal.value = {
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
      console.log(
        "DEBUG selectedJadwal.value in fetchDetail",
        selectedJadwal.value,
      );
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
