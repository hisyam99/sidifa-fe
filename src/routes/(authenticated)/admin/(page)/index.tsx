import { component$, useSignal, useTask$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { Link } from "@builder.io/qwik-city";
import {
  AdminStatCard,
  AdminRecentActivityTable,
  AdminUserChart,
  AdminPageHeader,
} from "~/components/admin";
import { useAuth } from "~/hooks";
import {
  adminDashboardService,
  type AdminDashboardStats,
  type JadwalKegiatanItem,
} from "~/services/dashboard.service";
import {
  LuBuilding,
  LuClipboardList,
  LuActivity,
  LuUserCheck,
  LuUsers,
  LuSettings,
  LuFileText,
  LuBriefcase,
  LuArrowRight,
} from "~/components/icons/lucide-optimized";

export default component$(() => {
  const { user } = useAuth();
  const stats = useSignal<AdminDashboardStats | null>(null);
  const jadwalKegiatan = useSignal<JadwalKegiatanItem[]>([]);
  const isLoading = useSignal(true);
  const error = useSignal<string | null>(null);

  useTask$(async () => {
    try {
      isLoading.value = true;
      error.value = null;

      const [statsData, jadwalData] = await Promise.all([
        adminDashboardService.getStats(),
        adminDashboardService.getJadwalKegiatan({ page: 1, limit: 10 }),
      ]);

      stats.value = statsData;
      jadwalKegiatan.value = jadwalData.data;
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      error.value = "Gagal memuat data dashboard";
    } finally {
      isLoading.value = false;
    }
  });

  const greeting = (() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Selamat Pagi";
    if (hour < 15) return "Selamat Siang";
    if (hour < 18) return "Selamat Sore";
    return "Selamat Malam";
  })();

  return (
    <div class="space-y-6">
      <AdminPageHeader
        title="Dashboard Admin"
        description="Ringkasan data dan aktivitas terkini sistem Si-DIFA."
      />

      {/* Welcome banner */}
      <section class="rounded-2xl border border-primary/20 bg-linear-to-r from-primary/10 via-primary/5 to-transparent p-5 animate-[fadeInUp_400ms_ease_0ms_both]">
        <p class="text-base text-base-content/80">
          {greeting},{" "}
          <span class="font-semibold text-primary">
            {user.value?.email || "Admin"}
          </span>
          ! Berikut adalah ringkasan terbaru dari sistem Anda.
        </p>
      </section>

      {isLoading.value ? (
        <div class="flex items-center justify-center py-16">
          <span class="loading loading-spinner loading-lg text-primary"></span>
        </div>
      ) : error.value ? (
        <div class="alert alert-error shadow-sm">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5 shrink-0 stroke-current"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>{error.value}</span>
        </div>
      ) : (
        <>
          {/* Stat cards — 4-column grid on large screens */}
          <section
            aria-label="Statistik utama"
            class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 animate-[fadeInUp_500ms_ease_0ms_both]"
          >
            <AdminStatCard
              title="Total Posyandu"
              value={stats.value?.totalPosyandu.toString() || "0"}
              icon={LuBuilding}
              description="Posyandu terdaftar"
            />
            <AdminStatCard
              title="Total Kader"
              value={stats.value?.totalKader.toString() || "0"}
              icon={LuClipboardList}
              description="Kader aktif"
            />
            <AdminStatCard
              title="Total IBK"
              value={stats.value?.totalIbk.toString() || "0"}
              icon={LuActivity}
              description="Ibu dan balita terdaftar"
            />
            <AdminStatCard
              title="Perlu Verifikasi"
              value={stats.value?.kaderNeedVerification.toString() || "0"}
              icon={LuUserCheck}
              description="Menunggu verifikasi"
            />
          </section>

          {/* Chart + Activity — side-by-side on xl, stacked otherwise */}
          <div class="grid grid-cols-1 xl:grid-cols-5 gap-4 xl:min-h-[420px]">
            {/* User chart — takes 2/5 on xl */}
            <section class="xl:col-span-2 animate-[fadeInUp_600ms_ease_60ms_both]">
              <AdminUserChart
                ibkCount={stats.value?.totalIbk || 0}
                kaderCount={stats.value?.totalKader || 0}
                psikologCount={0}
              />
            </section>

            {/* Recent activity table — takes 3/5 on xl */}
            <section class="xl:col-span-3 animate-[fadeInUp_700ms_ease_120ms_both]">
              <AdminRecentActivityTable activities={jadwalKegiatan.value} />
            </section>
          </div>

          {/* ═══════════ AKSI CEPAT ═══════════ */}
          <section
            aria-label="Aksi cepat"
            class="animate-[fadeInUp_800ms_ease_180ms_both]"
          >
            <h2 class="text-sm font-semibold text-base-content/70 uppercase tracking-wider mb-4">
              Aksi Cepat
            </h2>
            <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
              {/* Manajemen Posyandu */}
              <Link
                href="/admin/posyandu"
                class="group relative overflow-hidden rounded-2xl border border-base-300/50 bg-base-100 p-5 shadow-sm hover:shadow-md hover:border-primary/30 transition-all duration-300"
              >
                <div class="pointer-events-none absolute inset-x-0 top-0 h-0.5 bg-linear-to-r from-primary/40 via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div class="flex items-start justify-between gap-3">
                  <div class="min-w-0 flex-1">
                    <div class="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10 text-primary mb-3 transition-transform duration-300 group-hover:scale-110">
                      <LuBuilding class="w-5 h-5" />
                    </div>
                    <h3 class="text-sm font-semibold text-base-content mb-1">
                      Manajemen Posyandu
                    </h3>
                    <p class="text-xs text-base-content/50 line-clamp-2">
                      Kelola data posyandu, lihat detail, dan atur pengaturan
                    </p>
                  </div>
                  <LuArrowRight class="w-4 h-4 text-base-content/30 group-hover:text-primary group-hover:translate-x-0.5 transition-all duration-300 shrink-0 mt-1" />
                </div>
                <div class="pointer-events-none absolute -right-6 -bottom-6 h-20 w-20 rounded-full bg-primary/5 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>

              {/* Verifikasi Akun */}
              <Link
                href="/admin/verifikasi-akun"
                class="group relative overflow-hidden rounded-2xl border border-base-300/50 bg-base-100 p-5 shadow-sm hover:shadow-md hover:border-warning/30 transition-all duration-300"
              >
                <div class="pointer-events-none absolute inset-x-0 top-0 h-0.5 bg-linear-to-r from-warning/40 via-warning/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div class="flex items-start justify-between gap-3">
                  <div class="min-w-0 flex-1">
                    <div class="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-warning/10 text-warning mb-3 transition-transform duration-300 group-hover:scale-110">
                      <LuUserCheck class="w-5 h-5" />
                    </div>
                    <h3 class="text-sm font-semibold text-base-content mb-1">
                      Verifikasi Akun
                    </h3>
                    <p class="text-xs text-base-content/50 line-clamp-2">
                      Verifikasi pendaftaran kader baru yang menunggu
                      persetujuan
                    </p>
                  </div>
                  <LuArrowRight class="w-4 h-4 text-base-content/30 group-hover:text-warning group-hover:translate-x-0.5 transition-all duration-300 shrink-0 mt-1" />
                </div>
                {(stats.value?.kaderNeedVerification ?? 0) > 0 && (
                  <span class="absolute top-4 right-4 inline-flex items-center justify-center min-w-5 h-5 px-1.5 rounded-full bg-warning text-warning-content text-[10px] font-bold tabular-nums">
                    {stats.value?.kaderNeedVerification}
                  </span>
                )}
                <div class="pointer-events-none absolute -right-6 -bottom-6 h-20 w-20 rounded-full bg-warning/5 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>

              {/* Manajemen Kader */}
              <Link
                href="/admin/manajemen-kader"
                class="group relative overflow-hidden rounded-2xl border border-base-300/50 bg-base-100 p-5 shadow-sm hover:shadow-md hover:border-success/30 transition-all duration-300"
              >
                <div class="pointer-events-none absolute inset-x-0 top-0 h-0.5 bg-linear-to-r from-success/40 via-success/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div class="flex items-start justify-between gap-3">
                  <div class="min-w-0 flex-1">
                    <div class="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-success/10 text-success mb-3 transition-transform duration-300 group-hover:scale-110">
                      <LuUsers class="w-5 h-5" />
                    </div>
                    <h3 class="text-sm font-semibold text-base-content mb-1">
                      Manajemen Kader
                    </h3>
                    <p class="text-xs text-base-content/50 line-clamp-2">
                      Lihat dan kelola kader yang terdaftar di seluruh posyandu
                    </p>
                  </div>
                  <LuArrowRight class="w-4 h-4 text-base-content/30 group-hover:text-success group-hover:translate-x-0.5 transition-all duration-300 shrink-0 mt-1" />
                </div>
                <div class="pointer-events-none absolute -right-6 -bottom-6 h-20 w-20 rounded-full bg-success/5 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>

              {/* Manajemen Psikolog */}
              <Link
                href="/admin/manajemen-psikolog"
                class="group relative overflow-hidden rounded-2xl border border-base-300/50 bg-base-100 p-5 shadow-sm hover:shadow-md hover:border-info/30 transition-all duration-300"
              >
                <div class="pointer-events-none absolute inset-x-0 top-0 h-0.5 bg-linear-to-r from-info/40 via-info/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div class="flex items-start justify-between gap-3">
                  <div class="min-w-0 flex-1">
                    <div class="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-info/10 text-info mb-3 transition-transform duration-300 group-hover:scale-110">
                      <LuBriefcase class="w-5 h-5" />
                    </div>
                    <h3 class="text-sm font-semibold text-base-content mb-1">
                      Manajemen Psikolog
                    </h3>
                    <p class="text-xs text-base-content/50 line-clamp-2">
                      Kelola data psikolog dan jadwal konsultasi
                    </p>
                  </div>
                  <LuArrowRight class="w-4 h-4 text-base-content/30 group-hover:text-info group-hover:translate-x-0.5 transition-all duration-300 shrink-0 mt-1" />
                </div>
                <div class="pointer-events-none absolute -right-6 -bottom-6 h-20 w-20 rounded-full bg-info/5 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
            </div>
          </section>

          {/* ═══════════ KELOLA KONTEN ═══════════ */}
          <section
            aria-label="Kelola konten"
            class="animate-[fadeInUp_900ms_ease_240ms_both]"
          >
            <h2 class="text-sm font-semibold text-base-content/70 uppercase tracking-wider mb-4">
              Kelola Konten
            </h2>
            <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {/* Informasi */}
              <Link
                href="/admin/informasi"
                class="group relative overflow-hidden rounded-2xl border border-base-300/50 bg-base-100 shadow-sm hover:shadow-md hover:border-accent/30 transition-all duration-300"
              >
                <div class="pointer-events-none absolute inset-x-0 top-0 h-0.5 bg-linear-to-r from-accent/40 via-accent/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div class="flex items-center gap-4 p-5">
                  <div class="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-accent/10 text-accent shrink-0 transition-transform duration-300 group-hover:scale-110">
                    <LuFileText class="w-5 h-5" />
                  </div>
                  <div class="min-w-0 flex-1">
                    <h3 class="text-sm font-semibold text-base-content mb-0.5">
                      Kelola Informasi
                    </h3>
                    <p class="text-xs text-base-content/50 line-clamp-1">
                      Buat dan kelola konten informasi publik
                    </p>
                  </div>
                  <LuArrowRight class="w-4 h-4 text-base-content/30 group-hover:text-accent group-hover:translate-x-0.5 transition-all duration-300 shrink-0" />
                </div>
              </Link>

              {/* Lowongan */}
              <Link
                href="/admin/lowongan"
                class="group relative overflow-hidden rounded-2xl border border-base-300/50 bg-base-100 shadow-sm hover:shadow-md hover:border-secondary/30 transition-all duration-300"
              >
                <div class="pointer-events-none absolute inset-x-0 top-0 h-0.5 bg-linear-to-r from-secondary/40 via-secondary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div class="flex items-center gap-4 p-5">
                  <div class="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-secondary/10 text-secondary shrink-0 transition-transform duration-300 group-hover:scale-110">
                    <LuBriefcase class="w-5 h-5" />
                  </div>
                  <div class="min-w-0 flex-1">
                    <h3 class="text-sm font-semibold text-base-content mb-0.5">
                      Kelola Lowongan
                    </h3>
                    <p class="text-xs text-base-content/50 line-clamp-1">
                      Buat dan kelola lowongan kader posyandu
                    </p>
                  </div>
                  <LuArrowRight class="w-4 h-4 text-base-content/30 group-hover:text-secondary group-hover:translate-x-0.5 transition-all duration-300 shrink-0" />
                </div>
              </Link>

              {/* Pengaturan */}
              <Link
                href="/admin/settings"
                class="group relative overflow-hidden rounded-2xl border border-base-300/50 bg-base-100 shadow-sm hover:shadow-md hover:border-base-content/20 transition-all duration-300"
              >
                <div class="pointer-events-none absolute inset-x-0 top-0 h-0.5 bg-linear-to-r from-base-content/20 via-base-content/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div class="flex items-center gap-4 p-5">
                  <div class="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-base-200/80 text-base-content/60 shrink-0 transition-transform duration-300 group-hover:scale-110">
                    <LuSettings class="w-5 h-5" />
                  </div>
                  <div class="min-w-0 flex-1">
                    <h3 class="text-sm font-semibold text-base-content mb-0.5">
                      Pengaturan
                    </h3>
                    <p class="text-xs text-base-content/50 line-clamp-1">
                      Konfigurasi sistem dan preferensi admin
                    </p>
                  </div>
                  <LuArrowRight class="w-4 h-4 text-base-content/30 group-hover:text-base-content/60 group-hover:translate-x-0.5 transition-all duration-300 shrink-0" />
                </div>
              </Link>
            </div>
          </section>
        </>
      )}
    </div>
  );
});

export const head: DocumentHead = {
  title: "Admin Dashboard - Si-DIFA",
  meta: [
    {
      name: "description",
      content: "Halaman dashboard untuk admin Si-DIFA",
    },
  ],
};
