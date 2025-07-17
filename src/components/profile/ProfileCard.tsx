import { component$ } from "@builder.io/qwik";
import { useAuth } from "~/hooks";
import {
  LuUser,
  LuMail,
  LuHeart,
  LuBrain,
  LuPencil,
  LuShield,
  LuZap,
  LuCheckCircle,
  LuLogOut,
} from "@qwikest/icons/lucide";

export default component$(() => {
  // 1. Hapus `checkAuthStatus` dan ganti dengan `refreshUserData`
  const { user, loading, error, refreshUserData, logout } = useAuth();

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

  const getRoleBenefits = (role: string) => {
    if (role === "kader") {
      return [
        {
          text: "Kelola data kesehatan masyarakat",
          icon: <LuCheckCircle class="w-4 h-4 text-success" />,
        },
        {
          text: "Laporan dan statistik real-time",
          icon: <LuCheckCircle class="w-4 h-4 text-success" />,
        },
        {
          text: "Akses ke layanan psikologis",
          icon: <LuCheckCircle class="w-4 h-4 text-success" />,
        },
      ];
    } else if (role === "psikolog") {
      return [
        {
          text: "Kelola jadwal konseling",
          icon: <LuCheckCircle class="w-4 h-4 text-success" />,
        },
        {
          text: "Rekam medis pasien",
          icon: <LuCheckCircle class="w-4 h-4 text-success" />,
        },
        {
          text: "Kolaborasi dengan posyandu",
          icon: <LuCheckCircle class="w-4 h-4 text-success" />,
        },
      ];
    } else {
      return [
        {
          text: "Akses ke informasi kesehatan",
          icon: <LuCheckCircle class="w-4 h-4 text-success" />,
        },
        {
          text: "Layanan konseling",
          icon: <LuCheckCircle class="w-4 h-4 text-success" />,
        },
      ];
    }
  };

  // Loading skeleton
  if (loading.value) {
    return (
      <div class="container mx-auto px-4 py-8">
        <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar skeleton */}
          <div class="lg:col-span-1">
            <div class="card bg-base-100 shadow-lg">
              <div class="card-body items-center">
                <div class="skeleton w-24 h-24 mb-4"></div>
                <div class="skeleton h-6 w-32 mb-2"></div>
                <div class="skeleton h-4 w-24 mb-2"></div>
                <div class="skeleton h-4 w-20"></div>
              </div>
            </div>
            <div class="mt-6 space-y-3">
              <div class="skeleton h-10 w-full"></div>
              <div class="skeleton h-10 w-full"></div>
              <div class="skeleton h-10 w-full"></div>
            </div>
          </div>
          {/* Main content skeleton */}
          <div class="lg:col-span-3">
            <div class="card bg-base-100 shadow-lg">
              <div class="card-body">
                <div class="skeleton h-8 w-48 mb-6"></div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div class="skeleton h-20 w-full"></div>
                  <div class="skeleton h-20 w-full"></div>
                </div>
                <div class="skeleton h-32 w-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error.value) {
    return (
      <div class="container mx-auto px-4 py-8">
        <div class="card bg-base-100 shadow-lg">
          <div class="card-body text-center">
            <p class="text-error mb-4">{error.value}</p>
            {/* 2. Ganti pemanggilan fungsi di onClick$ */}
            <button class="btn btn-primary" onClick$={() => refreshUserData()}>
              Coba Lagi
            </button>
          </div>
        </div>
      </div>
    );
  }

  // No user state
  if (!user.value) {
    return (
      <div class="container mx-auto px-4 py-8">
        <div class="card bg-base-100 shadow-lg">
          <div class="card-body text-center">
            <p class="text-base-content/70">
              Gagal memuat data profil atau Anda belum login.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Main profile dashboard layout
  return (
    <div class="container mx-auto px-4 py-8">
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <aside class="lg:col-span-1">
          <div class="card bg-base-100 shadow-lg">
            <div class="card-body items-center">
              <div
                class={`${getRoleColor(user.value.role)} rounded-full w-24 h-24 mx-auto mb-4 flex items-center justify-center shadow-xl`}
              >
                <span class="text-3xl font-bold ">
                  {user.value.email.charAt(0).toUpperCase()}
                </span>
              </div>
              <h2 class="font-bold text-lg text-center mb-1 truncate w-full">
                {user.value.email}
              </h2>
              <div class="badge badge-primary gap-2 mb-2">
                {getRoleIcon(user.value.role)}
                <span class="capitalize text-xs">
                  {getRoleDisplayName(user.value.role)}
                </span>
              </div>
              <div class="text-xs text-base-content/60 text-center mb-2">
                ID: {user.value.id}
              </div>
            </div>
          </div>
          <div class="mt-6 space-y-3">
            <button class="btn btn-primary w-full gap-2">
              <LuPencil class="w-4 h-4" /> Edit Profil
            </button>
            <button class="btn btn-outline w-full gap-2">
              <LuShield class="w-4 h-4" /> Ubah Password
            </button>
            <button
              class="btn btn-error w-full gap-2"
              onClick$={() => logout()}
            >
              <LuLogOut class="w-4 h-4" /> Logout
            </button>
          </div>
        </aside>
        {/* Main Content */}
        <main class="lg:col-span-3">
          <div class="card bg-base-100 shadow-lg mb-6">
            <div class="card-body">
              <h1 class="text-2xl md:text-3xl font-bold text-gradient-primary mb-2">
                Profil Pengguna
              </h1>
              <p class="text-base-content/70 text-sm md:text-lg mb-4">
                Informasi detail akun SIDIFA Anda
              </p>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="space-y-4">
                  <div class="flex items-center gap-3 p-3 bg-base-200/50">
                    <LuMail class="w-5 h-5 text-primary flex-shrink-0" />
                    <div class="flex-1 min-w-0">
                      <p class="text-xs text-base-content/60">Email</p>
                      <p class="font-medium text-sm md:text-base truncate">
                        {user.value.email}
                      </p>
                    </div>
                  </div>
                  <div class="flex items-center gap-3 p-3 bg-base-200/50">
                    <LuUser class="w-5 h-5 text-primary flex-shrink-0" />
                    <div class="flex-1 min-w-0">
                      <p class="text-xs text-base-content/60">ID Pengguna</p>
                      <p class="font-medium text-sm md:text-base truncate">
                        {user.value.id}
                      </p>
                    </div>
                  </div>
                  <div class="flex items-center gap-3 p-3 bg-base-200/50">
                    <LuShield class="w-5 h-5 text-primary flex-shrink-0" />
                    <div class="flex-1 min-w-0">
                      <p class="text-xs text-base-content/60">Role</p>
                      <p class="font-medium text-sm md:text-base truncate capitalize">
                        {getRoleDisplayName(user.value.role)}
                      </p>
                    </div>
                  </div>
                </div>
                <div class="space-y-4">
                  <div class="flex items-center gap-3 p-3 bg-base-200/50">
                    <LuCheckCircle class="w-5 h-5 text-success flex-shrink-0" />
                    <div class="flex-1 min-w-0">
                      <p class="text-xs text-base-content/60">Status Akun</p>
                      <p class="font-medium text-sm md:text-base text-success">
                        Aktif & Terverifikasi
                      </p>
                    </div>
                  </div>
                  <div class="flex items-center gap-3 p-3 bg-base-200/50">
                    <LuZap class="w-5 h-5 text-accent flex-shrink-0" />
                    <div class="flex-1 min-w-0">
                      <p class="text-xs text-base-content/60">Manfaat Akun</p>
                      <ul class="space-y-1 mt-1">
                        {getRoleBenefits(user.value.role).map(
                          (benefit, idx) => (
                            <li
                              key={`benefit-${benefit.text}-${idx}`}
                              class="flex items-center gap-2"
                            >
                              {benefit.icon}
                              <span>{benefit.text}</span>
                            </li>
                          ),
                        )}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
});
