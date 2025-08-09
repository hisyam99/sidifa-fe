import { component$, useSignal, $, useVisibleTask$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { useAuth } from "~/hooks/useAuth";
import { useLowonganAdmin } from "~/hooks/useLowonganAdmin";
import { usePagination } from "~/hooks/usePagination";
import Alert from "~/components/ui/Alert";
import { useNavigate } from "@builder.io/qwik-city";
import { LowonganTable, LowonganFilterBar } from "~/components/admin/lowongan";
import { PaginationControls, ConfirmationModal } from "~/components/common";
import type { LowonganItem, LowonganFilterOptions } from "~/types/lowongan";

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
  } = useLowonganAdmin();

  const filterOptions = useSignal<LowonganFilterOptions>({});
  const deleteId = useSignal<string | null>(null);
  const showDeleteModal = useSignal(false);
  const nav = useNavigate();

  const {
    currentPage,
    currentLimit,
    meta,
    handlePageChange,
    handleLimitChange,
    resetPage,
  } = usePagination<LowonganFilterOptions>({
    initialPage: 1,
    initialLimit: 10,
    fetchList: $((params) => {
      if (isLoggedIn.value) fetchList(params);
    }),
    total,
    totalPage,
    filters: filterOptions,
    dependencies: [isLoggedIn],
  });

  // Lazy effects if needed in future (summary counts)
  useVisibleTask$(() => {});

  const handleFilterChange = $(async () => {
    await resetPage();
    // Trigger fetch immediately with page=1 so user sees results without paging
    if (isLoggedIn.value) {
      await fetchList({
        limit: currentLimit.value,
        page: 1,
        ...filterOptions.value,
      });
    }
  });

  const handleDeleteClick = $((id: string) => {
    deleteId.value = id;
    showDeleteModal.value = true;
  });

  const handleConfirmDelete = $(async () => {
    if (!deleteId.value) return;
    try {
      await deleteItem(deleteId.value);
      showDeleteModal.value = false;
      deleteId.value = null;
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
  });

  const handleCancelDelete = $(() => {
    showDeleteModal.value = false;
    deleteId.value = null;
  });

  return (
    <div class="p-4 space-y-6">
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-2xl font-bold">Manajemen Lowongan</h1>
          <p class="text-base-content/70 mt-1">
            Kelola lowongan kerja inklusif
          </p>
        </div>
        <button
          class="btn btn-primary gap-2"
          onClick$={() => nav("/admin/lowongan/create")}
        >
          Tambah Lowongan
        </button>
      </div>

      <LowonganFilterBar
        filterOptions={filterOptions}
        onFilterChange$={handleFilterChange}
        limit={currentLimit}
        onLimitChange$={handleLimitChange}
      />

      {error.value && <Alert type="error" message={error.value} />}
      {success.value && <Alert type="success" message={success.value} />}

      <LowonganTable
        items={items.value}
        page={currentPage.value}
        limit={currentLimit.value}
        loading={loading.value}
      >
        {items.value.map((item: LowonganItem) => [
          <div
            q:slot={`edit-${item.id}`}
            key={`edit-${item.id}`}
            class="tooltip"
            data-tip="Edit"
          >
            <button
              class="btn btn-ghost btn-xs btn-square text-primary"
              onClick$={() => nav(`/admin/lowongan/detail/${item.id}/edit`)}
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
      </LowonganTable>

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
        message="Apakah Anda yakin ingin menghapus lowongan ini? Tindakan ini tidak dapat dibatalkan."
        onConfirm$={handleConfirmDelete}
        onCancel$={handleCancelDelete}
      />
    </div>
  );
});

export const head: DocumentHead = {
  title: "Manajemen Lowongan - Si-DIFA",
  meta: [
    {
      name: "description",
      content: "Manajemen lowongan kerja inklusif untuk admin Si-DIFA",
    },
  ],
};
