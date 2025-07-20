import { component$, $, useTask$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { useAuth } from "~/hooks";
import { useNavigate } from "@builder.io/qwik-city";
import {
  DashboardHeader,
  RecentActivityCard,
  ProfileOverviewCard,
  DashboardSidebarNav,
} from "~/components/dashboard";
import { StatisticCard } from "~/components/home"; // Reusing StatisticCard
import {
  getDashboardStats,
  getRecentActivities,
  DashboardStatItem, // Import types
  RecentActivityItem, // Import types
} from "~/data/dashboard-data"; // Corrected import path
import { LuArrowRight } from "~/components/icons/lucide-optimized"; // Updated import path

export default component$(() => {
  const { user, logout, isLoggedIn } = useAuth();
  const nav = useNavigate();

  // Redirect otomatis ke dashboard sesuai role ketika user atau isLoggedIn berubah
  useTask$(({ track }) => {
    track(() => user.value?.role); // Track user role
    track(isLoggedIn);

    // Only attempt redirection if logged in and user role is defined
    if (isLoggedIn.value && user.value?.role) {
      if (user.value?.role === "kader") {
        nav("/kader");
      } else if (user.value?.role === "psikolog") {
        nav("/psikolog");
      } else if (user.value?.role === "admin") {
        nav("/admin");
      }
    }
  });

  const dashboardStats: DashboardStatItem[] = getDashboardStats(
    user.value?.role,
  ); // Explicitly type
  const recentActivities: RecentActivityItem[] = getRecentActivities(
    user.value?.role,
  ); // Explicitly type

  const handleLogout = $(async () => {
    await logout();
    nav("/auth/login");
  });

  return (
    <div class="min-h-screen bg-gradient-to-br from-primary/5 via-base-100 to-secondary/5">
      <div class="container mx-auto px-4 py-8">
        <DashboardHeader
          userName={user.value?.email || "Pengguna"} // Ganti dengan user.value?.name jika tersedia
          userRole={user.value?.role}
          onLogout$={handleLogout}
        />

        <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div class="lg:col-span-1 space-y-6">
            <ProfileOverviewCard
              userName={user.value?.email || "Pengguna"} // Ganti dengan user.value?.name jika tersedia
              userRole={user.value?.role}
              userEmail={user.value?.email || ""}
            />
            <DashboardSidebarNav
              isLoggedIn={isLoggedIn.value}
              userRole={user.value?.role}
              onLogout$={handleLogout}
            />
          </div>

          {/* Main Content */}
          <div class="lg:col-span-3 space-y-6">
            {/* Stats Cards */}
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {dashboardStats.map(
                (
                  stat: DashboardStatItem,
                  index, // Explicitly type stat
                ) => (
                  <StatisticCard
                    key={index}
                    title={stat.title}
                    value={stat.value}
                    description={stat.change}
                    icon={stat.icon}
                    iconBgGradientClass={stat.color}
                    valueTextColorClass={stat.color}
                  />
                ),
              )}
            </div>

            {/* Recent Activities */}
            <div class="card bg-base-100 shadow-lg">
              <div class="card-body p-6">
                <h2 class="card-title text-xl font-bold mb-4">
                  Aktivitas Terbaru
                </h2>
                <div class="space-y-4">
                  {recentActivities.length > 0 ? (
                    recentActivities.map(
                      (
                        activity: RecentActivityItem,
                        index, // Explicitly type activity
                      ) => (
                        <RecentActivityCard
                          key={index}
                          title={activity.title}
                          description={activity.description}
                          time={activity.time}
                          type={activity.type}
                        />
                      ),
                    )
                  ) : (
                    <div class="text-center py-8 text-base-content/70">
                      <p>Belum ada aktivitas terbaru.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Actions/Other Content (example) */}
            <div class="card bg-base-100 shadow-lg">
              <div class="card-body p-6">
                <h2 class="card-title text-xl font-bold mb-4">Aksi Cepat</h2>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {user.value?.role === "kader" && (
                    <a
                      href="/kader/pendataan-ibk"
                      class="btn btn-primary btn-block text-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                    >
                      Pendataan IBK Baru
                      <LuArrowRight class="w-5 h-5" />
                    </a>
                  )}
                  {user.value?.role === "psikolog" && (
                    <a
                      href="/psikolog/sesi/buat"
                      class="btn btn-secondary btn-block text-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                    >
                      Buat Sesi Konseling Baru
                      <LuArrowRight class="w-5 h-5" />
                    </a>
                  )}
                  <a
                    href="/dashboard/profile"
                    class="btn btn-ghost btn-block text-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                  >
                    Lihat Profil
                    <LuArrowRight class="w-5 h-5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Dasbor - SIDIFA",
  meta: [
    {
      name: "description",
      content:
        "Dasbor utama SIDIFA untuk pengelolaan data kesehatan dan konseling penyandang disabilitas.",
    },
  ],
};
