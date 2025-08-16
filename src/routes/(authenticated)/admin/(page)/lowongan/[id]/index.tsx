import { component$, useTask$, useSignal } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";
import type { DocumentHead } from "@builder.io/qwik-city";
import { useLocation } from "@builder.io/qwik-city";
import { useLowonganAdmin } from "~/hooks/useLowonganAdmin";
import { GenericLoadingSpinner } from "~/components/common";
import { buildLowonganUploadUrl } from "~/utils/url";

export default component$(() => {
  const loc = useLocation();
  const { fetchDetail, loading, error } = useLowonganAdmin();
  const item = useSignal<any>(null);

  useTask$(async ({ track }) => {
    track(() => loc.params.id);
    const id = loc.params["id"];
    if (id) item.value = await fetchDetail(id);
  });

  return (
    <div class="mx-auto">
      {loading.value && <GenericLoadingSpinner />}
      {error.value && <div class="alert alert-error mb-4">{error.value}</div>}
      {item.value && (
        <article class="prose max-w-none">
          <h1>{item.value.nama_lowongan}</h1>
          <p class="badge badge-outline mb-4">{item.value.status}</p>
          <p>
            <b>Perusahaan:</b> {item.value.nama_perusahaan}
          </p>
          <p>
            <b>Jenis Pekerjaan:</b> {item.value.jenis_pekerjaan}
          </p>
          <p>
            <b>Lokasi:</b> {item.value.lokasi}
          </p>
          <p>
            <b>Jenis Difasilitas:</b> {item.value.jenis_difasilitas}
          </p>
          <p class="mt-2">{item.value.deskripsi}</p>
          {item.value.file_name && (
            <p class="mt-4">
              <Link
                class="link link-primary"
                href={buildLowonganUploadUrl(item.value.file_name)}
                target="_blank"
                rel="noopener noreferrer"
              >
                Lihat Lampiran
              </Link>
            </p>
          )}
        </article>
      )}
    </div>
  );
});

export const head: DocumentHead = {
  title: "Detail Lowongan - Si-DIFA",
};
