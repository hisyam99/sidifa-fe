import { $, component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { useNavigate } from "@builder.io/qwik-city";
import { AdminPageHeader } from "~/components/admin";
import { LuSettings, LuArrowLeft } from "~/components/icons/lucide-optimized";

export default component$(() => {
  const nav = useNavigate();

  const handleBack = $(() => {
    if (history.length > 1) {
      history.back();
    } else {
      nav("/admin");
    }
  });

  return (
    <div class="space-y-6">
      <AdminPageHeader
        title="Pengaturan"
        description="Konfigurasi sistem dan preferensi akun admin."
      />

      <div class="flex items-center justify-center py-12">
        <div class="max-w-md w-full text-center space-y-6">
          <div class="inline-flex items-center justify-center rounded-full bg-primary/10 p-5">
            <LuSettings class="w-10 h-10 text-primary" />
          </div>

          <div class="space-y-2">
            <h2 class="text-xl font-semibold text-base-content">
              Segera Hadir
            </h2>
            <p class="text-sm text-base-content/60 leading-relaxed">
              Fitur seperti manajemen akun, preferensi tampilan, notifikasi, dan
              konfigurasi sistem akan tersedia di sini.
            </p>
          </div>

          <div class="flex items-center justify-center gap-3 pt-2">
            <button class="btn btn-ghost btn-sm gap-2" onClick$={handleBack}>
              <LuArrowLeft class="w-4 h-4" />
              Kembali
            </button>
            <button class="btn btn-disabled btn-sm">Coming Soon</button>
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
