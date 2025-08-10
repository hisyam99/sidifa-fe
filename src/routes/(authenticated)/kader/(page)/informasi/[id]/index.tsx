import { component$, useSignal, useVisibleTask$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { useLocation } from "@builder.io/qwik-city";
import { useInformasiEdukasiKader } from "~/hooks/useInformasiEdukasiKader";
import { useAuth } from "~/hooks";
import { GenericLoadingSpinner } from "~/components/common";
import { buildInformasiEdukasiUrl } from "~/utils/url";

export default component$(() => {
  const loc = useLocation();
  const { isLoggedIn } = useAuth();
  const { fetchDetail, error } = useInformasiEdukasiKader();
  const item = useSignal<any>(null);

  useVisibleTask$(async ({ track }) => {
    track(isLoggedIn);
    track(() => loc.params.id);

    const id = loc.params["id"];
    if (isLoggedIn.value && id) {
      item.value = await fetchDetail(id);
    }
  });

  const tipeToBadge = (tipe?: string): string => {
    const t = (tipe || "").toString().toUpperCase();
    if (t.includes("ARTIKEL")) return "badge badge-primary";
    if (t.includes("PANDUAN")) return "badge badge-success";
    if (t.includes("REGULASI")) return "badge badge-warning";
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
                  {item.value.judul}
                </h1>
                <div class="mt-2">
                  <span class={tipeToBadge(item.value.tipe)}>
                    {(item.value.tipe || "").toString().toUpperCase()}
                  </span>
                </div>
              </div>
              {item.value.file_url && (
                <a
                  class="btn btn-outline btn-primary"
                  href={buildInformasiEdukasiUrl(item.value.file_url)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Lihat Lampiran
                </a>
              )}
            </div>

            <div class="divider my-2 md:my-4" />

            <div
              class="prose max-w-none"
              dangerouslySetInnerHTML={item.value.deskripsi || ""}
            />
          </div>
        </div>
      )}
    </div>
  );
});

export const head: DocumentHead = {
  title: "Detail Informasi & Edukasi - Si-DIFA",
};
