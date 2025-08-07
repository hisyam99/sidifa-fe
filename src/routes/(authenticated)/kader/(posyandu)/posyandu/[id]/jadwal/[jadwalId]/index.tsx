import { component$, useSignal, useVisibleTask$ } from "@builder.io/qwik";
import { useLocation } from "@builder.io/qwik-city";
import { jadwalPosyanduService } from "~/services/jadwal-posyandu.service";
import type { JadwalPosyanduItem } from "~/types";

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
      const res = await jadwalPosyanduService.getJadwalDetail(jadwalId);
      jadwal.value = res.data;
    } catch (err: any) {
      error.value = err.message || "Gagal memuat detail jadwal posyandu.";
    } finally {
      loading.value = false;
    }
  });

  return (
    <div class="max-w-2xl mx-auto p-4">
      <h1 class="text-2xl font-bold mb-4">Detail Jadwal Posyandu</h1>
      {loading.value && <div>Memuat data...</div>}
      {error.value && <div class="alert alert-error mb-2">{error.value}</div>}
      {jadwal.value && (
        <div class="card bg-base-100 shadow p-4 mb-6">
          <div class="mb-2">
            <b>Nama Kegiatan:</b> {jadwal.value.nama_kegiatan}
          </div>
          <div class="mb-2">
            <b>Jenis Kegiatan:</b> {jadwal.value.jenis_kegiatan}
          </div>
          <div class="mb-2">
            <b>Deskripsi:</b> {jadwal.value.deskripsi}
          </div>
          <div class="mb-2">
            <b>Lokasi:</b> {jadwal.value.lokasi}
          </div>
          <div class="mb-2">
            <b>Tanggal:</b> {jadwal.value.tanggal?.substring(0, 10)}
          </div>
          <div class="mb-2">
            <b>Waktu:</b> {jadwal.value.waktu_mulai} -{" "}
            {jadwal.value.waktu_selesai}
          </div>
          {jadwal.value.file_url && (
            <div class="mb-2">
              <b>File:</b>{" "}
              <a
                href={jadwal.value.file_url}
                target="_blank"
                class="link link-primary underline"
              >
                {jadwal.value.file_url}
              </a>
            </div>
          )}
          <div class="mb-2">
            <b>Dibuat:</b> {jadwal.value.created_at}
          </div>
          <div class="mb-2">
            <b>Diupdate:</b> {jadwal.value.updated_at}
          </div>
        </div>
      )}
      {/* Section Monitoring */}
      <div class="mb-6">
        <h2 class="text-xl font-semibold mb-2">Monitoring (Coming Soon)</h2>
        <div class="p-4 bg-base-200 rounded">
          Fitur monitoring akan tersedia di sini.
        </div>
      </div>
      {/* Section Presensi */}
      <div>
        <h2 class="text-xl font-semibold mb-2">Presensi (Coming Soon)</h2>
        <div class="p-4 bg-base-200 rounded">
          Fitur presensi akan tersedia di sini.
        </div>
      </div>
    </div>
  );
});
