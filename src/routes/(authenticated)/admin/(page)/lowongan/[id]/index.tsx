import { component$, useTask$, useSignal } from "@builder.io/qwik";
import { Link, useLocation } from "@builder.io/qwik-city";
import type { DocumentHead } from "@builder.io/qwik-city";
import { useLowonganAdmin } from "~/hooks/useLowonganAdmin";
import { AdminPageHeader } from "~/components/admin";
import { GenericLoadingSpinner } from "~/components/common";
import { buildLowonganUploadUrl } from "~/utils/url";
import type { LowonganItem } from "~/types/lowongan";

export default component$(() => {
  const loc = useLocation();
  const { fetchDetail, loading, error } = useLowonganAdmin();
  const item = useSignal<LowonganItem | null>(null);

  useTask$(async ({ track }) => {
    track(() => loc.params.id);
    const id = loc.params["id"];
    if (id) item.value = await fetchDetail(id);
  });

  return (
    <div class="space-y-6">
      <AdminPageHeader
        title="Detail Lowongan"
        description="Informasi lengkap lowongan kerja inklusif."
      />

      {loading.value && <GenericLoadingSpinner />}
      {error.value && (
        <div class="alert alert-error shadow-sm">
          <span>{error.value}</span>
        </div>
      )}

      {item.value && (
        <div class="rounded-2xl border border-base-300/50 bg-base-100 shadow-sm overflow-hidden">
          <div class="pointer-events-none absolute inset-x-0 top-0 h-0.5 bg-linear-to-r from-primary/40 via-primary/20 to-transparent"></div>

          <div class="p-6 space-y-6">
            {/* Title and status */}
            <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
              <h2 class="text-xl font-bold text-base-content leading-tight">
                {item.value.nama_lowongan}
              </h2>
              <span class="inline-flex items-center rounded-md bg-primary/8 px-2.5 py-1 text-xs font-medium text-primary/80 ring-1 ring-inset ring-primary/15 shrink-0">
                {item.value.status}
              </span>
            </div>

            {/* Details grid */}
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div class="space-y-1">
                <p class="text-xs font-medium uppercase tracking-wider text-base-content/50">
                  Perusahaan
                </p>
                <p class="text-sm font-medium text-base-content">
                  {item.value.nama_perusahaan}
                </p>
              </div>

              <div class="space-y-1">
                <p class="text-xs font-medium uppercase tracking-wider text-base-content/50">
                  Jenis Pekerjaan
                </p>
                <p class="text-sm font-medium text-base-content">
                  {item.value.jenis_pekerjaan}
                </p>
              </div>

              <div class="space-y-1">
                <p class="text-xs font-medium uppercase tracking-wider text-base-content/50">
                  Lokasi
                </p>
                <p class="text-sm font-medium text-base-content">
                  {item.value.lokasi}
                </p>
              </div>

              <div class="space-y-1">
                <p class="text-xs font-medium uppercase tracking-wider text-base-content/50">
                  Jenis Difasilitas
                </p>
                <p class="text-sm font-medium text-base-content">
                  {item.value.jenis_difasilitas}
                </p>
              </div>
            </div>

            {/* Divider */}
            <div class="border-t border-base-200/60"></div>

            {/* Description */}
            <div class="space-y-2">
              <p class="text-xs font-medium uppercase tracking-wider text-base-content/50">
                Deskripsi
              </p>
              <div class="prose prose-sm max-w-none text-base-content/80 leading-relaxed">
                <p>{item.value.deskripsi}</p>
              </div>
            </div>

            {/* Attachment */}
            {item.value.file_name && (
              <>
                <div class="border-t border-base-200/60"></div>
                <div>
                  <Link
                    class="btn btn-sm btn-outline btn-primary gap-2"
                    href={buildLowonganUploadUrl(item.value.file_name)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <svg
                      class="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                      />
                    </svg>
                    Lihat Lampiran
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
});

export const head: DocumentHead = {
  title: "Detail Lowongan - Si-DIFA",
};
