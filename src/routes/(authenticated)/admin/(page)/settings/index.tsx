import { $, component$ } from "@qwik.dev/core";
import type { DocumentHead } from "@qwik.dev/router";
import { useNavigate } from "@qwik.dev/router";
import { LuSettings, LuArrowLeft } from "~/components/icons/lucide-optimized";

export default component$(() => {
  const nav = useNavigate();

  const handleBack = $(() => {
    // Go back if possible, otherwise go to admin home
    if (history.length > 1) {
      history.back();
    } else {
      nav("/admin");
    }
  });

  return (
    <div class="flex items-center justify-center">
      <div class="card bg-base-100 shadow-xl max-w-2xl w-full">
        <div class="card-body items-center text-center p-8">
          <div class="mb-4 rounded-full bg-primary/10 p-4">
            <LuSettings class="w-10 h-10 text-primary" />
          </div>
          <h1 class="card-title text-2xl">Pengaturan</h1>
          <p class="text-base-content/70">
            Halaman pengaturan untuk Admin akan segera hadir. Fitur seperti
            manajemen akun, preferensi tampilan, notifikasi, dan konfigurasi
            sistem akan tersedia di sini.
          </p>
          <div class="mt-6 flex gap-3">
            <button class="btn btn-ghost gap-2" onClick$={handleBack}>
              <LuArrowLeft class="w-4 h-4" />
              Kembali
            </button>
            <button class="btn btn-disabled">Coming Soon</button>
          </div>
        </div>
      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Pengaturan Admin - Si-DIFA",
  meta: [
    {
      name: "description",
      content: "Halaman pengaturan Admin Si-DIFA. Fitur akan segera tersedia.",
    },
  ],
};
