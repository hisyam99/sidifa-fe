import { component$ } from "@qwik.dev/core";
import type { DocumentHead } from "@qwik.dev/router";
import {
  adminStatsData,
  adminRecentActivitiesData,
} from "~/data/admin-dashboard-data";
import { AdminStatCard, AdminRecentActivityTable } from "~/components/admin";
import { RoleDashboardHeader } from "~/components/dashboard"; // Reusing RoleDashboardHeader
import { useAuth } from "~/hooks";

export default component$(() => {
  const { user } = useAuth();
  return (
    <div>
      <RoleDashboardHeader
        title="Dashboard Admin"
        welcomeMessage="Selamat datang,"
        userName={user.value?.email || "Admin"}
        userRole="admin"
      />

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {adminStatsData.map((stat) => (
          <AdminStatCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            description={stat.description}
          />
        ))}
      </div>

      <AdminRecentActivityTable activities={adminRecentActivitiesData} />
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
