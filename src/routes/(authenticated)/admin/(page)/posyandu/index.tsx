import {
  component$,
  useSignal,
  useTask$,
  useComputed$,
  $,
} from "@builder.io/qwik";
import { useAuth } from "~/hooks";
import { useAdminPosyandu } from "~/hooks/useAdminPosyandu";
import type { DocumentHead } from "@builder.io/qwik-city";

import {
  AdminPosyanduListHeader,
  AdminPosyanduFilterControls,
  AdminPosyanduTable,
  AdminPosyanduForm,
  AdminPosyanduFormData,
  AdminPosyanduDetailCard,
} from "~/components/admin/posyandu-management";
import { PaginationControls, ConfirmationModal } from "~/components/common";
import Alert from "~/components/ui/Alert"; // Keeping the existing Alert component

import type {
  AdminPosyanduItem,
  AdminPosyanduFilterOptions,
} from "~/types/admin-posyandu-management";
import type { PaginationMeta } from "~/types/posyandu";

export default component$(() => {
  const { isLoggedIn } = useAuth();
  const {
    items: posyanduList,
    loading,
    error,
    success,
    totalData,
    totalPage,
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
  const currentPageLocal = useSignal(1);
  const limit = useSignal(10);

  // Reactive meta calculation
  const meta = useComputed$<PaginationMeta>(() => {
    return {
      totalData: totalData.value,
      totalPage: totalPage.value,
      currentPage: currentPageLocal.value,
      limit: limit.value,
    };
  });

  // Modal states
  const showCreateModal = useSignal(false);
  const showEditModal = useSignal(false);
  const showDeleteModal = useSignal(false);
  const showDetailModal = useSignal(false);
  const showToggleStatusModal = useSignal(false);
  const selectedPosyandu = useSignal<AdminPosyanduItem | null>(null);

  const handleFetchPosyandu = $(async () => {
    console.log("Fetching posyandu with filters:", {
      limit: limit.value,
      page: currentPageLocal.value,
      nama_posyandu: filterOptions.value.nama_posyandu,
    });

    await fetchList({
      limit: limit.value,
      page: currentPageLocal.value,
      nama_posyandu: filterOptions.value.nama_posyandu || undefined,
    });
  });

  // Initial load and re-load on filter/pagination changes
  useTask$(({ track }) => {
    track(isLoggedIn);
    track(currentPageLocal);
    track(limit);

    if (isLoggedIn.value) {
      handleFetchPosyandu();
    }
  });

  const handleFilterChange = $(async () => {
    currentPageLocal.value = 1; // Reset page to 1 on any filter change
    await handleFetchPosyandu(); // Fetch data with new filter
  });

  const handlePageChange = $((pageNumber: number) => {
    if (
      meta.value.totalPage &&
      (pageNumber < 1 || pageNumber > meta.value.totalPage)
    )
      return;
    currentPageLocal.value = pageNumber;
  });

  const handleLimitChange = $((newLimit: number) => {
    limit.value = newLimit;
    currentPageLocal.value = 1; // Reset to first page when limit changes
    handleFetchPosyandu();
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

  const openDetailModal = $((posyandu: AdminPosyanduItem) => {
    selectedPosyandu.value = posyandu;
    showDetailModal.value = true;
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
    showDetailModal.value = false;
    showToggleStatusModal.value = false;
    selectedPosyandu.value = null;
    clearMessages();
  });

  // Form handlers
  const handleCreate = $(async (data: AdminPosyanduFormData) => {
    try {
      // Extract only the required fields for creation
      const createData = {
        nama_posyandu: data.nama_posyandu,
        alamat: data.alamat,
        no_telp: data.no_telp,
      };
      await createItem(createData);
      if (!error.value) {
        closeModals();
      }
    } catch (err) {
      console.error("Error creating posyandu:", err);
    }
  });

  const handleUpdate = $(async (data: AdminPosyanduFormData) => {
    if (!selectedPosyandu.value) return;
    try {
      // Extract only the required fields for update
      const updateData = {
        id: selectedPosyandu.value.id,
        nama_posyandu: data.nama_posyandu,
        alamat: data.alamat,
        no_telp: data.no_telp,
      };
      await updateItem(updateData);
      if (!error.value) {
        closeModals();
      }
    } catch (err) {
      console.error("Error updating posyandu:", err);
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
    try {
      const newStatus: "Aktif" | "Tidak Aktif" =
        selectedPosyandu.value.status === "Aktif" ? "Tidak Aktif" : "Aktif";
      const updateData = {
        id: selectedPosyandu.value.id,
        nama_posyandu: selectedPosyandu.value.nama_posyandu,
        alamat: selectedPosyandu.value.alamat,
        no_telp: selectedPosyandu.value.no_telp,
        status: newStatus,
      };
      await updateItem(updateData);
      if (!error.value) {
        closeModals();
      }
    } catch (err) {
      console.error("Error toggling status:", err);
    }
  });

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
        limit={limit}
        onLimitChange$={handleLimitChange}
      />

      <AdminPosyanduTable
        items={posyanduList.value}
        page={currentPageLocal.value}
        limit={limit.value}
        loading={loading.value}
        onViewDetail$={openDetailModal}
        onEdit$={openEditModal}
        onDelete$={openDeleteModal}
        onToggleStatus$={openToggleStatusModal}
      />

      {meta.value.totalPage > 1 && (
        <PaginationControls
          meta={meta.value}
          currentPage={currentPageLocal.value}
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
          confirmButtonText=""
          cancelButtonText="Tutup"
          confirmButtonClass="hidden"
          cancelButtonClass="btn-ghost"
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
          confirmButtonText=""
          cancelButtonText="Tutup"
          confirmButtonClass="hidden"
          cancelButtonClass="btn-ghost"
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

      {/* Detail Modal */}
      {showDetailModal.value && selectedPosyandu.value && (
        <ConfirmationModal
          isOpen={showDetailModal}
          title="Detail Posyandu"
          message=""
          onConfirm$={$(() => {})}
          onCancel$={closeModals}
          confirmButtonText=""
          cancelButtonText="Tutup"
          confirmButtonClass="hidden"
          cancelButtonClass="btn-ghost"
        >
          <AdminPosyanduDetailCard
            item={selectedPosyandu.value}
            onEdit$={$((id: string) => {
              const item = posyanduList.value.find((p) => p.id === id);
              if (item) openEditModal(item);
            })}
            onDelete$={$((id: string) => {
              const item = posyanduList.value.find((p) => p.id === id);
              if (item) openDeleteModal(item);
            })}
            onToggleStatus$={$((id: string) => {
              const item = posyanduList.value.find((p) => p.id === id);
              if (item) openToggleStatusModal(item);
            })}
          />
        </ConfirmationModal>
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
  title: "Manajemen Posyandu - Si-DIFA",
  meta: [
    {
      name: "description",
      content: "Halaman manajemen data Posyandu untuk admin Si-DIFA",
    },
  ],
};
