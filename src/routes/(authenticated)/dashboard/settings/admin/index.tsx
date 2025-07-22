import { component$ } from "@qwik.dev/core";
import { AdminOnlyContent } from "~/components/common";

export default component$(() => {
  return (
    <AdminOnlyContent>
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
    </AdminOnlyContent>
  );
});
