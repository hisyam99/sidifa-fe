import {
  component$,
  useTask$,
  useSignal,
  useComputed$,
  $,
} from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city"; // Corrected DocumentHead import
import { useAuth } from "~/hooks";
import { informasiEdukasiAdminService } from "~/services/api";
import Alert from "~/components/ui/Alert";
import { useNavigate } from "@builder.io/qwik-city";
import {
  InformasiTable,
  InformasiFilterBar,
} from "~/components/admin/information";
import {
  PaginationControls,
  ConfirmationModal,
  GenericLoadingSpinner,
} from "~/components/common";
import type { InformasiItem, InformasiFilterOptions } from "~/types/informasi"; // Import InformasiFilterOptions

export default component$(() => {
  const items = useSignal<InformasiItem[]>([]);
  const totalData = useSignal<number>(0);
  const totalPages = useSignal<number>(1);
  const currentPage = useSignal(1);
  const limit = useSignal(10);
  const loading = useSignal(true);
  const error = useSignal<string | null>(null);
  const success = useSignal<string | null>(null);

  const filterOptions = useSignal<InformasiFilterOptions>({
    judul: "",
    deskripsi: "",
    tipe: "",
  });
  const deleteId = useSignal<string | null>(null);
  const showDeleteModal = useSignal(false);

  const { isLoggedIn } = useAuth();
  const nav = useNavigate();

  const meta = useComputed$(() => ({
    totalData: totalData.value,
    totalPage: totalPages.value,
    currentPage: currentPage.value,
    limit: limit.value,
  }));

  const fetchInformasi = $(async () => {
    loading.value = true;
    error.value = null;
    success.value = null;
    try {
      const response = await informasiEdukasiAdminService.list({
        limit: limit.value,
        page: currentPage.value,
        judul: filterOptions.value.judul || undefined,
        deskripsi: filterOptions.value.deskripsi || undefined,
        tipe: filterOptions.value.tipe || undefined,
      });
      items.value = response.data;
      totalData.value = response.meta?.totalData || 0;
      totalPages.value = response.meta?.totalPage || 1;
    } catch (err: any) {
      error.value = err.message || "Gagal memuat data informasi edukasi.";
    } finally {
      loading.value = false;
    }
  });

  const deleteInformasi = $(async (id: string) => {
    loading.value = true;
    error.value = null;
    success.value = null;
    try {
      await informasiEdukasiAdminService.delete(id);
      success.value = "Berhasil menghapus informasi edukasi";
      await fetchInformasi(); // Refresh the list
    } catch (err: any) {
      error.value = err.message || "Gagal menghapus data";
    } finally {
      loading.value = false;
    }
  });

  useTask$(({ track }) => {
    track(isLoggedIn);
    track(() => filterOptions.value.judul);
    track(() => filterOptions.value.deskripsi);
    track(() => filterOptions.value.tipe);
    track(currentPage);
    track(limit);

    if (isLoggedIn.value) {
      fetchInformasi();
    } else {
      items.value = [];
      totalData.value = 0;
      totalPages.value = 1;
      error.value =
        "Anda tidak memiliki akses untuk melihat data ini. Silakan login.";
      loading.value = false;
    }
  });

  const handleFilterChange = $(() => {
    currentPage.value = 1; // Reset page to 1 on filter change
    // fetchInformasi will be triggered by useTask$ reacting to page/filter changes
  });

  const handlePageChange = $((newPage: number) => {
    if (meta.value && (newPage < 1 || newPage > meta.value.totalPage)) return;
    currentPage.value = newPage;
    // fetchInformasi will be triggered by useTask$ reacting to currentPage changes
  });

  const handleDeleteClick = $((id: string) => {
    deleteId.value = id;
    showDeleteModal.value = true;
  });

  const handleConfirmDelete = $(async () => {
    if (deleteId.value) {
      try {
        await deleteInformasi(deleteId.value);
        showDeleteModal.value = false;
        deleteId.value = null;
      } catch {
        // Error is already handled in deleteInformasi function
        showDeleteModal.value = false;
        deleteId.value = null;
      }
    }
  });

  const handleCancelDelete = $(() => {
    showDeleteModal.value = false;
    deleteId.value = null;
  });

  return (
    <div class="p-4 space-y-6">
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-2xl font-bold">Manajemen Informasi Edukasi</h1>
          <p class="text-base-content/70 mt-1">
            Kelola artikel, panduan, dan materi edukasi untuk pengguna
          </p>
        </div>
        <button
          class="btn btn-primary gap-2"
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
          <div class="stat-value text-primary">{meta.value.totalData}</div>
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
          <div class="stat-value text-success">
            {items.value.filter((item) => item.tipe === "artikel").length}
          </div>
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
          <div class="stat-value text-info">
            {items.value.filter((item) => item.tipe === "panduan").length}
          </div>
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
          <div class="stat-title">Dengan File</div>
          <div class="stat-value text-warning">
            {items.value.filter((item) => item.file_url).length}
          </div>
        </div>
      </div>

      <InformasiFilterBar
        filterOptions={filterOptions} // Changed to filterOptions
        onFilterChange$={handleFilterChange}
      />

      {error.value && <Alert type="error" message={error.value} />}
      {success.value && <Alert type="success" message={success.value} />}

      {loading.value ? (
        <GenericLoadingSpinner />
      ) : (
        <InformasiTable
          items={items.value}
          page={currentPage.value}
          limit={limit.value}
        >
          {items.value.map((item: InformasiItem) => (
            <>
              <div q:slot={`edit-${item.id}`} class="flex gap-1">
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
              </div>
              <div
                q:slot={`delete-${item.id}`}
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
              </div>
            </>
          ))}
        </InformasiTable>
      )}

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
