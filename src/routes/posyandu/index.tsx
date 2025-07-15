// File: /sidifa-fev2/src/routes/posyandu/index.tsx

import { component$, useSignal, useStore, $ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { StatisticsCard, IBKCard } from "~/components/ui";
import type { PosyanduActivity, IBKRecord, IBKStatistics } from "~/types";
import {
  LuCalendar,
  LuUsers,
  LuPlus,
  LuEye,
  LuClock,
  LuMapPin,
  LuUserCheck,
  LuClipboardList,
  LuBrain,
  LuShield,
  LuFileText,
  LuDownload,
  LuCalendarDays,
} from "@qwikest/icons/lucide"; // Keep all necessary imports here
import { useAuth } from "~/hooks/useAuth";

// REMOVE: The DASHBOARD_ICON_MAP is no longer needed here as StatisticsCard now handles the lookup internally.

export default component$(() => {
  const { user } = useAuth();
  const currentView = useSignal<"calendar" | "list">("calendar");
  const showAddActivityModal = useSignal(false);

  // Mock data - In real app, this would come from API
  const statistics = useStore<IBKStatistics>({
    total_ibk: 58,
    total_aktif: 45,
    total_tidak_aktif: 13,
    by_disability_type: {
      fisik: 18,
      intelektual: 22,
      mental: 8,
      sensorik: 10,
    },
    by_age_group: {
      "0-5": 15,
      "6-12": 28,
      "13-18": 10,
      "19-25": 3,
      "25+": 2,
    },
    by_kecamatan: [
      { kecamatan: "Bedali", jumlah: 35 },
      { kecamatan: "Sekaran", jumlah: 15 },
      { kecamatan: "Tanjungsari", jumlah: 8 },
    ],
    visit_stats: {
      total_kunjungan_bulan_ini: 127,
      rata_rata_kunjungan_per_ibk: 2.2,
      ibk_butuh_follow_up: 12,
    },
  });

  const upcomingActivities = useStore<PosyanduActivity[]>([
    {
      id: "1",
      posyandu_id: "posyandu-bedali",
      nama_kegiatan: "Pemeriksaan Rutin Bulanan",
      deskripsi: "Pemeriksaan kesehatan rutin untuk semua IBK terdaftar",
      tipe_kegiatan: "pemeriksaan_rutin",
      tanggal: "2024-01-15",
      waktu_mulai: "08:00",
      waktu_selesai: "12:00",
      lokasi: "Balai Desa Bedali",
      target_peserta: "semua_ibk",
      estimasi_peserta: 30,
      peserta_hadir: 0,
      kader_penanggung_jawab: ["kader-1", "kader-2"],
      status: "scheduled",
      created_by: "koordinator-1",
      created_at: "2024-01-10T10:00:00Z",
      updated_at: "2024-01-10T10:00:00Z",
    },
    {
      id: "2",
      posyandu_id: "posyandu-bedali",
      nama_kegiatan: "Penyuluhan Gizi dan Stimulasi Dini",
      deskripsi:
        "Edukasi untuk keluarga tentang gizi dan stimulasi dini anak disabilitas",
      tipe_kegiatan: "edukasi",
      tanggal: "2024-01-20",
      waktu_mulai: "09:00",
      waktu_selesai: "11:00",
      lokasi: "Balai Desa Bedali",
      target_peserta: "keluarga",
      estimasi_peserta: 25,
      peserta_hadir: 0,
      kader_penanggung_jawab: ["kader-1"],
      status: "scheduled",
      created_by: "koordinator-1",
      created_at: "2024-01-12T14:00:00Z",
      updated_at: "2024-01-12T14:00:00Z",
    },
  ]);

  const recentIBK = useStore<IBKRecord[]>([
    {
      personal_data: {
        id: "ibk-1",
        nama_lengkap: "Ahmad Rizki",
        nik: "3374012345678901",
        tempat_lahir: "Semarang",
        tanggal_lahir: "2018-05-15",
        gender: "laki-laki",
        agama: "Islam",
        alamat_lengkap: "Jl. Bedali Raya No. 123",
        rt_rw: "003/002",
        kecamatan: "Bedali",
        kabupaten: "Semarang",
        provinsi: "Jawa Tengah",
        kode_pos: "50188",
        no_telp: "082334567890",
        nama_ayah: "Bambang Sutrisno",
        nama_ibu: "Sari Wulandari",
        created_at: "2024-01-05T10:00:00Z",
        updated_at: "2024-01-10T15:30:00Z",
      },
      disability_info: {
        ibk_id: "ibk-1",
        jenis_disabilitas: ["intelektual"],
        deskripsi_kondisi: "Keterlambatan perkembangan kognitif ringan",
        tingkat_keparahan: "ringan",
        created_at: "2024-01-05T10:00:00Z",
        updated_at: "2024-01-05T10:00:00Z",
      },
      visit_history: [
        {
          ibk_id: "ibk-1",
          kader_id: "kader-1",
          tanggal_kunjungan: "2024-01-08",
          keluhan_utama: "Perkembangan bicara masih terlambat",
          perkembangan_bahasa: "terlambat",
          intervensi_diberikan: ["stimulasi_bicara", "terapi_wicara"],
          catatan_kader: "Anak menunjukkan kemajuan dalam interaksi sosial",
          created_at: "2024-01-08T14:00:00Z",
          updated_at: "2024-01-08T14:00:00Z",
        },
      ],
      posyandu_id: "posyandu-bedali",
      status: "active",
      total_kunjungan: 3,
      last_visit: "2024-01-08",
      next_scheduled_visit: "2024-01-15",
    },
  ]);

  const handleAddActivity = $(() => {
    showAddActivityModal.value = true;
  });

  const handleViewAttendance = $((activityId: string) => {
    console.log("View attendance for activity:", activityId);
    // Navigate to attendance page
  });

  const handleViewReports = $(() => {
    console.log("Navigate to reports page");
    // Navigate to reports page
  });

  // Check if user is admin for additional permissions
  const isCoordinator = user.value?.role === "admin";

  return (
    <main class="min-h-screen bg-gradient-to-br from-primary/5 via-base-100 to-secondary/5">
      <div class="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div class="flex items-center justify-between mb-8">
          <div>
            <h1 class="text-3xl lg:text-4xl font-bold text-gradient-primary mb-2">
              Dashboard Posyandu
            </h1>
            <p class="text-base-content/70 text-lg">
              Selamat datang kembali! Kelola kegiatan dan pantau perkembangan
              IBK di wilayah Anda.
            </p>
          </div>

          {isCoordinator && (
            <button
              class="btn btn-primary gap-2 shadow-lg"
              onClick$={handleAddActivity}
            >
              <LuPlus class="w-5 h-5" />
              Tambah Jadwal Baru
            </button>
          )}
        </div>

        {/* Statistics Overview */}
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatisticsCard
            title="Total IBK Terdaftar"
            value={statistics.total_ibk}
            description="Individu berkebutuhan khusus"
            icon="LuUsers" // FIX: Pass string name
            color="primary"
            trend={{
              value: 8.5,
              isPositive: true,
              label: "dari bulan lalu",
            }}
          />

          <StatisticsCard
            title="IBK Aktif"
            value={statistics.total_aktif}
            description="Rutin mengikuti kegiatan"
            icon="LuActivity" // FIX: Pass string name
            color="success"
            trend={{
              value: 5.2,
              isPositive: true,
              label: "dari bulan lalu",
            }}
          />

          <StatisticsCard
            title="Kunjungan Bulan Ini"
            value={statistics.visit_stats.total_kunjungan_bulan_ini}
            description="Total kunjungan pemeriksaan"
            icon="LuCalendar" // FIX: Pass string name
            color="secondary"
            trend={{
              value: 12.3,
              isPositive: true,
              label: "dari bulan lalu",
            }}
          />

          <StatisticsCard
            title="Butuh Follow-up"
            value={statistics.visit_stats.ibk_butuh_follow_up}
            description="IBK memerlukan perhatian khusus"
            icon="LuAlertTriangle" // FIX: Pass string name
            color="warning"
            onClick$={$(() => {
              console.log("Navigate to follow-up list");
            })}
          />
        </div>

        {/* Disability Distribution Chart */}
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <StatisticsCard
            title="Distribusi Jenis Disabilitas"
            value={`${statistics.by_disability_type.fisik + statistics.by_disability_type.intelektual + statistics.by_disability_type.mental + statistics.by_disability_type.sensorik}`}
            description="Total IBK berdasarkan jenis disabilitas"
            icon="LuHeart" // FIX: Pass string name
            color="secondary"
            size="lg"
            showChart={true}
            chartData={[
              {
                label: "Disabilitas Fisik",
                value: statistics.by_disability_type.fisik,
                color: "bg-primary",
              },
              {
                label: "Disabilitas Intelektual",
                value: statistics.by_disability_type.intelektual,
                color: "bg-secondary",
              },
              {
                label: "Disabilitas Mental",
                value: statistics.by_disability_type.mental,
                color: "bg-accent",
              },
              {
                label: "Disabilitas Sensorik",
                value: statistics.by_disability_type.sensorik,
                color: "bg-info",
              },
            ]}
          />

          <StatisticsCard
            title="Distribusi Wilayah"
            value={statistics.by_kecamatan.length}
            description="Kecamatan yang terlayani"
            icon="LuMapPin" // FIX: Pass string name
            color="accent"
            size="lg"
            showChart={true}
            chartData={statistics.by_kecamatan.map((item, index) => ({
              label: item.kecamatan,
              value: item.jumlah,
              color:
                index === 0
                  ? "bg-primary"
                  : index === 1
                    ? "bg-secondary"
                    : "bg-accent",
            }))}
          />
        </div>

        {/* Schedule & Activities Section */}
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Calendar/Schedule View */}
          <div class="lg:col-span-2">
            <div class="card bg-base-100 shadow-lg border border-base-200/50">
              <div class="card-body">
                <div class="flex items-center justify-between mb-6">
                  <h2 class="card-title text-xl">Jadwal & Kegiatan Posyandu</h2>
                  <div class="flex items-center gap-2">
                    <div class="btn-group">
                      <button
                        class={`btn btn-sm ${currentView.value === "calendar" ? "btn-primary" : "btn-ghost"}`}
                        onClick$={() => (currentView.value = "calendar")}
                      >
                        <LuCalendar class="w-4 h-4" />
                        Kalender
                      </button>
                      <button
                        class={`btn btn-sm ${currentView.value === "list" ? "btn-primary" : "btn-ghost"}`}
                        onClick$={() => (currentView.value = "list")}
                      >
                        <LuClipboardList class="w-4 h-4" />
                        Daftar
                      </button>
                    </div>
                  </div>
                </div>

                {/* Activities List */}
                <div class="space-y-4">
                  {upcomingActivities.map((activity) => (
                    <div
                      key={activity.id}
                      class="border border-base-200 rounded-lg p-4 hover:bg-base-50 transition-colors"
                    >
                      <div class="flex items-start justify-between">
                        <div class="flex-1">
                          <div class="flex items-center gap-3 mb-2">
                            <div
                              class={`w-3 h-3 rounded-full ${
                                activity.status === "scheduled"
                                  ? "bg-info"
                                  : activity.status === "ongoing"
                                    ? "bg-warning"
                                    : activity.status === "completed"
                                      ? "bg-success"
                                      : "bg-error"
                              }`}
                            ></div>
                            <h3 class="font-semibold text-base-content">
                              {activity.nama_kegiatan}
                            </h3>
                            <div
                              class={`badge badge-sm ${
                                activity.tipe_kegiatan === "pemeriksaan_rutin"
                                  ? "badge-primary"
                                  : activity.tipe_kegiatan === "edukasi"
                                    ? "badge-secondary"
                                    : activity.tipe_kegiatan === "konseling"
                                      ? "badge-accent"
                                      : "badge-info"
                              }`}
                            >
                              {activity.tipe_kegiatan === "pemeriksaan_rutin"
                                ? "Pemeriksaan"
                                : activity.tipe_kegiatan === "edukasi"
                                  ? "Edukasi"
                                  : activity.tipe_kegiatan === "konseling"
                                    ? "Konseling"
                                    : activity.tipe_kegiatan}
                            </div>
                          </div>

                          <p class="text-sm text-base-content/70 mb-3">
                            {activity.deskripsi}
                          </p>

                          <div class="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                            <div class="flex items-center gap-2">
                              <LuCalendarDays class="w-4 h-4 text-primary/70" />
                              <span>
                                {new Date(activity.tanggal).toLocaleDateString(
                                  "id-ID",
                                  {
                                    day: "numeric",
                                    month: "long",
                                    year: "numeric",
                                  },
                                )}
                              </span>
                            </div>

                            <div class="flex items-center gap-2">
                              <LuClock class="w-4 h-4 text-primary/70" />
                              <span>
                                {activity.waktu_mulai} -{" "}
                                {activity.waktu_selesai}
                              </span>
                            </div>

                            <div class="flex items-center gap-2">
                              <LuMapPin class="w-4 h-4 text-primary/70" />
                              <span>{activity.lokasi}</span>
                            </div>
                          </div>
                        </div>

                        <div class="flex flex-col gap-2 ml-4">
                          <button
                            class="btn btn-ghost btn-sm gap-2"
                            onClick$={() => handleViewAttendance(activity.id)}
                          >
                            <LuUserCheck class="w-4 h-4" />
                            Presensi
                          </button>

                          <div class="text-xs text-center text-base-content/60">
                            {activity.estimasi_peserta} peserta
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {upcomingActivities.length === 0 && (
                  <div class="text-center py-8">
                    <LuCalendar class="w-16 h-16 text-base-content/30 mx-auto mb-4" />
                    <p class="text-base-content/70">
                      Belum ada kegiatan yang dijadwalkan
                    </p>
                    {isCoordinator && (
                      <button
                        class="btn btn-primary btn-sm mt-4 gap-2"
                        onClick$={handleAddActivity}
                      >
                        <LuPlus class="w-4 h-4" />
                        Tambah Jadwal Pertama
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Quick Actions & Reports */}
          <div class="space-y-6">
            {/* Quick Actions */}
            <div class="card bg-base-100 shadow-lg border border-base-200/50">
              <div class="card-body">
                <h3 class="card-title text-lg mb-4">Aksi Cepat</h3>
                <div class="space-y-3">
                  <a
                    href="/posyandu/pendataan-ibk"
                    class="btn btn-ghost w-full justify-start gap-3"
                  >
                    <LuUsers class="w-5 h-5 text-primary" />
                    Pendataan IBK
                  </a>

                  <button
                    class="btn btn-ghost w-full justify-start gap-3"
                    onClick$={handleViewReports}
                  >
                    <LuFileText class="w-5 h-5 text-secondary" />
                    Laporan Posyandu
                  </button>

                  <a
                    href="/posyandu/informasi-edukasi"
                    class="btn btn-ghost w-full justify-start gap-3"
                  >
                    <LuBrain class="w-5 h-5 text-accent" />
                    Materi Edukasi
                  </a>

                  <a
                    href="/posyandu/lowongan-pekerjaan"
                    class="btn btn-ghost w-full justify-start gap-3"
                  >
                    <LuShield class="w-5 h-5 text-info" />
                    Lowongan Kerja
                  </a>
                </div>
              </div>
            </div>

            {/* Monthly Report Export */}
            <div class="card bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/20 shadow-lg">
              <div class="card-body">
                <h3 class="card-title text-lg mb-2">Laporan Bulanan</h3>
                <p class="text-sm text-base-content/70 mb-4">
                  Export laporan kegiatan posyandu bulan ini
                </p>
                <button class="btn btn-primary btn-sm gap-2 w-full">
                  <LuDownload class="w-4 h-4" />
                  Download Laporan PDF
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Recent IBK Updates */}
        <div class="mb-8">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-2xl font-bold text-base-content">IBK Terbaru</h2>
            <a href="/posyandu/pendataan-ibk" class="btn btn-ghost gap-2">
              <LuEye class="w-4 h-4" />
              Lihat Semua
            </a>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentIBK.map((ibk) => (
              <IBKCard
                key={ibk.personal_data.id}
                ibk={ibk}
                compact={true}
                onView$={$(() =>
                  console.log("View IBK:", ibk.personal_data.id),
                )}
                onEdit$={$(() =>
                  console.log("Edit IBK:", ibk.personal_data.id),
                )}
              />
            ))}
          </div>

          {recentIBK.length === 0 && (
            <div class="text-center py-12">
              <LuUsers class="w-16 h-16 text-base-content/30 mx-auto mb-4" />
              <p class="text-lg font-medium text-base-content/70 mb-2">
                Belum ada data IBK
              </p>
              <p class="text-base-content/60 mb-6">
                Mulai dengan menambahkan data IBK pertama di wilayah Anda
              </p>
              <a href="/posyandu/pendataan-ibk" class="btn btn-primary gap-2">
                <LuPlus class="w-5 h-5" />
                Tambah Data IBK
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Add Activity Modal */}
      {showAddActivityModal.value && (
        <div class="modal modal-open">
          <div class="modal-box max-w-2xl">
            <h3 class="font-bold text-lg mb-4">Tambah Jadwal Kegiatan Baru</h3>
            <p class="text-base-content/70 mb-6">
              Buat jadwal kegiatan posyandu untuk IBK dan keluarga
            </p>

            {/* Quick form would go here */}
            <div class="text-center py-8 border-2 border-dashed border-base-300 rounded-lg">
              <LuCalendar class="w-12 h-12 text-base-content/30 mx-auto mb-4" />
              <p class="text-base-content/60">
                Form tambah kegiatan akan ditampilkan di sini
              </p>
            </div>

            <div class="modal-action">
              <button
                class="btn btn-ghost"
                onClick$={() => (showAddActivityModal.value = false)}
              >
                Batal
              </button>
              <button class="btn btn-primary">Simpan Jadwal</button>
            </div>
          </div>
          <div
            class="modal-backdrop"
            onClick$={() => (showAddActivityModal.value = false)}
          ></div>
        </div>
      )}
    </main>
  );
});

export const head: DocumentHead = {
  title: "Dashboard Posyandu | SIDIFA",
  meta: [
    {
      name: "description",
      content:
        "Dashboard posyandu untuk mengelola jadwal kegiatan, pemantauan IBK, dan laporan bulanan di SIDIFA.",
    },
    {
      property: "og:title",
      content: "Dashboard Posyandu | SIDIFA",
    },
    {
      property: "og:description",
      content:
        "Kelola kegiatan posyandu dan pantau perkembangan IBK dengan mudah.",
    },
  ],
};
