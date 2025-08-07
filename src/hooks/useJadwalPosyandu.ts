import { useSignal, useStore, $ } from "@builder.io/qwik";
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

  const fetchList = $(async (params?: { page?: number; limit?: number }) => {
    loading.value = true;
    error.value = null;
    try {
      const res = await jadwalPosyanduService.getJadwalList(posyanduId, {
        page: params?.page ?? page.value,
        limit: params?.limit ?? limit.value,
      });
      jadwalList.splice(0, jadwalList.length, ...res.data);
      total.value = res.total;
      page.value = res.page;
      limit.value = res.limit;
    } catch (err: any) {
      error.value = err.message || "Gagal memuat jadwal posyandu.";
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
    } catch (err: any) {
      error.value = err.message || "Gagal memuat detail jadwal.";
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
    } catch (err: any) {
      error.value = err.message || "Gagal membuat jadwal.";
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
      } catch (err: any) {
        error.value = err.message || "Gagal mengupdate jadwal.";
      } finally {
        loading.value = false;
      }
    },
  );

  return {
    jadwalList,
    total,
    page,
    limit,
    loading,
    error,
    success,
    selectedJadwal,
    fetchList,
    fetchDetail,
    createJadwal,
    updateJadwal,
  };
}
