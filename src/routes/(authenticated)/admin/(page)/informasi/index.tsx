import { component$, useSignal, $, useVisibleTask$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { useAuth } from "~/hooks/useAuth";
import { useInformasiEdukasiAdmin } from "~/hooks/useInformasiEdukasiAdmin";
import { usePagination } from "~/hooks/usePagination";
import Alert from "~/components/ui/Alert";
import { useNavigate } from "@builder.io/qwik-city";
import {
  InformasiTable,
  InformasiFilterBar,
} from "~/components/admin/information";
import { PaginationControls, ConfirmationModal } from "~/components/common";
import type { InformasiItem, InformasiFilterOptions } from "~/types/informasi";
import { informasiEdukasiAdminService } from "~/services/api";
import { buildInformasiEdukasiUrl } from "~/utils/url";
import { marked } from "marked";
import DOMPurify from "dompurify";

export default component$(() => {
  const { isLoggedIn } = useAuth();
  const {
    items,
    loading,
    error,
    success,
    total,
    fetchList,
    deleteItem,
    totalPage,
  } = useInformasiEdukasiAdmin();

  const filterOptions = useSignal<InformasiFilterOptions>({
    judul: "",
    deskripsi: "",
    tipe: "",
  });
  const deleteId = useSignal<string | null>(null);
  const showDeleteModal = useSignal(false);

  const nav = useNavigate();

  // Summary counters (global)
  const totalInformasi = useSignal<number>(0);
  const totalArtikel = useSignal<number>(0);
  const totalPanduan = useSignal<number>(0);
  const totalRegulasi = useSignal<number>(0);

  const {
    currentPage,
    currentLimit,
    meta,
    handlePageChange,
    handleLimitChange,
    resetPage,
  } = usePagination<InformasiFilterOptions>({
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

  // Fetch summary counters lazily on client so table loads first
  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(async ({ track }) => {
    track(isLoggedIn);
    if (!isLoggedIn.value) return;

    try {
      const stats = await informasiEdukasiAdminService.statistik();
      const count = stats?.count ?? stats ?? {};
      totalInformasi.value = Number(count.total ?? 0);
      totalArtikel.value = Number(count.artikel ?? 0);
      totalPanduan.value = Number(count.panduan ?? 0);
      totalRegulasi.value = Number(count.regulasi ?? 0);
    } catch {
      // ignore summary errors; don't block table
    }
  });

  // Filter change handler resets page and triggers fetch
  const handleFilterChange = $(async () => {
    await resetPage();
    await fetchList({
      ...filterOptions.value,
      page: 1,
      limit: currentLimit.value,
    });
  });

  const handleDeleteClick = $((id: string) => {
    deleteId.value = id;
    showDeleteModal.value = true;
  });

  const handleConfirmDelete = $(async () => {
    if (deleteId.value) {
      try {
        await deleteItem(deleteId.value);
        showDeleteModal.value = false;
        deleteId.value = null;
        // Refresh list after delete
        if (isLoggedIn.value) {
          fetchList({
            limit: currentLimit.value,
            page: currentPage.value,
            ...filterOptions.value,
          });
        }
      } catch {
        showDeleteModal.value = false;
        deleteId.value = null;
      }
    }
  });

  const handleCancelDelete = $(() => {
    showDeleteModal.value = false;
    deleteId.value = null;
  });

  const renderParagraphPreview = (md: string) => {
    const raw = (md || "").toString();
    const tokens = marked.lexer(raw);
    const paragraphTokens = tokens.filter((t) => t.type === "paragraph");
    const firstParagraph =
      paragraphTokens.length > 0 ? [paragraphTokens[0]] : [];
    const html = marked.parser(firstParagraph);
    return DOMPurify.sanitize(html as string);
  };

  return (
    <div class="space-y-6">
      <div class="flex flex-col md:flex-row md:justify-between md:items-center gap-3">
        <div class="min-w-0">
          <h1 class="text-xl sm:text-2xl font-bold break-words">
            Manajemen Informasi Edukasi
          </h1>
          <p class="text-sm sm:text-base text-base-content/70 mt-1 break-words">
            Kelola artikel, panduan, dan materi edukasi untuk pengguna
          </p>
        </div>
        <div class="w-full md:w-auto">
          <button
            class="btn btn-primary gap-2 w-full md:w-auto"
            onClick$={() => nav("/admin/informasi/create")}
          >
            <svg
              class="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            Tambah Informasi Baru
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div class="stat bg-base-100 rounded-lg shadow">
          <div class="stat-figure text-primary">
            <svg
              class="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <div class="stat-title">Total Informasi</div>
          <div class="stat-value text-primary">{totalInformasi.value}</div>
          <div class="stat-desc">Semua jenis konten</div>
        </div>

        <div class="stat bg-base-100 rounded-lg shadow">
          <div class="stat-figure text-success">
            <svg
              class="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
              />
            </svg>
          </div>
          <div class="stat-title">Artikel</div>
          <div class="stat-value text-success">{totalArtikel.value}</div>
        </div>

        <div class="stat bg-base-100 rounded-lg shadow">
          <div class="stat-figure text-info">
            <svg
              class="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <div class="stat-title">Panduan</div>
          <div class="stat-value text-info">{totalPanduan.value}</div>
        </div>

        <div class="stat bg-base-100 rounded-lg shadow">
          <div class="stat-figure text-warning">
            <svg
              class="w-8 h-8"
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
          </div>
          <div class="stat-title">Regulasi</div>
          <div class="stat-value text-warning">{totalRegulasi.value}</div>
        </div>
      </div>

      <InformasiFilterBar
        filterOptions={filterOptions}
        onFilterChange$={handleFilterChange}
        limit={currentLimit}
        onLimitChange$={handleLimitChange}
      />

      {error.value && <Alert type="error" message={error.value} />}
      {success.value && <Alert type="success" message={success.value} />}

      {/* Mobile list (cards) */}
      <div class="block md:hidden">
        <div class="space-y-4">
          {(items.value || []).map((item) => (
            <div key={item.id} class="card bg-base-100 shadow-md">
              {item.file_name ? (
                <div class="relative h-36 overflow-hidden rounded-t-2xl">
                  <img
                    src={buildInformasiEdukasiUrl(item.file_name)}
                    alt={item.judul}
                    width={640}
                    height={144}
                    class="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div class="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                  <div class="absolute top-2 left-2">
                    <span class="badge badge-primary badge-sm">
                      {(item.tipe || "").toString().toUpperCase()}
                    </span>
                  </div>
                </div>
              ) : null}
              <div class="card-body p-4">
                <div class="flex items-center gap-2 text-xs text-base-content/60 mb-2">
                  <span>
                    {new Date(item.created_at || "").toLocaleDateString(
                      "id-ID",
                      {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      },
                    )}
                  </span>
                </div>
                <h3 class="font-semibold text-base-content text-lg leading-snug line-clamp-2">
                  {item.judul}
                </h3>
                <div
                  class="prose prose-sm max-w-none text-base-content/80 leading-relaxed line-clamp-3"
                  dangerouslySetInnerHTML={renderParagraphPreview(
                    item.deskripsi,
                  )}
                />
                <div class="card-actions justify-between mt-2">
                  <div class="badge badge-outline badge-sm">
                    {(item.tipe || "Informasi").toString()}
                  </div>
                  <div class="flex items-center gap-2">
                    <button
                      class="btn btn-ghost btn-xs text-info"
                      onClick$={() => nav(`/admin/informasi/${item.id}`)}
                    >
                      Detail
                    </button>
                    <button
                      class="btn btn-ghost btn-xs text-primary"
                      onClick$={() => nav(`/admin/informasi/${item.id}/edit`)}
                    >
                      Edit
                    </button>
                    <button
                      class="btn btn-ghost btn-xs text-error"
                      onClick$={() => handleDeleteClick(item.id)}
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Desktop table */}
      <div class="hidden md:block">
        <InformasiTable
          items={items.value}
          page={currentPage.value}
          limit={currentLimit.value}
          loading={loading.value}
        >
          {items.value.map((item: InformasiItem) => [
            <div
              q:slot={`edit-${item.id}`}
              key={`edit-${item.id}`}
              class="flex gap-1"
            >
              <div class="tooltip" data-tip="Lihat Detail">
                <button
                  class="btn btn-ghost btn-xs btn-square text-info"
                  onClick$={() => nav(`/admin/informasi/${item.id}`)}
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
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                </button>
              </div>
              <div class="tooltip" data-tip="Edit">
                <button
                  class="btn btn-ghost btn-xs btn-square text-primary"
                  onClick$={() => nav(`/admin/informasi/${item.id}/edit`)}
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
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                </button>
              </div>
            </div>,
            <div
              q:slot={`delete-${item.id}`}
              key={`delete-${item.id}`}
              class="tooltip"
              data-tip="Hapus"
            >
              <button
                class="btn btn-ghost btn-xs btn-square text-error"
                onClick$={() => handleDeleteClick(item.id)}
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
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            </div>,
          ])}
        </InformasiTable>
      </div>

      {meta.value && meta.value.totalPage > 1 && (
        <PaginationControls
          meta={meta.value}
          currentPage={currentPage.value}
          onPageChange$={handlePageChange}
        />
      )}

      <ConfirmationModal
        isOpen={showDeleteModal}
        title="Konfirmasi Hapus Data"
        message="Apakah Anda yakin ingin menghapus informasi ini? Tindakan ini tidak dapat dibatalkan."
        onConfirm$={handleConfirmDelete}
        onCancel$={handleCancelDelete}
      />
    </div>
  );
});

export const head: DocumentHead = {
  title: "Manajemen Informasi & Edukasi - Si-DIFA",
  meta: [
    {
      name: "description",
      content: "Manajemen Informasi dan Edukasi untuk admin Si-DIFA",
    },
  ],
};
