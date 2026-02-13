import { component$, useSignal, useTask$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import {
  AdminStatCard,
  AdminRecentActivityTable,
  AdminUserChart,
} from "~/components/admin";
import { RoleDashboardHeader } from "~/components/dashboard";
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

      // Fetch stats
      const statsData = await adminDashboardService.getStats();
      stats.value = statsData;

      // Fetch jadwal kegiatan (limit 10 untuk recent activities)
      const jadwalData = await adminDashboardService.getJadwalKegiatan({
        page: 1,
        limit: 10,
      });
      jadwalKegiatan.value = jadwalData.data;
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      error.value = "Gagal memuat data dashboard";
    } finally {
      isLoading.value = false;
    }
  });

  return (
    <div class="space-y-6">
      <RoleDashboardHeader
        title="Dashboard Admin"
        welcomeMessage="Selamat datang,"
        userName={user.value?.email || "Admin"}
        userRole="admin"
      />

      {isLoading.value ? (
        <div class="flex items-center justify-center py-12">
          <span class="loading loading-spinner loading-lg text-primary"></span>
        </div>
      ) : error.value ? (
        <div class="alert alert-error">
          <span>{error.value}</span>
        </div>
      ) : (
        <>
          {/* Main stats - 2 cards in first row */}
          <section
            aria-label="Statistik utama"
            class="grid grid-cols-1 lg:grid-cols-2 gap-3 animate-[fadeInUp_500ms_ease_0ms_both]"
          >
            <div style={{ animationDelay: "0ms" }} class="contents">
              <AdminStatCard
                title="Total Posyandu"
                value={stats.value?.totalPosyandu.toString() || "0"}
                icon={LuBuilding}
                description="Posyandu terdaftar"
              />
            </div>
            <div style={{ animationDelay: "60ms" }} class="contents">
              <AdminStatCard
                title="Total Kader"
                value={stats.value?.totalKader.toString() || "0"}
                icon={LuClipboardList}
                description="Kader aktif"
              />
            </div>
          </section>

          {/* Secondary stats - 2 cards in second row */}
          <section
            aria-label="Statistik tambahan"
            class="grid grid-cols-1 md:grid-cols-2 gap-3 animate-[fadeInUp_600ms_ease_60ms_both]"
          >
            <div style={{ animationDelay: "0ms" }} class="contents">
              <AdminStatCard
                title="Total IBK"
                value={stats.value?.totalIbk.toString() || "0"}
                icon={LuActivity}
                description="Ibu dan balita terdaftar"
              />
            </div>
            <div style={{ animationDelay: "60ms" }} class="contents">
              <AdminStatCard
                title="Perlu Verifikasi"
                value={stats.value?.kaderNeedVerification.toString() || "0"}
                icon={LuUserCheck}
                description="Menunggu verifikasi"
              />
            </div>
          </section>

          {/* User categories chart - full width */}
          <section class="animate-[fadeInUp_700ms_ease_120ms_both]">
            <AdminUserChart
              ibkCount={stats.value?.totalIbk || 0}
              kaderCount={stats.value?.totalKader || 0}
              psikologCount={0}
            />
          </section>

          {/* Jadwal Kegiatan Table */}
          <section class="animate-[fadeInUp_800ms_ease_180ms_both]">
            <AdminRecentActivityTable activities={jadwalKegiatan.value} />
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
