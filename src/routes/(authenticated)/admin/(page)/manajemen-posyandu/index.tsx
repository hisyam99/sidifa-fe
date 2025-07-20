import { component$, useSignal, useTask$, $ } from "@builder.io/qwik";
import { useAuth } from "~/hooks";
import { useAdminPosyandu } from "~/hooks/useAdminPosyandu";
import type { DocumentHead } from "@builder.io/qwik-city";

import {
  AdminPosyanduListHeader,
  AdminPosyanduFilterControls,
  AdminPosyanduTable,
  AdminPosyanduForm,
  AdminPosyanduFormData,
} from "~/components/admin/posyandu-management";
import {
  PaginationControls,
  ConfirmationModal,
  GenericLoadingSpinner,
} from "~/components/common";
import Alert from "~/components/ui/Alert"; // Keeping the existing Alert component

import type {
  AdminPosyanduItem,
  AdminPosyanduFilterOptions,
} from "~/types/admin-posyandu-management";
import type { PaginationMeta } from "~/types/posyandu"; // Reusing pagination meta

export default component$(() => {
  const { isLoggedIn } = useAuth();
  const {
    items: posyanduList,
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
  } = useAdminPosyandu();

  const filterOptions = useSignal<AdminPosyanduFilterOptions>({
    nama_posyandu: "",
    status: "",
  });
  const currentPage = useSignal(1); // Internal state for pagination
  const limit = useSignal(10); // Internal state for limit

  // Modal states
  const showCreateModal = useSignal(false);
  const showEditModal = useSignal(false);
  const showDeleteModal = useSignal(false);
  const showToggleStatusModal = useSignal(false); // New modal for status toggle
  const selectedPosyandu = useSignal<AdminPosyanduItem | null>(null);

  // Form states - use signals directly, or initialData to form component
  // const formData = useSignal<AdminPosyanduFormData>({ nama_posyandu: '', alamat: '', no_telp: '', status: 'Aktif' });

  const handleFetchPosyandu = $(async () => {
    // console.log('Fetching posyandu with:', {
    //   limit: limit.value,
    //   page: currentPage.value,
    //   nama_posyandu: filterOptions.value.nama_posyandu || undefined,
    //   status: filterOptions.value.status || undefined,
    // });

    await fetchList({
      limit: limit.value,
      page: currentPage.value,
      nama_posyandu: filterOptions.value.nama_posyandu || undefined,
      status: filterOptions.value.status || undefined,
    });
  });

  // Initial load and re-load on filter/pagination changes
  useTask$(({ track }) => {
    track(isLoggedIn);
    track(() => filterOptions.value.nama_posyandu);
    track(() => filterOptions.value.status);
    track(currentPage);
    track(limit);

    if (isLoggedIn.value) {
      handleFetchPosyandu();
    } else {
      posyanduList.value = []; // Clear list if not logged in
      // error.value = "Anda tidak memiliki akses untuk melihat data ini. Silakan login.";
    }
  });

  const handleFilterChange = $(() => {
    currentPage.value = 1; // Reset page to 1 on any filter change
    // handleFetchPosyandu will be triggered by useTask$
  });

  // Removed handleLimitChange as it was unused
  /*
  const handleLimitChange = $((event: Event) => {
    const newLimit = parseInt((event.target as HTMLSelectElement).value);
    if (newLimit !== limit.value) {
      limit.value = newLimit;
      currentPage.value = 1; // Reset page to 1 on limit change
      // handleFetchPosyandu will be triggered by useTask$
    }
  });
  */

  const handlePageChange = $((pageNumber: number) => {
    // Ensure meta is not null before accessing its properties
    if (meta.totalPage && (pageNumber < 1 || pageNumber > meta.totalPage))
      return;
    currentPage.value = pageNumber;
    // handleFetchPosyandu will be triggered by useTask$
  });

  // Modal handlers
  const openCreateModal = $(() => {
    showCreateModal.value = true;
    clearMessages();
  });

  const openEditModal = $((posyandu: AdminPosyanduItem) => {
    selectedPosyandu.value = posyandu;
    showEditModal.value = true;
    clearMessages();
  });

  const openDeleteModal = $((posyandu: AdminPosyanduItem) => {
    selectedPosyandu.value = posyandu;
    showDeleteModal.value = true;
    clearMessages();
  });

  const openToggleStatusModal = $((posyandu: AdminPosyanduItem) => {
    selectedPosyandu.value = posyandu;
    showToggleStatusModal.value = true;
    clearMessages();
  });

  const closeModals = $(() => {
    showCreateModal.value = false;
    showEditModal.value = false;
    showDeleteModal.value = false;
    showToggleStatusModal.value = false;
    selectedPosyandu.value = null;
    clearMessages();
    handleFetchPosyandu(); // Re-fetch data after any CRUD operation
  });

  // Form handlers
  const handleCreate = $(async (data: AdminPosyanduFormData) => {
    await createItem(data);
    if (!error.value) {
      closeModals();
    }
  });

  const handleUpdate = $(async (data: AdminPosyanduFormData) => {
    if (!selectedPosyandu.value) return;
    await updateItem({
      id: selectedPosyandu.value.id,
      ...data,
    });
    if (!error.value) {
      closeModals();
    }
  });

  const handleDelete = $(async () => {
    if (!selectedPosyandu.value) return;
    await deleteItem(selectedPosyandu.value.id);
    if (!error.value) {
      closeModals();
    }
  });

  const handleToggleStatus = $(async () => {
    if (!selectedPosyandu.value) return;
    const newStatus =
      selectedPosyandu.value.status === "Aktif" ? "Tidak Aktif" : "Aktif";
    await updateItem({
      id: selectedPosyandu.value.id,
      status: newStatus, // Only sending status for this specific action
      // Pass other required fields if your API needs full object for update
      nama_posyandu: selectedPosyandu.value.nama_posyandu,
      alamat: selectedPosyandu.value.alamat,
      no_telp: selectedPosyandu.value.no_telp,
    });
    if (!error.value) {
      closeModals();
    }
  });

  // Pagination meta data for PaginationControls
  const meta: PaginationMeta = {
    totalData: total.value,
    totalPage: Math.ceil(total.value / limit.value),
    currentPage: currentPage.value,
    limit: limit.value,
  };

  return (
    <div>
      <AdminPosyanduListHeader
        title="Manajemen Data Posyandu"
        description="Kelola data posyandu yang terdaftar pada sistem, termasuk informasi detail, status, dan riwayat."
      />

      <div class="flex justify-end mb-6">
        <button class="btn btn-primary" onClick$={openCreateModal}>
          Tambah Posyandu Baru
        </button>
      </div>

      {error.value && <Alert type="error" message={error.value} />}
      {success.value && <Alert type="success" message={success.value} />}

      <AdminPosyanduFilterControls
        filterOptions={filterOptions}
        onFilterChange$={handleFilterChange}
      />

      {loading.value ? (
        <GenericLoadingSpinner />
      ) : (
        <AdminPosyanduTable
          items={posyanduList.value}
          page={currentPage.value}
          limit={limit.value}
          onViewDetail$={(item) => console.log(`View detail for ${item.id}`)} // Implement actual detail page navigation/modal
          onEdit$={openEditModal}
          onDelete$={openDeleteModal}
          onToggleStatus$={openToggleStatusModal}
        />
      )}

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
          title="Tambah Posyandu Baru"
          message=""
          onConfirm$={$(() => {})}
          onCancel$={closeModals}
          confirmButtonText="Simpan"
          cancelButtonText="Batal"
          confirmButtonClass="btn-primary"
        >
          <AdminPosyanduForm
            onSubmit$={handleCreate}
            loading={loading.value}
            submitButtonText="Simpan Posyandu"
          />
        </ConfirmationModal>
      )}

      {/* Edit Modal */}
      {showEditModal.value && selectedPosyandu.value && (
        <ConfirmationModal
          isOpen={showEditModal}
          title="Edit Data Posyandu"
          message=""
          onConfirm$={$(() => {})}
          onCancel$={closeModals}
          confirmButtonText="Simpan Perubahan"
          cancelButtonText="Batal"
          confirmButtonClass="btn-primary"
        >
          <AdminPosyanduForm
            initialData={selectedPosyandu.value}
            onSubmit$={handleUpdate}
            loading={loading.value}
            submitButtonText="Simpan Perubahan"
          />
        </ConfirmationModal>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal.value && selectedPosyandu.value && (
        <ConfirmationModal
          isOpen={showDeleteModal}
          title="Konfirmasi Hapus Posyandu"
          message={`Apakah Anda yakin ingin menghapus posyandu "${selectedPosyandu.value.nama_posyandu}"? Tindakan ini tidak dapat dibatalkan.`}
          onConfirm$={handleDelete}
          onCancel$={closeModals}
          confirmButtonText="Hapus"
          cancelButtonText="Batal"
          confirmButtonClass="btn-error"
        />
      )}

      {/* Toggle Status Confirmation Modal */}
      {showToggleStatusModal.value && selectedPosyandu.value && (
        <ConfirmationModal
          isOpen={showToggleStatusModal}
          title="Konfirmasi Perubahan Status"
          message={`Apakah Anda yakin ingin ${selectedPosyandu.value.status === "Aktif" ? "menonaktifkan" : "mengaktifkan"} posyandu "${selectedPosyandu.value.nama_posyandu}"?`}
          onConfirm$={handleToggleStatus}
          onCancel$={closeModals}
          confirmButtonText={
            selectedPosyandu.value.status === "Aktif"
              ? "Nonaktifkan"
              : "Aktifkan"
          }
          cancelButtonText="Batal"
          confirmButtonClass={
            selectedPosyandu.value.status === "Aktif"
              ? "btn-warning"
              : "btn-success"
          }
        />
      )}
    </div>
  );
});

export const head: DocumentHead = {
  title: "Manajemen Posyandu - Si-DIFA Admin",
  meta: [
    {
      name: "description",
      content: "Halaman manajemen data posyandu untuk admin Si-DIFA",
    },
  ],
};
