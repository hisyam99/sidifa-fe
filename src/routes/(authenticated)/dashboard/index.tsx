import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { useAuth } from "~/hooks";
import {
  LuHeart,
  LuBrain,
  LuUsers,
  LuBarChart,
  LuTrendingUp,
  LuCalendar,
  LuFileText,
  LuBell,
  LuSettings,
  LuUser,
  LuLogOut,
  LuArrowRight,
  LuCheckCircle,
  LuClock,
  LuStar,
} from "@qwikest/icons/lucide";

export default component$(() => {
  const { user, logout } = useAuth();

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case "kader":
        return "Kader Posyandu";
      case "psikolog":
        return "Psikolog";
      default:
        return "User";
    }
  };

  const getBadgeClass = (changeType: string) => {
    switch (changeType) {
      case "positive":
        return "badge-success";
      case "negative":
        return "badge-error";
      default:
        return "badge-neutral";
    }
  };

  const getActivityTypeClass = (type: string) => {
    switch (type) {
      case "success":
        return "bg-success/10 text-success";
      case "warning":
        return "bg-warning/10 text-warning";
      default:
        return "bg-info/10 text-info";
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "kader":
        return <LuHeart class="w-6 h-6" />;
      case "psikolog":
        return <LuBrain class="w-6 h-6" />;
      default:
        return <LuUser class="w-6 h-6" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "kader":
        return "bg-gradient-primary";
      case "psikolog":
        return "bg-gradient-secondary";
      default:
        return "bg-gradient-accent";
    }
  };

  const getDashboardStats = (role: string) => {
    if (role === "kader") {
      return [
        {
          title: "Total Penyandang Disabilitas",
          value: "156",
          change: "+12%",
          changeType: "positive",
          icon: <LuUsers class="w-6 h-6" />,
          color: "bg-primary/10 text-primary",
        },
        {
          title: "Kunjungan Bulan Ini",
          value: "89",
          change: "+8%",
          changeType: "positive",
          icon: <LuCalendar class="w-6 h-6" />,
          color: "bg-secondary/10 text-secondary",
        },
        {
          title: "Laporan Terselesaikan",
          value: "23",
          change: "+15%",
          changeType: "positive",
          icon: <LuFileText class="w-6 h-6" />,
          color: "bg-accent/10 text-accent",
        },
        {
          title: "Efisiensi Layanan",
          value: "94%",
          change: "+5%",
          changeType: "positive",
          icon: <LuTrendingUp class="w-6 h-6" />,
          color: "bg-success/10 text-success",
        },
      ];
    } else if (role === "psikolog") {
      return [
        {
          title: "Pasien Aktif",
          value: "28",
          change: "+3",
          changeType: "positive",
          icon: <LuUsers class="w-6 h-6" />,
          color: "bg-primary/10 text-primary",
        },
        {
          title: "Sesi Konseling",
          value: "45",
          change: "+12%",
          changeType: "positive",
          icon: <LuCalendar class="w-6 h-6" />,
          color: "bg-secondary/10 text-secondary",
        },
        {
          title: "Rekam Medis",
          value: "156",
          change: "+8",
          changeType: "positive",
          icon: <LuFileText class="w-6 h-6" />,
          color: "bg-accent/10 text-accent",
        },
        {
          title: "Rating Kepuasan",
          value: "4.8",
          change: "+0.2",
          changeType: "positive",
          icon: <LuStar class="w-6 h-6" />,
          color: "bg-warning/10 text-warning",
        },
      ];
    } else {
      return [
        {
          title: "Total Data",
          value: "0",
          change: "0%",
          changeType: "neutral",
          icon: <LuBarChart class="w-6 h-6" />,
          color: "bg-base-300/10 text-base-content",
        },
      ];
    }
  };

  const getRecentActivities = (role: string) => {
    if (role === "kader") {
      return [
        {
          title: "Pendaftaran Baru",
          description: "Ahmad Fauzi mendaftar sebagai penyandang disabilitas",
          time: "2 jam yang lalu",
          type: "success",
        },
        {
          title: "Kunjungan Posyandu",
          description: "Kunjungan rutin untuk Siti Aminah",
          time: "4 jam yang lalu",
          type: "info",
        },
        {
          title: "Laporan Selesai",
          description: "Laporan bulanan Januari 2024 telah diselesaikan",
          time: "1 hari yang lalu",
          type: "success",
        },
      ];
    } else if (role === "psikolog") {
      return [
        {
          title: "Sesi Konseling",
          description: "Sesi konseling dengan Budi Santoso selesai",
          time: "1 jam yang lalu",
          type: "success",
        },
        {
          title: "Jadwal Baru",
          description: "Jadwal konseling baru untuk Rina Kartika",
          time: "3 jam yang lalu",
          type: "info",
        },
        {
          title: "Rekam Medis",
          description: "Update rekam medis untuk Ahmad Fauzi",
          time: "1 hari yang lalu",
          type: "warning",
        },
      ];
    } else {
      return [
        {
          title: "Selamat Datang",
          description: "Selamat datang di dashboard SIDIFA",
          time: "Baru saja",
          type: "info",
        },
      ];
    }
  };

  const stats = getDashboardStats(user.value?.role || "");
  const activities = getRecentActivities(user.value?.role || "");

  return (
    <div class="min-h-screen bg-gradient-to-br from-primary/5 via-base-100 to-secondary/5">
      <div class="container mx-auto px-4 py-8">
        {/* Header */}
        <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div>
            <h1 class="text-3xl font-bold text-gradient-primary mb-2">
              Dashboard SIDIFA
            </h1>
            <p class="text-base-content/70">
              Selamat datang kembali, {user.value?.email}
            </p>
          </div>
          <div class="flex items-center gap-4 mt-4 lg:mt-0">
            <div
              class={`${getRoleColor(user.value?.role || "")} rounded-full w-12 h-12 flex items-center justify-center shadow-lg`}
            >
              {getRoleIcon(user.value?.role || "")}
            </div>
            <div class="flex flex-col">
              <span class="font-semibold text-sm">
                {getRoleDisplayName(user.value?.role || "")}
              </span>
              <span class="text-xs text-base-content/60">
                {user.value?.email}
              </span>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div
              key={`stat-${stat.title}-${index}`}
              class="card bg-base-100 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div class="card-body">
                <div class="flex items-center justify-between">
                  <div class={`p-3 ${stat.color}`}>{stat.icon}</div>
                  <div
                    class={`badge badge-sm ${getBadgeClass(stat.changeType)}`}
                  >
                    {stat.change}
                  </div>
                </div>
                <div class="mt-4">
                  <h3 class="text-2xl font-bold">{stat.value}</h3>
                  <p class="text-sm text-base-content/70">{stat.title}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Activities */}
          <div class="lg:col-span-2">
            <div class="card bg-base-100 shadow-lg">
              <div class="card-body">
                <div class="flex items-center justify-between mb-6">
                  <h2 class="card-title text-xl">
                    <LuClock class="w-5 h-5 text-primary" />
                    Aktivitas Terbaru
                  </h2>
                  <button class="btn btn-ghost btn-sm gap-2">
                    Lihat Semua
                    <LuArrowRight class="w-4 h-4" />
                  </button>
                </div>
                <div class="space-y-4">
                  {activities.map((activity, index) => (
                    <div
                      key={`activity-${activity.title}-${index}`}
                      class="flex items-start gap-4 p-4 bg-base-200/50"
                    >
                      <div class={`p-2 ${getActivityTypeClass(activity.type)}`}>
                        <LuCheckCircle class="w-4 h-4" />
                      </div>
                      <div class="flex-1">
                        <h4 class="font-semibold text-sm">{activity.title}</h4>
                        <p class="text-sm text-base-content/70">
                          {activity.description}
                        </p>
                        <span class="text-xs text-base-content/50">
                          {activity.time}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div class="lg:col-span-1">
            <div class="card bg-base-100 shadow-lg">
              <div class="card-body">
                <h2 class="card-title text-xl mb-6">
                  <LuSettings class="w-5 h-5 text-primary" />
                  Menu Cepat
                </h2>
                <div class="space-y-3">
                  <a
                    href="/dashboard/profile"
                    class="btn btn-outline btn-primary w-full justify-start gap-3"
                  >
                    <LuUser class="w-4 h-4" />
                    Profil Saya
                  </a>
                  {user.value?.role === "kader" && (
                    <a
                      href="/dashboard/posyandu"
                      class="btn btn-outline btn-secondary w-full justify-start gap-3"
                    >
                      <LuHeart class="w-4 h-4" />
                      Data Posyandu
                    </a>
                  )}
                  {user.value?.role === "psikolog" && (
                    <a
                      href="/dashboard/psikolog"
                      class="btn btn-outline btn-secondary w-full justify-start gap-3"
                    >
                      <LuBrain class="w-4 h-4" />
                      Data Psikolog
                    </a>
                  )}
                  <a
                    href="/dashboard/settings"
                    class="btn btn-outline btn-accent w-full justify-start gap-3"
                  >
                    <LuSettings class="w-4 h-4" />
                    Pengaturan
                  </a>
                  <button
                    onClick$={() => logout()}
                    class="btn btn-outline btn-error w-full justify-start gap-3"
                  >
                    <LuLogOut class="w-4 h-4" />
                    Keluar
                  </button>
                </div>
              </div>
            </div>

            {/* Notifications */}
            <div class="card bg-base-100 shadow-lg mt-6">
              <div class="card-body">
                <div class="flex items-center justify-between mb-4">
                  <h3 class="font-semibold">
                    <LuBell class="w-4 h-4 text-primary inline mr-2" />
                    Notifikasi
                  </h3>
                  <span class="badge badge-primary badge-sm">3</span>
                </div>
                <div class="space-y-3">
                  <div class="flex items-start gap-3 p-3 bg-warning/10">
                    <div class="w-2 h-2 bg-warning rounded-full mt-2"></div>
                    <div>
                      <p class="text-sm font-medium">Update Sistem</p>
                      <p class="text-xs text-base-content/70">
                        Sistem akan diupdate pada pukul 02:00 WIB
                      </p>
                    </div>
                  </div>
                  <div class="flex items-start gap-3 p-3 bg-info/10">
                    <div class="w-2 h-2 bg-info rounded-full mt-2"></div>
                    <div>
                      <p class="text-sm font-medium">Laporan Baru</p>
                      <p class="text-xs text-base-content/70">
                        Laporan bulanan tersedia untuk diunduh
                      </p>
                    </div>
                  </div>
                  <div class="flex items-start gap-3 p-3 bg-success/10">
                    <div class="w-2 h-2 bg-success rounded-full mt-2"></div>
                    <div>
                      <p class="text-sm font-medium">Backup Selesai</p>
                      <p class="text-xs text-base-content/70">
                        Backup data berhasil diselesaikan
                      </p>
                    </div>
                  </div>
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
  title: "Dashboard - SIDIFA",
  meta: [
    {
      name: "description",
      content:
        "Dashboard SIDIFA - Sistem Informasi Digital Posyandu dan Psikolog",
    },
  ],
};
