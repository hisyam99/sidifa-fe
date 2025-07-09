import { component$, useSignal, $, useVisibleTask$ } from "@builder.io/qwik";
import { useNavigate } from "@builder.io/qwik-city";

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

export default component$(() => {
  const user = useSignal<User | null>(null);
  const loading = useSignal(true);
  const nav = useNavigate();

  useVisibleTask$(() => {
    if (typeof window !== "undefined") {
      // Cek apakah user sudah login
      const token = localStorage.getItem("access_token");
      const userData = localStorage.getItem("user");

      if (!token || !userData) {
        nav("/login");
        return;
      }

      try {
        user.value = JSON.parse(userData);
      } catch (error) {
        console.error("Error parsing user data:", error);
        nav("/login");
      } finally {
        loading.value = false;
      }
    }
  });

  const handleLogout = $(() => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("access_token");
      localStorage.removeItem("user");
      nav("/login");
    }
  });

  if (loading.value) {
    return (
      <div class="container mx-auto max-w-md p-4">
        <div class="text-center">
          <span class="loading loading-spinner loading-lg"></span>
          <p class="mt-2">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user.value) {
    return null;
  }

  return (
    <div class="container mx-auto max-w-md p-4">
      <div class="card bg-base-100 shadow-xl">
        <div class="card-body">
          <h1 class="card-title text-2xl mb-4">Profile</h1>

          <div class="space-y-4">
            <div>
              <label class="label">
                <span class="label-text font-semibold">Nama</span>
              </label>
              <p class="text-gray-700">{user.value.name}</p>
            </div>

            <div>
              <label class="label">
                <span class="label-text font-semibold">Email</span>
              </label>
              <p class="text-gray-700">{user.value.email}</p>
            </div>

            <div>
              <label class="label">
                <span class="label-text font-semibold">Role</span>
              </label>
              <p class="text-gray-700 capitalize">{user.value.role}</p>
            </div>

            <div>
              <label class="label">
                <span class="label-text font-semibold">No Telepon</span>
              </label>
              <p class="text-gray-700">{user.value.no_telp}</p>
            </div>

            {user.value.role === "posyandu" && (
              <>
                <div>
                  <label class="label">
                    <span class="label-text font-semibold">Nama Posyandu</span>
                  </label>
                  <p class="text-gray-700">{user.value.nama_posyandu}</p>
                </div>
                <div>
                  <label class="label">
                    <span class="label-text font-semibold">Lokasi</span>
                  </label>
                  <p class="text-gray-700">{user.value.lokasi}</p>
                </div>
              </>
            )}

            {user.value.role === "psikolog" && (
              <>
                <div>
                  <label class="label">
                    <span class="label-text font-semibold">Spesialis</span>
                  </label>
                  <p class="text-gray-700">{user.value.spesialis}</p>
                </div>
                <div>
                  <label class="label">
                    <span class="label-text font-semibold">Lokasi</span>
                  </label>
                  <p class="text-gray-700">{user.value.lokasi}</p>
                </div>
              </>
            )}
          </div>

          <div class="card-actions justify-end mt-6">
            <button onClick$={handleLogout} class="btn btn-error">
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});
