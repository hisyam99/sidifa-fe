import { component$, useSignal, $ } from "@builder.io/qwik";
import { type DocumentHead } from "@builder.io/qwik-city";
import { jadwalPosyanduService } from "~/services/jadwal-posyandu.service";
import type { IBKJadwalPosyanduResponse } from "~/types";
import {
  LuCalendar,
  LuClock,
  LuMapPin,
  LuUser,
  LuPhone,
  LuCheckCircle,
  LuAlertCircle,
  LuSearch,
} from "~/components/icons/lucide-optimized";

export default component$(() => {
  const nik = useSignal("");
  const jadwalData = useSignal<IBKJadwalPosyanduResponse | null>(null);
  const loading = useSignal(false);
  const error = useSignal("");

  const handleSearch = $(async () => {
    if (!nik.value.trim()) {
      error.value = "NIK harus diisi";
      return;
    }

    loading.value = true;
    error.value = "";
    jadwalData.value = null;

    try {
      const response = await jadwalPosyanduService.getJadwalByNIK(nik.value);
      jadwalData.value = response;
    } catch (err: unknown) {
      error.value =
        (err as { response?: { data?: { message?: string } } }).response?.data
          ?.message || "Gagal mengambil data. Pastikan NIK sudah terdaftar.";
    } finally {
      loading.value = false;
    }
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; class: string }> = {
      BELUM_HADIR: { label: "Belum Hadir", class: "badge-warning" },
      HADIR: { label: "Hadir", class: "badge-success" },
      TIDAK_HADIR: { label: "Tidak Hadir", class: "badge-error" },
    };
    return statusMap[status] || { label: status, class: "badge-ghost" };
  };

  return (
    <div class="min-h-screen bg-gradient-to-br from-primary/5 via-base-100 to-secondary/5">
      <div class="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div class="text-center mb-8">
          <h1 class="text-4xl font-bold text-primary mb-2">Jadwal Posyandu</h1>
          <p class="text-base-content/70">
            Cek jadwal dan status kehadiran Anda
          </p>
        </div>

        {/* Search Form */}
        <div class="card bg-base-100 shadow-xl mb-8">
          <div class="card-body">
            <h2 class="card-title text-2xl mb-4">
              <LuSearch class="w-6 h-6 text-primary" />
              Cari Data Berdasarkan NIK
            </h2>
            <div class="form-control">
              <label class="label">
                <span class="label-text font-semibold">NIK</span>
              </label>
              <div class="flex gap-2">
                <input
                  type="text"
                  placeholder="Masukkan NIK Anda"
                  class="input input-bordered flex-1"
                  value={nik.value}
                  onInput$={(e) =>
                    (nik.value = (e.target as HTMLInputElement).value)
                  }
                  onKeyPress$={(e) => {
                    if (e.key === "Enter") {
                      handleSearch();
                    }
                  }}
                />
                <button
                  class="btn btn-primary"
                  onClick$={handleSearch}
                  disabled={loading.value}
                >
                  {loading.value ? (
                    <span class="loading loading-spinner loading-sm"></span>
                  ) : (
                    <LuSearch class="w-5 h-5" />
                  )}
                  Cari
                </button>
              </div>
            </div>

            {error.value && (
              <div class="alert alert-error mt-4">
                <LuAlertCircle class="w-5 h-5" />
                <span>{error.value}</span>
              </div>
            )}
          </div>
        </div>

        {/* Results */}
        {jadwalData.value && (
          <div class="space-y-6">
            {/* IBK Information */}
            <div class="card bg-base-100 shadow-xl">
              <div class="card-body">
                <h2 class="card-title text-2xl mb-4">
                  <LuUser class="w-6 h-6 text-primary" />
                  Informasi Peserta
                </h2>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p class="text-sm text-base-content/70">Nama</p>
                    <p class="font-semibold text-lg">
                      {jadwalData.value.ibk.nama}
                    </p>
                  </div>
                  <div>
                    <p class="text-sm text-base-content/70">NIK</p>
                    <p class="font-semibold text-lg">
                      {jadwalData.value.ibk.nik}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Presensi Information */}
            <div class="card bg-base-100 shadow-xl border-2 border-primary/20">
              <div class="card-body">
                <h2 class="card-title text-2xl mb-4">
                  <LuCheckCircle class="w-6 h-6 text-primary" />
                  Status Presensi
                </h2>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div class="stats shadow">
                    <div class="stat">
                      <div class="stat-title">Status Kehadiran</div>
                      <div class="stat-value text-2xl">
                        <span
                          class={`badge ${getStatusBadge(jadwalData.value.presensi_ibk.status_presensi).class} badge-lg`}
                        >
                          {
                            getStatusBadge(
                              jadwalData.value.presensi_ibk.status_presensi,
                            ).label
                          }
                        </span>
                      </div>
                    </div>
                  </div>
                  <div class="stats shadow">
                    <div class="stat">
                      <div class="stat-title">Nomor Antrian</div>
                      <div class="stat-value text-primary">
                        {jadwalData.value.presensi_ibk.antrian_ke}
                      </div>
                      <div class="stat-desc">
                        Anda antrian ke-
                        {jadwalData.value.presensi_ibk.antrian_ke}
                      </div>
                    </div>
                  </div>
                </div>
                <div class="mt-4">
                  <p class="text-sm text-base-content/70">Waktu Kedatangan</p>
                  <p class="font-semibold text-lg flex items-center gap-2">
                    <LuClock class="w-5 h-5 text-primary" />
                    {jadwalData.value.presensi_ibk.waktu_datang}
                  </p>
                </div>
                {jadwalData.value.presensi_ibk.updated_at && (
                  <div class="mt-2">
                    <p class="text-sm text-base-content/70">
                      Terakhir Diperbarui
                    </p>
                    <p class="font-medium">
                      {formatDate(jadwalData.value.presensi_ibk.updated_at)}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Jadwal Posyandu */}
            <div class="card bg-base-100 shadow-xl">
              <div class="card-body">
                <h2 class="card-title text-2xl mb-4">
                  <LuCalendar class="w-6 h-6 text-primary" />
                  Jadwal Kegiatan
                </h2>
                <div class="space-y-4">
                  <div>
                    <p class="text-sm text-base-content/70">Nama Kegiatan</p>
                    <p class="font-semibold text-lg">
                      {jadwalData.value.jadwal_posyandu.nama_kegiatan}
                    </p>
                  </div>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p class="text-sm text-base-content/70">Jenis Kegiatan</p>
                      <p class="font-medium">
                        {jadwalData.value.jadwal_posyandu.jenis_kegiatan}
                      </p>
                    </div>
                    <div>
                      <p class="text-sm text-base-content/70">Tanggal</p>
                      <p class="font-medium flex items-center gap-2">
                        <LuCalendar class="w-4 h-4 text-primary" />
                        {formatDate(jadwalData.value.jadwal_posyandu.tanggal)}
                      </p>
                    </div>
                  </div>
                  <div>
                    <p class="text-sm text-base-content/70">Waktu</p>
                    <p class="font-medium flex items-center gap-2">
                      <LuClock class="w-4 h-4 text-primary" />
                      {jadwalData.value.jadwal_posyandu.waktu_mulai} -{" "}
                      {jadwalData.value.jadwal_posyandu.waktu_selesai}
                    </p>
                  </div>
                  <div>
                    <p class="text-sm text-base-content/70">Lokasi</p>
                    <p class="font-medium flex items-start gap-2">
                      <LuMapPin class="w-4 h-4 text-primary mt-1" />
                      {jadwalData.value.jadwal_posyandu.lokasi}
                    </p>
                  </div>
                  <div>
                    <p class="text-sm text-base-content/70">Deskripsi</p>
                    <p class="font-medium">
                      {jadwalData.value.jadwal_posyandu.deskripsi}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Posyandu Information */}
            <div class="card bg-base-100 shadow-xl">
              <div class="card-body">
                <h2 class="card-title text-2xl mb-4">
                  <LuMapPin class="w-6 h-6 text-primary" />
                  Informasi Posyandu
                </h2>
                <div class="space-y-3">
                  <div>
                    <p class="text-sm text-base-content/70">Nama Posyandu</p>
                    <p class="font-semibold text-lg">
                      {jadwalData.value.jadwal_posyandu.posyandu.nama_posyandu}
                    </p>
                  </div>
                  <div>
                    <p class="text-sm text-base-content/70">Alamat</p>
                    <p class="font-medium">
                      {jadwalData.value.jadwal_posyandu.posyandu.alamat}
                    </p>
                  </div>
                  <div>
                    <p class="text-sm text-base-content/70">No. Telepon</p>
                    <p class="font-medium flex items-center gap-2">
                      <LuPhone class="w-4 h-4 text-primary" />
                      {jadwalData.value.jadwal_posyandu.posyandu.no_telp}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!jadwalData.value && !loading.value && !error.value && (
          <div class="card bg-base-100 shadow-xl">
            <div class="card-body text-center py-16">
              <LuCalendar class="w-24 h-24 mx-auto text-base-content/20 mb-4" />
              <h3 class="text-xl font-semibold text-base-content/70">
                Masukkan NIK untuk melihat jadwal
              </h3>
              <p class="text-base-content/50">
                Data jadwal posyandu dan status presensi akan ditampilkan di
                sini
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Jadwal Posyandu - SIDIFA",
  meta: [
    {
      name: "description",
      content: "Cek jadwal posyandu dan status kehadiran Anda berdasarkan NIK",
    },
  ],
};
