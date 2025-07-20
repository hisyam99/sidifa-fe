import { component$, useTask$, useSignal, $ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city"; // Corrected DocumentHead import
import { useAuth } from "~/hooks";
import { useInformasiEdukasiAdmin } from "~/hooks/useInformasiEdukasiAdmin";
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
import type { PaginationMeta } from "~/types/posyandu"; // Reusing pagination meta from posyandu

export default component$(() => {
  const { items, loading, error, success, page, limit, fetchList, deleteItem } =
    useInformasiEdukasiAdmin();
  const nav = useNavigate();

  const filterOptions = useSignal<InformasiFilterOptions>({
    judul: "",
    deskripsi: "",
    tipe: "",
  });
  const deleteId = useSignal<string | null>(null);
  const showDeleteModal = useSignal(false);

  const { isLoggedIn } = useAuth();

  const meta = useSignal<PaginationMeta | null>(null); // Initialize meta signal

  useTask$(({ track }) => {
    track(isLoggedIn);
    track(() => filterOptions.value.judul);
    track(() => filterOptions.value.deskripsi);
    track(() => filterOptions.value.tipe);
    track(page);
    track(limit);

    if (isLoggedIn.value) {
      fetchList({
        judul: filterOptions.value.judul,
        deskripsi: filterOptions.value.deskripsi,
        tipe: filterOptions.value.tipe,
        page: page.value,
        limit: limit.value,
      }).then((response: any) => {
        // Assuming fetchList returns a response with data and meta
        items.value = response.data as InformasiItem[];
        meta.value = response.meta as PaginationMeta;
      });
    } else {
      items.value = [];
      error.value =
        "Anda tidak memiliki akses untuk melihat data ini. Silakan login.";
    }
  });

  const handleFilterChange = $(() => {
    page.value = 1; // Reset page to 1 on filter change
    // fetchList will be triggered by useTask$ reacting to page/filter changes
  });

  const handlePageChange = $((newPage: number) => {
    if (meta.value && newPage >= 1 && newPage <= meta.value.totalPage) {
      page.value = newPage;
      // fetchList will be triggered by useTask$ reacting to page changes
    }
  });

  const handleDeleteClick = $((id: string) => {
    deleteId.value = id;
    showDeleteModal.value = true;
  });

  const handleConfirmDelete = $(async () => {
    if (deleteId.value) {
      await deleteItem(deleteId.value);
      showDeleteModal.value = false;
      deleteId.value = null;
      // Re-fetch list after delete to update table
      fetchList({
        judul: filterOptions.value.judul,
        deskripsi: filterOptions.value.deskripsi,
        tipe: filterOptions.value.tipe,
        page: page.value,
        limit: limit.value,
      });
    }
  });

  const handleCancelDelete = $(() => {
    showDeleteModal.value = false;
    deleteId.value = null;
  });

  return (
    <div class="p-4">
      <h1 class="text-2xl font-bold mb-4">Manajemen Informasi Edukasi</h1>

      <div class="mb-6 flex justify-end">
        <button
          class="btn btn-primary"
          onClick$={() => nav("/admin/informasi/create")}
        >
          Tambah Informasi Baru
        </button>
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
          page={page.value}
          limit={limit.value}
        >
          {items.value.map((item: InformasiItem) => (
            <>
              <button
                q:slot={`edit-${item.id}`}
                class="btn btn-sm btn-primary mr-2"
                onClick$={() => nav(`/admin/informasi/${item.id}/edit`)}
              >
                Edit
              </button>
              <button
                q:slot={`delete-${item.id}`}
                class="btn btn-sm btn-error"
                onClick$={() => handleDeleteClick(item.id)}
              >
                Delete
              </button>
            </>
          ))}
        </InformasiTable>
      )}

      {meta.value && meta.value.totalPage > 1 && (
        <PaginationControls
          meta={meta.value}
          currentPage={page.value}
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
