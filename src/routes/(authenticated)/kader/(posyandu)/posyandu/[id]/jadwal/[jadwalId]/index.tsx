import { component$, useSignal, useVisibleTask$ } from "@builder.io/qwik";
import { useLocation } from "@builder.io/qwik-city";
import { jadwalPosyanduService } from "~/services/jadwal-posyandu.service";
import type { JadwalPosyanduItem } from "~/types";
import {
  LuCalendar,
  LuMapPin,
  LuClock,
  LuFileText,
  LuUser,
  LuBuilding,
  LuClipboardList,
  LuTrendingUp,
  LuUsers,
  LuAlertCircle,
  LuBarChart,
} from "~/components/icons/lucide-optimized";

function mapApiToJadwalItem(apiData: any): JadwalPosyanduItem {
  return {
    id: apiData.id,
    posyandu_id: apiData.posyandu_id,
    nama_kegiatan: apiData.nama_kegiatan,
    jenis_kegiatan: apiData.jenis_kegiatan,
    deskripsi: apiData.deskripsi,
    lokasi: apiData.lokasi,
    tanggal: apiData.tanggal,
    waktu_mulai: apiData.waktu_mulai,
    waktu_selesai: apiData.waktu_selesai,
    file_url: apiData.file_name ? `/uploads/${apiData.file_name}` : undefined,
    created_at: apiData.created_at,
    updated_at: apiData.updated_at,
    posyandu: apiData.posyandu || undefined,
  };
}

export default component$(() => {
  const location = useLocation();
  const jadwalId = location.params.jadwalId as string;
  const loading = useSignal(true);
  const error = useSignal<string | null>(null);
  const jadwal = useSignal<JadwalPosyanduItem | null>(null);
  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(async () => {
    loading.value = true;
    error.value = null;
    try {
      const apiData = await jadwalPosyanduService.getJadwalDetail(jadwalId);
      const data = apiData.data || apiData;
      jadwal.value = mapApiToJadwalItem(data);
    } catch (err: any) {
      error.value = err.message || "Gagal memuat detail jadwal posyandu.";
    } finally {
      loading.value = false;
    }
  });

  return (
    <div class="mx-auto w-full">
      <div class="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 class="text-3xl font-bold flex items-center gap-2">
          <LuClipboardList class="w-8 h-8 text-primary" /> Jadwal Posyandu
          Detail
        </h1>
        {jadwal.value && (
          <span class="badge badge-lg badge-primary text-base-100 font-semibold px-4 py-2 shadow">
            {jadwal.value.nama_kegiatan}
          </span>
        )}
      </div>
      {loading.value && (
        <div class="flex justify-center items-center h-40">
          <span class="loading loading-spinner loading-lg text-primary"></span>
        </div>
      )}
      {error.value && (
        <div class="alert alert-error flex items-center gap-2">
          <LuAlertCircle class="w-6 h-6" /> {error.value}
        </div>
      )}
      {jadwal.value && (
        <div class="card bg-base-100 shadow-xl p-0 overflow-hidden">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-0">
            {/* Info utama */}
            <div class="p-6 flex flex-col gap-4 border-b md:border-b-0 md:border-r border-base-200">
              <div class="flex items-center gap-3">
                <LuUser class="w-6 h-6 text-primary" />
                <span class="font-semibold">Jenis Kegiatan:</span>
                <span class="badge badge-outline badge-info text-info-content ml-2">
                  {jadwal.value.jenis_kegiatan}
                </span>
              </div>
              <div class="flex items-center gap-3">
                <LuCalendar class="w-6 h-6 text-primary" />
                <span class="font-semibold">Tanggal:</span>
                <span class="ml-2">
                  {jadwal.value.tanggal?.substring(0, 10)}
                </span>
              </div>
              <div class="flex items-center gap-3">
                <LuClock class="w-6 h-6 text-primary" />
                <span class="font-semibold">Waktu:</span>
                <span class="ml-2">
                  {jadwal.value.waktu_mulai} - {jadwal.value.waktu_selesai}
                </span>
              </div>
              <div class="flex items-center gap-3">
                <LuMapPin class="w-6 h-6 text-primary" />
                <span class="font-semibold">Lokasi:</span>
                <span class="ml-2">{jadwal.value.lokasi}</span>
              </div>
              {jadwal.value.file_url && (
                <div class="flex items-center gap-3">
                  <LuFileText class="w-6 h-6 text-primary" />
                  <span class="font-semibold">File:</span>
                  <a
                    href={jadwal.value.file_url}
                    target="_blank"
                    class="link link-primary underline ml-2"
                  >
                    Lihat File
                  </a>
                </div>
              )}
              <div class="flex items-center gap-3">
                <LuTrendingUp class="w-6 h-6 text-primary" />
                <span class="font-semibold">Dibuat:</span>
                <span class="ml-2">{jadwal.value.created_at}</span>
              </div>
              <div class="flex items-center gap-3">
                <LuTrendingUp class="w-6 h-6 text-primary" />
                <span class="font-semibold">Diupdate:</span>
                <span class="ml-2">{jadwal.value.updated_at || "-"}</span>
              </div>
            </div>
            {/* Deskripsi & Posyandu */}
            <div class="p-6 flex flex-col gap-6">
              <div>
                <div class="flex items-center gap-2 mb-2">
                  <LuClipboardList class="w-5 h-5 text-primary" />
                  <span class="font-semibold">Deskripsi Kegiatan</span>
                </div>
                <div class="bg-base-200 rounded p-3 text-base-content/80">
                  {jadwal.value.deskripsi}
                </div>
              </div>
              {jadwal.value.posyandu && (
                <div>
                  <div class="flex items-center gap-2 mb-2">
                    <LuBuilding class="w-5 h-5 text-primary" />
                    <span class="font-semibold">Info Posyandu</span>
                  </div>
                  <div class="bg-base-200 rounded p-3 flex flex-col gap-1">
                    <div class="flex items-center gap-2">
                      <LuUsers class="w-4 h-4 text-info" />
                      <span class="font-medium">
                        {jadwal.value.posyandu.nama_posyandu}
                      </span>
                    </div>
                    <div class="flex items-center gap-2">
                      <LuMapPin class="w-4 h-4 text-info" />
                      <span>{jadwal.value.posyandu.alamat}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      {/* Section Monitoring */}
      <div class="mt-8">
        <div class="flex items-center gap-2 mb-2">
          <LuBarChart class="w-5 h-5 text-primary" />
          <h2 class="text-xl font-semibold">
            Monitoring{" "}
            <span class="badge badge-outline badge-sm ml-2">Coming Soon</span>
          </h2>
        </div>
        <div class="p-4 bg-base-200 rounded shadow-sm text-base-content/70">
          Fitur monitoring akan tersedia di sini.
        </div>
      </div>
      {/* Section Presensi */}
      <div class="mt-8">
        <div class="flex items-center gap-2 mb-2">
          <LuCalendar class="w-5 h-5 text-primary" />
          <h2 class="text-xl font-semibold">
            Presensi{" "}
            <span class="badge badge-outline badge-sm ml-2">Coming Soon</span>
          </h2>
        </div>
        <div class="p-4 bg-base-200 rounded shadow-sm text-base-content/70">
          Fitur presensi akan tersedia di sini.
        </div>
      </div>
    </div>
  );
});
