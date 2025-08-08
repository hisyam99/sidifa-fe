import { component$, useTask$, useSignal } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { useLocation } from "@builder.io/qwik-city";
import { useInformasiEdukasiKader } from "~/hooks/useInformasiEdukasiKader";
import { useAuth } from "~/hooks";
import { GenericLoadingSpinner } from "~/components/common";
import { buildUploadUrl } from "~/utils/url";

export default component$(() => {
  const loc = useLocation();
  const { isLoggedIn } = useAuth();
  const { fetchDetail, loading, error } = useInformasiEdukasiKader();
  const item = useSignal<any>(null);

  useTask$(async ({ track }) => {
    track(isLoggedIn);
    track(() => loc.params.id);

    const id = loc.params["id"];
    if (isLoggedIn.value && id) {
      item.value = await fetchDetail(id);
    }
  });

  return (
    <div class="container mx-auto py-6">
      {loading.value && <GenericLoadingSpinner />}
      {error.value && <div class="alert alert-error mb-4">{error.value}</div>}
      {item.value && (
        <article class="prose max-w-none">
          <h1>{item.value.judul}</h1>
          <p class="badge badge-outline mb-4">{item.value.tipe}</p>
          <p>{item.value.deskripsi}</p>
          {item.value.file_url && (
            <p class="mt-4">
              <a
                class="link link-primary"
                href={buildUploadUrl(item.value.file_url)}
                target="_blank"
                rel="noopener noreferrer"
              >
                Lihat Lampiran
              </a>
            </p>
          )}
        </article>
      )}
    </div>
  );
});

export const head: DocumentHead = {
  title: "Detail Informasi & Edukasi - Si-DIFA",
};
