import { component$, useSignal, useTask$, $ } from "@qwik.dev/core";
import type { DocumentHead } from "@qwik.dev/router";
import { useAuth } from "~/hooks";
import { useAdminPsikolog } from "~/hooks/useAdminPsikolog"; // Assuming this hook exists

import {
  AdminPsikologListHeader,
  AdminPsikologFilterControls,
  AdminPsikologTable,
  AdminPsikologForm,
  AdminPsikologFormData,
} from "~/components/admin/psikolog-management";
import {
  PaginationControls,
  ConfirmationModal,
  GenericLoadingSpinner,
} from "~/components/common";
import Alert from "~/components/ui/Alert";
import { QSuspense } from "~/integrations/react/Suspense";

import type {
  AdminPsikologItem,
  AdminPsikologFilterOptions,
} from "~/types/admin-psikolog-management";
import type { PaginationMeta } from "~/types/posyandu"; // Reusing pagination meta

export default component$(() => {
  const { isLoggedIn } = useAuth();
  const {
    items: psikologList,
    loading,
    error,
    success,
    total,
    // Removed unused currentPageFromHook and limitFromHook
    fetchList,
    createItem,
    updateItem,
    deleteItem,
    clearMessages,
  } = useAdminPsikolog();

  const filterOptions = useSignal<AdminPsikologFilterOptions>({
    nama: "",
    spesialisasi: "",
    status: "",
  });
  const currentPage = useSignal(1);
  const limit = useSignal(10);

  const showCreateModal = useSignal(false);
  const showEditModal = useSignal(false);
  const showDeleteModal = useSignal(false);
  const showToggleStatusModal = useSignal(false);
  const selectedPsikolog = useSignal<AdminPsikologItem | null>(null);

  const handleFetchPsikolog = $(async () => {
    await fetchList({
      limit: limit.value,
      page: currentPage.value,
      nama: filterOptions.value.nama || undefined,
      spesialisasi: filterOptions.value.spesialisasi || undefined,
      status: filterOptions.value.status || undefined,
    });
  });

  useTask$(({ track }) => {
    track(isLoggedIn);
    track(() => filterOptions.value.nama);
    track(() => filterOptions.value.spesialisasi);
    track(() => filterOptions.value.status);
    track(currentPage);
    track(limit);

    if (isLoggedIn.value) {
      handleFetchPsikolog();
    } else {
      psikologList.value = [];
    }
  });

  const handleFilterChange = $(() => {
    currentPage.value = 1;
  });

  // Removed handleLimitChange as it was unused
  /*
  const handleLimitChange = $((event: Event) => {
    const newLimit = parseInt((event.target as HTMLSelectElement).value);
    if (newLimit !== limit.value) {
      limit.value = newLimit;
      currentPage.value = 1;
    }
  });
  */

  const handlePageChange = $((pageNumber: number) => {
    if (meta.totalPage && (pageNumber < 1 || pageNumber > meta.totalPage))
      return;
    currentPage.value = pageNumber;
  });

  const openCreateModal = $(() => {
    showCreateModal.value = true;
    clearMessages();
  });

  const openEditModal = $((psikolog: AdminPsikologItem) => {
    selectedPsikolog.value = psikolog;
    showEditModal.value = true;
    clearMessages();
  });

  const openDeleteModal = $((psikolog: AdminPsikologItem) => {
    selectedPsikolog.value = psikolog;
    showDeleteModal.value = true;
    clearMessages();
  });

  const openToggleStatusModal = $((psikolog: AdminPsikologItem) => {
    selectedPsikolog.value = psikolog;
    showToggleStatusModal.value = true;
    clearMessages();
  });

  const closeModals = $(() => {
    showCreateModal.value = false;
    showEditModal.value = false;
    showDeleteModal.value = false;
    showToggleStatusModal.value = false;
    selectedPsikolog.value = null;
    clearMessages();
    handleFetchPsikolog();
  });

  const handleCreate = $(async (data: AdminPsikologFormData) => {
    await createItem(data);
    if (!error.value) {
      closeModals();
    }
  });

  const handleUpdate = $(async (data: AdminPsikologFormData) => {
    if (!selectedPsikolog.value) return;
    await updateItem({
      id: selectedPsikolog.value.id,
      ...data,
    });
    if (!error.value) {
      closeModals();
    }
  });

  const handleDelete = $(async () => {
    if (!selectedPsikolog.value) return;
    await deleteItem(selectedPsikolog.value.id);
    if (!error.value) {
      closeModals();
    }
  });

  const handleToggleStatus = $(async () => {
    if (!selectedPsikolog.value) return;
    const newStatus =
      selectedPsikolog.value.status === "Aktif" ? "Tidak Aktif" : "Aktif";
    await updateItem({
      id: selectedPsikolog.value.id,
      status: newStatus,
      // Pass other required fields if your API needs full object for update
      nama: selectedPsikolog.value.nama,
      email: selectedPsikolog.value.email,
      no_telp: selectedPsikolog.value.no_telp,
      spesialisasi: selectedPsikolog.value.spesialisasi,
    });
    if (!error.value) {
      closeModals();
    }
  });

  const meta: PaginationMeta = {
    totalData: total.value,
    totalPage: Math.ceil(total.value / limit.value),
    currentPage: currentPage.value,
    limit: limit.value,
  };

  return (
    <div>
      <AdminPsikologListHeader
        title="Manajemen Data Psikolog"
        description="Kelola data psikolog yang terdaftar pada sistem, termasuk informasi detail, status, dan riwayat."
      />

      <div class="flex justify-end mb-6">
        <button class="btn btn-primary" onClick$={openCreateModal}>
          Tambah Psikolog Baru
        </button>
      </div>

      {error.value && <Alert type="error" message={error.value} />}
      {success.value && <Alert type="success" message={success.value} />}

      <AdminPsikologFilterControls
        filterOptions={filterOptions}
        onFilterChange$={handleFilterChange}
      />

      <QSuspense fallback={<GenericLoadingSpinner />}>
        <AdminPsikologTable
          items={psikologList.value}
          page={currentPage.value}
          limit={limit.value}
          onViewDetail$={(item) => console.log(`View detail for ${item.id}`)}
          onEdit$={openEditModal}
          onDelete$={openDeleteModal}
          onToggleStatus$={openToggleStatusModal}
        />
      </QSuspense>

      {meta.totalPage > 1 && (
        <PaginationControls
          meta={meta}
          currentPage={currentPage.value}
          onPageChange$={handlePageChange}
        />
      )}

      {/* Create Modal */}
      {showCreateModal.value && (
        <ConfirmationModal
          isOpen={showCreateModal}
          title="Tambah Psikolog Baru"
          message=""
          onConfirm$={$(() => {})}
          onCancel$={closeModals}
          confirmButtonText="Simpan"
          cancelButtonText="Batal"
          confirmButtonClass="btn-primary"
        >
          <AdminPsikologForm
            onSubmit$={handleCreate}
            loading={loading.value}
            submitButtonText="Simpan Psikolog"
          />
        </ConfirmationModal>
      )}

      {/* Edit Modal */}
      {showEditModal.value && selectedPsikolog.value && (
        <ConfirmationModal
          isOpen={showEditModal}
          title="Edit Data Psikolog"
          message=""
          onConfirm$={$(() => {})}
          onCancel$={closeModals}
          confirmButtonText="Simpan Perubahan"
          cancelButtonText="Batal"
          confirmButtonClass="btn-primary"
        >
          <AdminPsikologForm
            initialData={selectedPsikolog.value}
            onSubmit$={handleUpdate}
            loading={loading.value}
            submitButtonText="Simpan Perubahan"
          />
        </ConfirmationModal>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal.value && selectedPsikolog.value && (
        <ConfirmationModal
          isOpen={showDeleteModal}
          title="Konfirmasi Hapus Psikolog"
          message={`Apakah Anda yakin ingin menghapus psikolog "${selectedPsikolog.value.nama}"? Tindakan ini tidak dapat dibatalkan.`}
          onConfirm$={handleDelete}
          onCancel$={closeModals}
          confirmButtonText="Hapus"
          cancelButtonText="Batal"
          confirmButtonClass="btn-error"
        />
      )}

      {/* Toggle Status Confirmation Modal */}
      {showToggleStatusModal.value && selectedPsikolog.value && (
        <ConfirmationModal
          isOpen={showToggleStatusModal}
          title="Konfirmasi Perubahan Status"
          message={`Apakah Anda yakin ingin ${selectedPsikolog.value.status === "Aktif" ? "menonaktifkan" : "mengaktifkan"} psikolog "${selectedPsikolog.value.nama}"?`}
          onConfirm$={handleToggleStatus}
          onCancel$={closeModals}
          confirmButtonText={
            selectedPsikolog.value.status === "Aktif"
              ? "Nonaktifkan"
              : "Aktifkan"
          }
          cancelButtonText="Batal"
          confirmButtonClass={
            selectedPsikolog.value.status === "Aktif"
              ? "btn-warning"
              : "btn-success"
          }
        />
      )}
    </div>
  );
});

export const head: DocumentHead = {
  title: "Manajemen Psikolog - Si-DIFA Admin",
  meta: [
    {
      name: "description",
      content: "Halaman manajemen data psikolog untuk admin Si-DIFA",
    },
  ],
};
