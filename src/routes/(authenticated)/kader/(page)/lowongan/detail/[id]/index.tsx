import { component$, useSignal, useVisibleTask$ } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";
import type { DocumentHead } from "@builder.io/qwik-city";
import { useLocation } from "@builder.io/qwik-city";
import { useLowonganKader } from "~/hooks/useLowonganKader";
import { GenericLoadingSpinner } from "~/components/common";
import { buildLowonganUploadUrl } from "~/utils/url";

export default component$(() => {
  const loc = useLocation();
  const { fetchDetail, error } = useLowonganKader();
  const item = useSignal<any>(null);

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(async ({ track }) => {
    track(() => loc.params.id);
    const id = loc.params["id"];
    if (id) item.value = await fetchDetail(id);
  });

  const statusToBadge = (status?: string): string => {
    const s = (status || "").toString().toLowerCase();
    if (s.includes("aktif") || s.includes("open")) return "badge badge-success";
    if (s.includes("tutup") || s.includes("closed")) return "badge badge-error";
    return "badge badge-ghost";
  };

  return (
    <div class="container mx-auto">
      {error.value && <div class="alert alert-error mb-4">{error.value}</div>}
      {!item.value && !error.value && <GenericLoadingSpinner />}
      {item.value && (
        <div class="card bg-base-100 shadow-xl">
          <div class="card-body">
            <div class="flex items-start justify-between gap-4">
              <div>
                <h1 class="card-title text-2xl md:text-3xl">
                  {item.value.nama_lowongan}
                </h1>
                <div class="mt-2">
                  <span class={statusToBadge(item.value.status)}>
                    {item.value.status}
                  </span>
                </div>
              </div>
              {item.value.file_name && (
                <Link
                  class="btn btn-outline btn-primary"
                  href={buildLowonganUploadUrl(item.value.file_name)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Lihat Lampiran
                </Link>
              )}
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div class="stats shadow">
                <div class="stat">
                  <div class="stat-title">Perusahaan</div>
                  <div class="stat-value text-base md:text-xl">
                    {item.value.nama_perusahaan}
                  </div>
                </div>
              </div>
              <div class="stats shadow">
                <div class="stat">
                  <div class="stat-title">Jenis Pekerjaan</div>
                  <div class="stat-value text-base md:text-xl">
                    {item.value.jenis_pekerjaan}
                  </div>
                </div>
              </div>
              <div class="stats shadow">
                <div class="stat">
                  <div class="stat-title">Lokasi</div>
                  <div class="stat-value text-base md:text-xl">
                    {item.value.lokasi}
                  </div>
                </div>
              </div>
              <div class="stats shadow">
                <div class="stat">
                  <div class="stat-title">Jenis Disabilitas</div>
                  <div class="stat-value text-base md:text-xl">
                    {item.value.jenis_difasilitas}
                  </div>
                </div>
              </div>
            </div>

            <div class="divider my-2 md:my-4" />

            <div
              class="prose max-w-none"
              dangerouslySetInnerHTML={item.value.deskripsi || ""}
            />

            <div class="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              {item.value.tanggal_mulai && (
                <div class="alert">
                  <span>
                    <b>Tanggal Mulai:</b> {item.value.tanggal_mulai}
                  </span>
                </div>
              )}
              {item.value.tanggal_selesai && (
                <div class="alert">
                  <span>
                    <b>Tanggal Selesai:</b> {item.value.tanggal_selesai}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

export const head: DocumentHead = {
  title: "Detail Lowongan - Si-DIFA",
};
