import { component$ } from "@builder.io/qwik";
import { useAuth } from "~/hooks";
import {
  LuUser,
  LuMail,
  LuPencil,
  LuShield,
  LuKey,
  LuClock,
  LuLogOut,
  LuFileText,
} from "@qwikest/icons/lucide";
import {
  getRoleIcon,
  getRoleColor,
  getRoleDisplayName,
  getActivityTypeClass,
} from "~/utils/dashboard-utils";
import { getRoleBenefitsData } from "~/data/profile-data";
import { ProfileInfoItem, ProfileBenefitList, ProfileSection } from "./";

export default component$(() => {
  const { user, loading, error, refreshUserData, logout } = useAuth();

  // Loading skeleton
  if (loading.value) {
    return (
      <div class="container mx-auto px-4">
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
      <div class="container mx-auto px-4">
        <div class="card bg-base-100 shadow-lg">
          <div class="card-body text-center">
            <p class="text-error mb-4">{error.value}</p>
            <button class="btn btn-primary" onClick$={refreshUserData}>
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

  const RoleIcon = getRoleIcon(user.value.role);
  const roleColorClass = getRoleColor(user.value.role);
  const roleBenefits = getRoleBenefitsData(user.value.role);

  // Sample recent activities (replace with actual data fetching)
  const recentActivities = [
    {
      title: "Update Profil",
      description: "Mengubah informasi kontak dan alamat.",
      time: "2 jam yang lalu",
      type: "info",
    },
    {
      title: "Perubahan Password",
      description: "Password akun berhasil diubah.",
      time: "1 hari yang lalu",
      type: "success",
    },
    {
      title: "Login Baru",
      description: "Login dari perangkat baru di lokasi Malang.",
      time: "3 hari yang lalu",
      type: "warning",
    },
  ];

  return (
    <div class="container mx-auto px-4">
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <aside class="lg:col-span-1">
          <div class="card bg-base-100 shadow-lg">
            <div class="card-body items-center p-6">
              <div class={`avatar placeholder mx-auto mb-4`}>
                <div
                  class={`w-24 rounded-full ${roleColorClass} text-primary-content`}
                >
                  <span class="text-3xl font-bold ">
                    {user.value.email ? (
                      user.value.email.charAt(0).toUpperCase()
                    ) : (
                      <div class="skeleton w-full h-full rounded-full"></div>
                    )}
                  </span>
                </div>
              </div>
              <h2 class="font-bold text-lg text-center mb-1 truncate w-full">
                {user.value.email}
              </h2>
              <div class="badge badge-primary gap-2 mb-2">
                {RoleIcon && <RoleIcon class="w-4 h-4" />}
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
            <button class="btn btn-secondary w-full gap-2">
              <LuKey class="w-4 h-4" /> Ubah Password
            </button>
            <button class="btn btn-error w-full gap-2" onClick$={logout}>
              <LuLogOut class="w-4 h-4" /> Keluar
            </button>
          </div>
          <ProfileBenefitList benefits={roleBenefits} />
        </aside>

        {/* Main Content */}
        <div class="lg:col-span-3 space-y-6">
          <ProfileSection
            title="Informasi Akun"
            icon={<LuUser class="w-5 h-5 text-primary" />}
          >
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ProfileInfoItem
                label="Email"
                value={user.value.email}
                icon={<LuMail class="w-5 h-5 text-primary" />}
              />
              <ProfileInfoItem
                label="Peran"
                value={getRoleDisplayName(user.value.role)}
                icon={
                  RoleIcon ? (
                    <RoleIcon class="w-5 h-5 text-primary" />
                  ) : undefined
                }
              />
              {/* Tambahkan informasi lain seperti nama, alamat, dll. jika tersedia di user.value */}
            </div>
          </ProfileSection>

          <ProfileSection
            title="Pengaturan Keamanan"
            icon={<LuShield class="w-5 h-5 text-primary" />}
          >
            <div class="space-y-4">
              <div class="flex items-center justify-between p-4 bg-base-100/50 backdrop-blur-sm rounded-lg">
                <p class="text-base-content">Otentikasi Dua Faktor</p>
                <input
                  type="checkbox"
                  class="toggle toggle-primary"
                  checked={false}
                />
              </div>
              <div class="flex items-center justify-between p-4 bg-base-100/50 backdrop-blur-sm rounded-lg">
                <p class="text-base-content">Notifikasi Email</p>
                <input
                  type="checkbox"
                  class="toggle toggle-primary"
                  checked={true}
                />
              </div>
            </div>
          </ProfileSection>

          <ProfileSection
            title="Riwayat Aktivitas"
            icon={<LuClock class="w-5 h-5 text-primary" />}
          >
            <div class="space-y-4">
              {recentActivities.length > 0 ? (
                recentActivities.map((activity, index) => (
                  <div
                    key={index}
                    class="flex items-start gap-4 p-4 rounded-lg shadow-sm border border-base-200/50 hover:shadow-md transition-shadow duration-200"
                  >
                    <div
                      class={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${getActivityTypeClass(activity.type)}`}
                    >
                      <LuClock class="w-5 h-5" />
                    </div>
                    <div class="flex-1">
                      <h3 class="font-semibold text-base-content mb-1">
                        {activity.title}
                      </h3>
                      <p class="text-sm text-base-content/70 mb-1 leading-snug">
                        {activity.description}
                      </p>
                      <div class="flex items-center text-xs text-base-content/50">
                        <LuClock class="w-3 h-3 mr-1" />
                        <span>{activity.time}</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p class="text-center text-base-content/70 py-4">
                  Belum ada riwayat aktivitas.
                </p>
              )}
            </div>
          </ProfileSection>

          <ProfileSection
            title="Data & Export"
            icon={<LuFileText class="w-5 h-5 text-primary" />}
          >
            <div class="space-y-4">
              <button class="btn btn-primary w-full">Export Data Profil</button>
              <button class="btn btn-secondary w-full">
                Unduh Rekam Medis (Khusus Psikolog/Kader)
              </button>
            </div>
          </ProfileSection>
        </div>
      </div>
    </div>
  );
});
