import { component$, useVisibleTask$ } from "@builder.io/qwik";
import { useNavigate } from "@builder.io/qwik-city";
import { useAuth } from "~/hooks";

export default component$(() => {
  const { user, loading, isLoggedIn } = useAuth();
  const nav = useNavigate();

  useVisibleTask$(() => {
    if (!loading.value && isLoggedIn.value && user.value?.role !== "admin") {
      nav("/dashboard");
    }
  });

  if (loading.value) {
    return <div>Loading...</div>;
  }

  if (!isLoggedIn.value) {
    nav("/auth/login");
    return null;
  }

  if (user.value?.role !== "admin") {
    return (
      <div class="flex flex-col items-center justify-center min-h-screen">
        <h1 class="text-2xl font-bold mb-4">Akses Ditolak</h1>
        <p class="mb-2">Halaman ini hanya dapat diakses oleh admin.</p>
      </div>
    );
  }

  return (
    <div class="container mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold mb-6">Admin Panel</h1>
      <div class="card bg-base-100 shadow-lg p-6">
        <p>
          Selamat datang di halaman admin. Hanya admin yang dapat melihat
          halaman ini.
        </p>
        {/* Tambahkan konten admin di sini */}
      </div>
    </div>
  );
});
