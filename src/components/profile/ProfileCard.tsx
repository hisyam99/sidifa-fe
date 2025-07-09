import { component$ } from "@builder.io/qwik";
import { Card } from "~/components/ui";
import { useAuth } from "~/hooks";
import {
  LuUser,
  LuMail,
  LuPhone,
  LuMapPin,
  LuHeart,
  LuBrain,
  LuPencil,
  LuShield,
  LuZap,
  LuCheckCircle,
} from "@qwikest/icons/lucide";

export default component$(() => {
  const { user } = useAuth();

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "posyandu":
        return <LuHeart class="w-6 h-6" />;
      case "psikolog":
        return <LuBrain class="w-6 h-6" />;
      default:
        return <LuUser class="w-6 h-6" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "posyandu":
        return "bg-gradient-primary";
      case "psikolog":
        return "bg-gradient-secondary";
      default:
        return "bg-gradient-accent";
    }
  };

  const getRoleBenefits = (role: string) => {
    if (role === "posyandu") {
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

  return (
    <Card class="w-full max-w-2xl mx-auto p-8">
      {/* Header */}
      <div class="text-center mb-6 md:mb-8">
        <div class="avatar placeholder mb-4 md:mb-6">
          <div
            class={`${getRoleColor(user.value?.role || "user")}  rounded-full w-24 h-24 md:w-32 md:h-32 shadow-2xl`}
          >
            {getRoleIcon(user.value?.role || "user")}
          </div>
        </div>
        <h1 class="text-2xl md:text-4xl font-bold text-gradient-primary mb-2">
          Profil Pengguna
        </h1>
        <p class="text-base-content/70 text-sm md:text-lg">
          Informasi detail akun SIDIFA Anda
        </p>
      </div>

      {/* Profile Info */}
      <div class="grid grid-cols-1 xl:grid-cols-2 gap-6 md:gap-8">
        {/* Basic Info */}
        <div class="space-y-4 md:space-y-6">
          <h2 class="text-xl md:text-2xl font-bold text-gradient-secondary mb-4 md:mb-6 flex items-center gap-2 md:gap-3">
            <LuUser class="w-5 h-5 md:w-6 md:h-6" />
            Informasi Dasar
          </h2>

          <div class="space-y-3 md:space-y-4">
            <div class="flex items-center gap-3 md:gap-4 p-3 md:p-4 bg-base-200/50 rounded-lg">
              <div class="avatar placeholder">
                <div
                  class={`${getRoleColor(user.value?.role || "user")}  rounded-full w-10 h-10 md:w-12 md:h-12`}
                >
                  <span class="text-sm md:text-lg font-bold">
                    {user.value?.name?.charAt(0).toUpperCase() || "U"}
                  </span>
                </div>
              </div>
              <div class="flex-1 min-w-0">
                <p class="font-semibold text-base md:text-lg truncate">
                  {user.value?.name || "Nama tidak tersedia"}
                </p>
                <div class="badge badge-primary gap-2 mt-1">
                  {getRoleIcon(user.value?.role || "user")}
                  <span class="capitalize text-xs md:text-sm">
                    {user.value?.role || "user"}
                  </span>
                </div>
              </div>
            </div>

            <div class="space-y-2 md:space-y-3">
              <div class="flex items-center gap-3 p-3 bg-base-200/30 rounded-lg">
                <LuMail class="w-4 h-4 md:w-5 md:h-5 text-primary flex-shrink-0" />
                <div class="flex-1 min-w-0">
                  <p class="text-xs md:text-sm text-base-content/60">Email</p>
                  <p class="font-medium text-sm md:text-base truncate">
                    {user.value?.email || "Email tidak tersedia"}
                  </p>
                </div>
              </div>

              <div class="flex items-center gap-3 p-3 bg-base-200/30 rounded-lg">
                <LuPhone class="w-4 h-4 md:w-5 md:h-5 text-primary flex-shrink-0" />
                <div class="flex-1 min-w-0">
                  <p class="text-xs md:text-sm text-base-content/60">
                    Nomor Telepon
                  </p>
                  <p class="font-medium text-sm md:text-base truncate">
                    {user.value?.no_telp || "Nomor telepon tidak tersedia"}
                  </p>
                </div>
              </div>

              {user.value?.role === "posyandu" && user.value?.nama_posyandu && (
                <div class="flex items-center gap-3 p-3 bg-base-200/30 rounded-lg">
                  <LuHeart class="w-4 h-4 md:w-5 md:h-5 text-primary flex-shrink-0" />
                  <div class="flex-1 min-w-0">
                    <p class="text-xs md:text-sm text-base-content/60">
                      Nama Posyandu
                    </p>
                    <p class="font-medium text-sm md:text-base truncate">
                      {user.value.nama_posyandu}
                    </p>
                  </div>
                </div>
              )}

              {user.value?.role === "psikolog" && user.value?.spesialis && (
                <div class="flex items-center gap-3 p-3 bg-base-200/30 rounded-lg">
                  <LuBrain class="w-4 h-4 md:w-5 md:h-5 text-primary flex-shrink-0" />
                  <div class="flex-1 min-w-0">
                    <p class="text-xs md:text-sm text-base-content/60">
                      Spesialisasi
                    </p>
                    <p class="font-medium text-sm md:text-base truncate">
                      {user.value.spesialis}
                    </p>
                  </div>
                </div>
              )}

              {user.value?.lokasi && (
                <div class="flex items-center gap-3 p-3 bg-base-200/30 rounded-lg">
                  <LuMapPin class="w-4 h-4 md:w-5 md:h-5 text-primary flex-shrink-0" />
                  <div class="flex-1 min-w-0">
                    <p class="text-xs md:text-sm text-base-content/60">
                      Lokasi
                    </p>
                    <p class="font-medium text-sm md:text-base truncate">
                      {user.value.lokasi}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Account Status & Actions */}
        <div class="space-y-4 md:space-y-6">
          <h2 class="text-xl md:text-2xl font-bold text-gradient-secondary mb-4 md:mb-6 flex items-center gap-2 md:gap-3">
            <LuShield class="w-5 h-5 md:w-6 md:h-6" />
            Status Akun
          </h2>

          <div class="space-y-3 md:space-y-4">
            {/* Account Status */}
            <div class="card bg-base-200/30 border border-base-300">
              <div class="card-body p-4 md:p-6">
                <div class="flex items-center gap-2 md:gap-3 mb-3 md:mb-4">
                  <LuCheckCircle class="w-5 h-5 md:w-6 md:h-6 text-success" />
                  <h3 class="font-bold text-base md:text-lg">Akun Aktif</h3>
                </div>
                <p class="text-base-content/70 text-xs md:text-sm">
                  Akun Anda telah terverifikasi dan aktif menggunakan layanan
                  SIDIFA.
                </p>
              </div>
            </div>

            {/* Role Benefits */}
            <div class="card bg-base-200/30 border border-base-300">
              <div class="card-body p-4 md:p-6">
                <h3 class="font-bold text-base md:text-lg mb-3 md:mb-4 flex items-center gap-2 md:gap-3">
                  <LuZap class="w-4 h-4 md:w-5 md:h-5 text-accent" />
                  Manfaat Akun
                </h3>
                <ul class="space-y-2 text-xs md:text-sm">
                  {getRoleBenefits(user.value?.role || "user").map(
                    (benefit, index) => (
                      <li key={index} class="flex items-center gap-2">
                        {benefit.icon}
                        <span>{benefit.text}</span>
                      </li>
                    ),
                  )}
                </ul>
              </div>
            </div>

            {/* Actions */}
            <div class="space-y-2 md:space-y-3">
              <button class="btn btn-primary w-full gap-2 md:gap-3 text-sm md:text-base">
                <LuPencil class="w-3 h-3 md:w-4 md:h-4" />
                Edit Profil
              </button>
              <button class="btn btn-outline w-full gap-2 md:gap-3 text-sm md:text-base">
                <LuShield class="w-3 h-3 md:w-4 md:h-4" />
                Ubah Password
              </button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
});
