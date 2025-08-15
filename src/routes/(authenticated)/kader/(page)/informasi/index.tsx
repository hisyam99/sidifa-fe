import { component$, useSignal, $ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import {
  SearchBox,
  PaginationControls,
  GenericLoadingSpinner,
} from "~/components/common";
import {
  InformationArticleCard,
  InformationArticleCardSkeleton,
} from "~/components/information";
import { useInformasiEdukasiKader } from "~/hooks/useInformasiEdukasiKader";
import { usePagination } from "~/hooks/usePagination";
import { useDebouncer } from "~/utils/debouncer";
import { useAuth } from "~/hooks";
import { LuSearch, LuFilter } from "~/components/icons/lucide-optimized";
import { buildInformasiEdukasiUrl } from "~/utils/url";

export default component$(() => {
  const { isLoggedIn } = useAuth();

  const filterOptions = useSignal<{ judul?: string; deskripsi?: string }>({
    judul: "",
    deskripsi: "",
  });

  const { items, loading, error, total, totalPage, fetchList } =
    useInformasiEdukasiKader();

  const hasRequested = useSignal(false);
  const gridRef = useSignal<HTMLElement>();

  const {
    currentPage,
    currentLimit,
    meta,
    handlePageChange,
    handleLimitChange,
  } = usePagination<{ judul?: string; deskripsi?: string }>({
    initialPage: 1,
    initialLimit: 9,
    fetchList: $((params) => {
      if (isLoggedIn.value) {
        hasRequested.value = true;
        fetchList(params);
        // Scroll to top of the grid smoothly
        setTimeout(() => {
          const el = gridRef.value;
          if (el) {
            const offset = 170; // leave some space from the top
            const y = el.getBoundingClientRect().top + window.scrollY - offset;
            window.scrollTo({ top: y, behavior: "smooth" });
          }
        }, 0);
      }
    }),
    total,
    totalPage,
    filters: filterOptions,
    dependencies: [isLoggedIn],
  });

  const handleSearchImmediate = $((value: string) => {
    filterOptions.value = { ...filterOptions.value, judul: value };
    handlePageChange(1);
  });
  const handleSearchDebounced = useDebouncer(handleSearchImmediate, 400);

  const stripHtml = (html: string) => {
    if (typeof document === "undefined") return html;
    const div = document.createElement("div");
    div.innerHTML = html;
    return div.textContent || div.innerText || "";
  };

  return (
    <div class="min-h-screen">
      {/* Title and Description Section */}
      <div>
        <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 text-base-content">
          Informasi & Edukasi
        </h1>
        <p class="text-lg md:text-xl text-base-content/80 leading-relaxed">
          Kumpulan artikel, panduan, dan materi edukasi terkini seputar
          disabilitas dan layanan posyandu untuk meningkatkan pengetahuan dan
          keterampilan Anda.
        </p>
      </div>

      {/* Sticky Search and Filter Section */}
      <div class="pt-4 pb-6 sticky top-16 z-20 ">
        <div class="bg-base-100 border-b border-base-300 card card-compact shadow-sm container mx-auto px-4 py-4">
          <div class="flex flex-col md:flex-row gap-4 items-stretch md:items-center">
            <div class="flex-1 relative">
              <LuSearch class="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/40 w-5 h-5" />
              <SearchBox
                placeholder="Cari artikel, panduan, atau materi edukasi..."
                value={filterOptions.value.judul || ""}
                onInput$={(e) =>
                  handleSearchDebounced((e.target as HTMLInputElement).value)
                }
                onEnter$={$(() => {})}
                class="pl-10 input input-bordered w-full"
              />
            </div>
            <div class="flex items-center gap-3">
              <LuFilter class="text-base-content/40 w-5 h-5" />
              <select
                class="select select-bordered min-w-fit"
                value={String(currentLimit.value)}
                onChange$={$((e: Event) =>
                  handleLimitChange(
                    parseInt((e.target as HTMLSelectElement).value),
                  ),
                )}
              >
                <option value="9">9 artikel</option>
                <option value="18">18 artikel</option>
                <option value="27">27 artikel</option>
                <option value="36">36 artikel</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div class="px-2">
        {error.value && (
          <div class="alert alert-error mb-6">
            <span>{error.value}</span>
          </div>
        )}

        {/* Articles Grid */}
        <div class="relative">
          {loading.value && <GenericLoadingSpinner overlay size="w-12 h-12" />}

          {(items.value?.length || 0) > 0 ? (
            <div
              ref={gridRef}
              class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {items.value.map((item) => (
                <InformationArticleCard
                  key={item.id}
                  title={item.judul}
                  category={item.tipe || "Informasi"}
                  image={
                    item.file_name
                      ? buildInformasiEdukasiUrl(item.file_name)
                      : undefined
                  }
                  excerpt={item.deskripsi}
                  date={item.created_at || ""}
                  readTime={Math.ceil(
                    stripHtml(item.deskripsi || "").length / 200,
                  )}
                  href={`/kader/informasi/${item.id}`}
                />
              ))}
            </div>
          ) : loading.value ? (
            <div
              ref={gridRef}
              class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {Array.from({ length: currentLimit.value }).map((_, index) => (
                <InformationArticleCardSkeleton key={index} />
              ))}
            </div>
          ) : hasRequested.value ? (
            <div class="text-center py-12">
              <div class="w-24 h-24 bg-base-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <LuSearch class="w-12 h-12 text-base-content/40" />
              </div>
              <h3 class="text-lg font-semibold text-base-content mb-2">
                Tidak ada artikel ditemukan
              </h3>
              <p class="text-base-content/60 max-w-md mx-auto">
                Coba ubah kata kunci pencarian atau periksa kembali filter yang
                dipilih.
              </p>
            </div>
          ) : null}
        </div>

        {/* Pagination */}
        {(items.value?.length || 0) > 0 && (
          <PaginationControls
            meta={meta.value}
            currentPage={currentPage.value}
            onPageChange$={handlePageChange}
          />
        )}
      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Informasi & Edukasi",
  meta: [{ name: "description", content: "Informasi dan edukasi untuk kader" }],
};
