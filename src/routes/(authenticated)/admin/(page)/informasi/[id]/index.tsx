import { component$, useTask$, useSignal, $ } from "@qwik.dev/core";
import { useAuth } from "~/hooks";
import { useInformasiEdukasiAdmin } from "~/hooks/useInformasiEdukasiAdmin";
import Alert from "~/components/ui/Alert";
import { useNavigate, useLocation } from "@qwik.dev/router";
import { InformasiDetailCard } from "~/components/admin/information";
import { GenericLoadingSpinner, ConfirmationModal } from "~/components/common";
import type { InformasiItem } from "~/types/informasi";

export default component$(() => {
  const { fetchDetail, deleteItem, loading, error, success } =
    useInformasiEdukasiAdmin();
  const nav = useNavigate();
  const loc = useLocation();
  const detail = useSignal<InformasiItem | null>(null);
  const showDeleteModal = useSignal(false);

  const { isLoggedIn } = useAuth();

  useTask$(async ({ track }) => {
    track(isLoggedIn);
    track(() => loc.params.id); // Track loc.params.id directly

    if (isLoggedIn.value && loc.params.id) {
      const data = await fetchDetail(loc.params.id); // Use loc.params.id directly
      detail.value = data || null;
    }
  });

  const handleEdit = $((id: string) => {
    nav(`/admin/informasi/${id}/edit`);
  });

  const handleDeleteClick = $(() => {
    showDeleteModal.value = true;
  });

  const handleConfirmDelete = $(async () => {
    if (detail.value?.id) {
      await deleteItem(detail.value.id);
      showDeleteModal.value = false;
      if (!error.value) {
        // Only navigate if delete was successful from API perspective
        nav("/admin/informasi");
      }
    }
  });

  const handleCancelDelete = $(() => {
    showDeleteModal.value = false;
  });

  return (
    <div class="p-4">
      <h1 class="text-2xl font-bold mb-4">Detail Informasi Edukasi</h1>
      {error.value && <Alert type="error" message={error.value} />}
      {success.value && <Alert type="success" message={success.value} />}
      {loading.value ? (
        <GenericLoadingSpinner />
      ) : detail.value ? (
        <InformasiDetailCard
          item={detail.value}
          onEdit$={handleEdit}
          onDelete$={handleDeleteClick}
        />
      ) : (
        <div class="text-center py-8 text-base-content/70">
          Data tidak ditemukan
        </div>
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
