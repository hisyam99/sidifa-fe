import { component$, $ } from "@builder.io/qwik";
import { useNavigate } from "@builder.io/qwik-city";
import { Card } from "~/components/ui";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  no_telp: string;
  nama_posyandu?: string;
  lokasi?: string;
  spesialis?: string;
}

interface ProfileCardProps {
  user: User;
}

export default component$<ProfileCardProps>(({ user }) => {
  const nav = useNavigate();

  const handleLogout = $(() => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("access_token");
      localStorage.removeItem("user");
      nav("/auth/login");
    }
  });

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "posyandu":
        return "🏥";
      case "psikolog":
        return "🧠";
      default:
        return "👤";
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "posyandu":
        return "bg-primary";
      case "psikolog":
        return "bg-secondary";
      default:
        return "bg-accent";
    }
  };

  return (
    <Card class="max-w-2xl mx-auto">
      <div class="text-center mb-6">
        <div class="avatar placeholder mb-4">
          <div
            class={`${getRoleColor(user.role)} text-primary-content rounded-full w-20`}
          >
            <span class="text-3xl">{getRoleIcon(user.role)}</span>
          </div>
        </div>
        <h1 class="text-2xl font-bold">Profile Pengguna</h1>
        <p class="text-base-content/70 mt-2">Informasi detail akun Anda</p>
      </div>

      <div class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="form-control">
            <label class="label">
              <span class="label-text font-medium">Nama Lengkap</span>
            </label>
            <div class="input input-bordered bg-base-200">{user.name}</div>
          </div>

          <div class="form-control">
            <label class="label">
              <span class="label-text font-medium">Email</span>
            </label>
            <div class="input input-bordered bg-base-200">{user.email}</div>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="form-control">
            <label class="label">
              <span class="label-text font-medium">Role</span>
            </label>
            <div class="input input-bordered bg-base-200">
              <span class="badge badge-primary badge-lg capitalize">
                {user.role}
              </span>
            </div>
          </div>

          <div class="form-control">
            <label class="label">
              <span class="label-text font-medium">No Telepon</span>
            </label>
            <div class="input input-bordered bg-base-200">{user.no_telp}</div>
          </div>
        </div>

        {user.role === "posyandu" && (
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="form-control">
              <label class="label">
                <span class="label-text font-medium">Nama Posyandu</span>
              </label>
              <div class="input input-bordered bg-base-200">
                {user.nama_posyandu}
              </div>
            </div>
            <div class="form-control">
              <label class="label">
                <span class="label-text font-medium">Lokasi</span>
              </label>
              <div class="input input-bordered bg-base-200">{user.lokasi}</div>
            </div>
          </div>
        )}

        {user.role === "psikolog" && (
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="form-control">
              <label class="label">
                <span class="label-text font-medium">Spesialisasi</span>
              </label>
              <div class="input input-bordered bg-base-200">
                {user.spesialis}
              </div>
            </div>
            <div class="form-control">
              <label class="label">
                <span class="label-text font-medium">Lokasi Praktik</span>
              </label>
              <div class="input input-bordered bg-base-200">{user.lokasi}</div>
            </div>
          </div>
        )}
      </div>

      <div class="divider">Aksi</div>

      <div class="card-actions justify-center">
        <button onClick$={handleLogout} class="btn btn-error btn-outline">
          <svg
            class="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            ></path>
          </svg>
          Logout
        </button>
      </div>
    </Card>
  );
});
