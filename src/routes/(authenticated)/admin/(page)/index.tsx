import { component$ } from "@qwik.dev/core";
import type { DocumentHead } from "@qwik.dev/router";
import {
  adminStatsData,
  adminRecentActivitiesData,
} from "~/data/admin-dashboard-data";
import {
  AdminStatCard,
  AdminRecentActivityTable,
  AdminUserChart,
} from "~/components/admin";
import { RoleDashboardHeader } from "~/components/dashboard"; // Reusing RoleDashboardHeader
import { useAuth } from "~/hooks";

export default component$(() => {
  const { user } = useAuth();
  return (
    <div class="space-y-6">
      <RoleDashboardHeader
        title="Dashboard Admin"
        welcomeMessage="Selamat datang,"
        userName={user.value?.email || "Admin"}
        userRole="admin"
      />

      {/* Main stats - 2 cards in first row */}
      <section
        aria-label="Statistik utama"
        class="grid grid-cols-1 lg:grid-cols-2 gap-3 animate-[fadeInUp_500ms_ease_0ms_both]"
      >
        {adminStatsData.slice(0, 2).map((stat, idx) => (
          <div
            style={{ animationDelay: `${idx * 60}ms` }}
            class="contents"
            key={stat.title}
          >
            <AdminStatCard
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
              description={stat.description}
            />
          </div>
        ))}
      </section>

      {/* Secondary stats - 3 cards in second row */}
      <section
        aria-label="Statistik tambahan"
        class="grid grid-cols-1 md:grid-cols-3 gap-3 animate-[fadeInUp_600ms_ease_60ms_both]"
      >
        {adminStatsData.slice(2, 5).map((stat, idx) => (
          <div
            style={{ animationDelay: `${idx * 60}ms` }}
            class="contents"
            key={stat.title}
          >
            <AdminStatCard
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
              description={stat.description}
            />
          </div>
        ))}
      </section>

      {/* User categories chart - full width */}
      <section class="animate-[fadeInUp_700ms_ease_120ms_both]">
        <AdminUserChart ibkCount={3560} kaderCount={1024} psikologCount={150} />
      </section>

      <section class="animate-[fadeInUp_800ms_ease_180ms_both]">
        <AdminRecentActivityTable activities={adminRecentActivitiesData} />
      </section>
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
