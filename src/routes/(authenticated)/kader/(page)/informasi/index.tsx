import { component$, useSignal, $ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import {
  SearchBox,
  PaginationControls,
  GenericLoadingSpinner,
} from "~/components/common";
import { InformationArticleCard } from "~/components/information";
import { useInformasiEdukasiKader } from "~/hooks/useInformasiEdukasiKader";
import { usePagination } from "~/hooks/usePagination";
import { useDebouncer } from "~/utils/debouncer";
import { useAuth } from "~/hooks";

export default component$(() => {
  const { isLoggedIn } = useAuth();

  const filterOptions = useSignal<{ judul?: string; deskripsi?: string }>({
    judul: "",
    deskripsi: "",
  });

  const { items, loading, error, total, totalPage, fetchList } =
    useInformasiEdukasiKader();

  const {
    currentPage,
    currentLimit,
    meta,
    handlePageChange,
    handleLimitChange,
  } = usePagination<{ judul?: string; deskripsi?: string }>({
    initialPage: 1,
    initialLimit: 10,
    fetchList: $((params) => {
      if (isLoggedIn.value) {
        fetchList(params);
      }
    }),
    total,
    totalPage,
    filters: filterOptions,
    dependencies: [isLoggedIn],
  });

  const handleSearchImmediate = $((value: string) => {
    filterOptions.value = { ...filterOptions.value, judul: value };
  });
  const handleSearchDebounced = useDebouncer(handleSearchImmediate, 400);

  return (
    <div>
      <h1 class="text-3xl font-bold mb-2">Informasi & Edukasi</h1>
      <p class="mb-6">
        Kumpulan artikel, panduan, dan materi edukasi untuk Anda.
      </p>

      <div class="mb-6 flex gap-4 items-center">
        <SearchBox
          placeholder="Cari judul atau deskripsi..."
          value={filterOptions.value.judul || ""}
          onInput$={(e) =>
            handleSearchDebounced((e.target as HTMLInputElement).value)
          }
          onEnter$={$(() => {})}
        />
        <select
          class="select select-bordered max-w-xs"
          value={String(currentLimit.value)}
          onChange$={$((e: Event) =>
            handleLimitChange(parseInt((e.target as HTMLSelectElement).value)),
          )}
        >
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="20">20</option>
        </select>
      </div>

      {error.value && <div class="alert alert-error mb-4">{error.value}</div>}

      <div class="relative">
        {loading.value && <GenericLoadingSpinner overlay size="w-12 h-12" />}
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(items.value?.length || 0) > 0 ? (
            items.value.map((item) => (
              <InformationArticleCard
                key={item.id}
                title={item.judul}
                category={item.tipe || "Informasi"}
                image={
                  item.file_url ||
                  "https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.jpg"
                }
                excerpt={item.deskripsi}
                href={`/kader/informasi/${item.id}`}
              />
            ))
          ) : !loading.value ? (
            <p class="col-span-full text-center text-base-content/70">
              Tidak ada data.
            </p>
          ) : null}
        </div>
      </div>

      <div class="mt-8 flex justify-center">
        <PaginationControls
          meta={meta.value}
          currentPage={currentPage.value}
          onPageChange$={handlePageChange}
        />
      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Informasi & Edukasi - Si-DIFA",
  meta: [
    {
      name: "description",
      content: "Informasi dan Edukasi untuk Kader Posyandu Si-DIFA",
    },
  ],
};
