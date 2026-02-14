import { component$, useSignal, useTask$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
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
          <div class="grid grid-cols-1 xl:grid-cols-5 gap-4">
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
