import { component$, useSignal, useTask$, $ } from "@builder.io/qwik";
import { useAuth } from "~/hooks";
import { useAdminPosyandu } from "~/hooks/useAdminPosyandu";
import type { DocumentHead } from "@builder.io/qwik-city";

import {
  LuPlus,
  LuPencil,
  LuTrash,
  LuLoader2,
  LuSearch,
  LuChevronLeft,
  LuChevronRight,
  LuX,
} from "@qwikest/icons/lucide";
import type { PosyanduDetail } from "~/types";

export default component$(() => {
  const { isLoggedIn } = useAuth();
  const {
    items: posyanduList,
    loading,
    error,
    success,
    total,
    page: currentPage,
    fetchList,
    createItem,
    updateItem,
    deleteItem,
    clearMessages,
  } = useAdminPosyandu();

  // Search and pagination
  const searchName = useSignal("");
  const selectedLimit = useSignal(10);

  // Modal states
  const showCreateModal = useSignal(false);
  const showEditModal = useSignal(false);
  const showDeleteModal = useSignal(false);
  const selectedPosyandu = useSignal<PosyanduDetail | null>(null);

  // Form states
  const formData = useSignal({
    nama_posyandu: "",
    alamat: "",
    no_telp: "",
  });

  const handleFetchPosyandu = $(async () => {
    await fetchList({
      limit: selectedLimit.value,
      page: currentPage.value,
      nama_posyandu: searchName.value || undefined,
    });
  });

  // Initial load
  useTask$(({ track }) => {
    track(isLoggedIn);
    if (isLoggedIn.value) {
      handleFetchPosyandu();
    }
  });

  const handleSearch = $(async () => {
    currentPage.value = 1;
    await handleFetchPosyandu();
  });

  const totalPages = Math.ceil(total.value / selectedLimit.value);

  const handlePageChange = $(async (page: number) => {
    if (page < 1 || (totalPages && page > totalPages)) return;
    currentPage.value = page;
    await handleFetchPosyandu();
  });

  const handleLimitChange = $(async (newLimit: number) => {
    selectedLimit.value = newLimit;
    currentPage.value = 1;
    await handleFetchPosyandu();
  });

  // Modal handlers
  const openCreateModal = $(() => {
    formData.value = { nama_posyandu: "", alamat: "", no_telp: "" };
    showCreateModal.value = true;
    clearMessages();
  });

  const openEditModal = $((posyandu: PosyanduDetail) => {
    selectedPosyandu.value = posyandu;
    formData.value = {
      nama_posyandu: posyandu.nama_posyandu,
      alamat: posyandu.alamat,
      no_telp: posyandu.no_telp,
    };
    showEditModal.value = true;
    clearMessages();
  });

  const openDeleteModal = $((posyandu: PosyanduDetail) => {
    selectedPosyandu.value = posyandu;
    showDeleteModal.value = true;
    clearMessages();
  });

  const closeModals = $(() => {
    showCreateModal.value = false;
    showEditModal.value = false;
    showDeleteModal.value = false;
    selectedPosyandu.value = null;
    clearMessages();
  });

  // Form handlers
  const handleCreate = $(async () => {
    await createItem(formData.value);
    if (!error.value) {
      closeModals();
    }
  });

  const handleUpdate = $(async () => {
    if (!selectedPosyandu.value) return;
    await updateItem({
      id: selectedPosyandu.value.id,
      ...formData.value,
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

  // Pagination logic: always center current page if possible
  const getPaginationButtons = (currentPage: number, totalPages: number) => {
    const buttons = [];
    const maxButtons = 5;
    if (totalPages <= maxButtons) {
      for (let i = 1; i <= totalPages; i++) {
        buttons.push(i);
      }
    } else {
      let startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2));
      let endPage = startPage + maxButtons - 1;
      if (endPage > totalPages) {
        endPage = totalPages;
        startPage = endPage - maxButtons + 1;
      }
      if (startPage > 1) {
        buttons.push(1);
        if (startPage > 2) buttons.push("...");
      }
      for (let i = startPage; i <= endPage; i++) {
        buttons.push(i);
      }
      if (endPage < totalPages) {
        if (endPage < totalPages - 1) buttons.push("...");
        buttons.push(totalPages);
      }
    }
    return buttons;
  };

  return (
    <div>
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-3xl font-bold">Manajemen Data Posyandu</h1>
        <button class="btn btn-primary" onClick$={openCreateModal}>
          <LuPlus class="w-4 h-4 mr-2" />
          Tambah Posyandu
        </button>
      </div>

      {/* Alert Messages */}
      {error.value && (
        <div class="alert alert-error mb-6">
          <LuX class="w-4 h-4" />
          <span>{error.value}</span>
        </div>
      )}

      {success.value && (
        <div class="alert alert-success mb-6">
          <span>{success.value}</span>
        </div>
      )}

      {/* Search and Filter */}
      <div class="card bg-base-100 shadow-xl mb-6">
        <div class="card-body">
          <h2 class="card-title">Pencarian</h2>
          <div class="flex flex-col md:flex-row gap-4">
            <div class="form-control flex-1">
              <label for="search-name" class="label">
                <span class="label-text">Cari berdasarkan nama posyandu</span>
              </label>
              <div class="input-group">
                <input
                  id="search-name"
                  type="text"
                  placeholder="Masukkan nama posyandu..."
                  class="input input-bordered flex-1"
                  value={searchName.value}
                  onInput$={(ev: any) => (searchName.value = ev.target.value)}
                  onKeyUp$={(ev: any) => ev.key === "Enter" && handleSearch()}
                />
                <button class="btn btn-primary" onClick$={handleSearch}>
                  <LuSearch class="w-4 h-4" />
                </button>
              </div>
            </div>
            <div class="form-control">
              <label for="limit-select" class="label">
                <span class="label-text">Limit per halaman</span>
              </label>
              <select
                id="limit-select"
                class="select select-bordered"
                value={selectedLimit.value}
                onChange$={(ev: any) => {
                  handleLimitChange(parseInt(ev.target.value));
                }}
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div class="card bg-base-100 shadow-xl relative">
        <div class="card-body">
          <h2 class="card-title">Daftar Posyandu</h2>

          {/* Loading Overlay */}
          {loading.value && (
            <div class="absolute inset-0 bg-base-100/70 rounded-3xl flex justify-center items-center z-10">
              <LuLoader2
                class="animate-spin text-primary"
                style={{ width: "32px", height: "32px" }}
              />
            </div>
          )}

          <div
            class={`overflow-x-auto ${loading.value ? "pointer-events-none opacity-60" : ""}`}
          >
            <table class="table w-full">
              <thead>
                <tr>
                  <th>Nama Posyandu</th>
                  <th>Alamat</th>
                  <th>No. Telp</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {posyanduList.value.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      class="text-center text-base-content/60 py-8"
                    >
                      Tidak ada data posyandu.
                    </td>
                  </tr>
                ) : (
                  posyanduList.value.map((posyandu) => (
                    <tr key={posyandu.id}>
                      <td class="font-medium">{posyandu.nama_posyandu}</td>
                      <td>{posyandu.alamat}</td>
                      <td>{posyandu.no_telp}</td>
                      <td class="flex gap-2">
                        <a
                          href={`/admin/posyandu/${posyandu.id}`}
                          class="btn btn-sm btn-primary"
                        >
                          Detail
                        </a>
                        <button
                          class="btn btn-sm btn-info"
                          onClick$={() => openEditModal(posyandu)}
                        >
                          <LuPencil class="w-4 h-4" />
                          Edit
                        </button>
                        <button
                          class="btn btn-sm btn-error"
                          onClick$={() => openDeleteModal(posyandu)}
                        >
                          <LuTrash class="w-4 h-4" />
                          Hapus
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div class="flex items-center justify-between mt-6">
              <div class="text-sm text-base-content/70">
                Menampilkan {posyanduList.value.length} dari {total.value}{" "}
                posyandu
              </div>
              <div class="join">
                <button
                  class="join-item btn btn-sm"
                  disabled={currentPage.value === 1}
                  onClick$={() => handlePageChange(currentPage.value - 1)}
                >
                  <LuChevronLeft class="w-4 h-4" />
                </button>
                {getPaginationButtons(currentPage.value, totalPages).map(
                  (page, idx) => (
                    <button
                      key={idx}
                      class={`join-item btn btn-sm ${page === currentPage.value ? "btn-active" : ""} ${page === "..." ? "btn-disabled" : ""}`}
                      disabled={page === "..."}
                      onClick$={() =>
                        typeof page === "number" && handlePageChange(page)
                      }
                    >
                      {page}
                    </button>
                  ),
                )}
                <button
                  class="join-item btn btn-sm"
                  disabled={currentPage.value === totalPages}
                  onClick$={() => handlePageChange(currentPage.value + 1)}
                >
                  <LuChevronRight class="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Create Modal */}
      {showCreateModal.value && (
        <div class="modal modal-open">
          <div class="modal-box">
            <h3 class="font-bold text-lg mb-4">Tambah Posyandu Baru</h3>
            <div class="form-control">
              <label class="label">
                <span class="label-text">Nama Posyandu</span>
              </label>
              <input
                type="text"
                placeholder="Masukkan nama posyandu"
                class="input input-bordered"
                value={formData.value.nama_posyandu}
                onInput$={(ev: any) =>
                  (formData.value.nama_posyandu = ev.target.value)
                }
              />
            </div>
            <div class="form-control">
              <label class="label">
                <span class="label-text">Alamat</span>
              </label>
              <textarea
                placeholder="Masukkan alamat posyandu"
                class="textarea textarea-bordered"
                value={formData.value.alamat}
                onInput$={(ev: any) =>
                  (formData.value.alamat = ev.target.value)
                }
              />
            </div>
            <div class="form-control">
              <label class="label">
                <span class="label-text">No. Telepon</span>
              </label>
              <input
                type="text"
                placeholder="Masukkan nomor telepon"
                class="input input-bordered"
                value={formData.value.no_telp}
                onInput$={(ev: any) =>
                  (formData.value.no_telp = ev.target.value)
                }
              />
            </div>
            <div class="modal-action">
              <button class="btn" onClick$={closeModals}>
                Batal
              </button>
              <button class="btn btn-primary" onClick$={handleCreate}>
                {loading.value ? (
                  <LuLoader2 class="w-4 h-4 animate-spin" />
                ) : (
                  "Simpan"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal.value && (
        <div class="modal modal-open">
          <div class="modal-box">
            <h3 class="font-bold text-lg mb-4">Edit Posyandu</h3>
            <div class="form-control">
              <label class="label">
                <span class="label-text">Nama Posyandu</span>
              </label>
              <input
                type="text"
                placeholder="Masukkan nama posyandu"
                class="input input-bordered"
                value={formData.value.nama_posyandu}
                onInput$={(ev: any) =>
                  (formData.value.nama_posyandu = ev.target.value)
                }
              />
            </div>
            <div class="form-control">
              <label class="label">
                <span class="label-text">Alamat</span>
              </label>
              <textarea
                placeholder="Masukkan alamat posyandu"
                class="textarea textarea-bordered"
                value={formData.value.alamat}
                onInput$={(ev: any) =>
                  (formData.value.alamat = ev.target.value)
                }
              />
            </div>
            <div class="form-control">
              <label class="label">
                <span class="label-text">No. Telepon</span>
              </label>
              <input
                type="text"
                placeholder="Masukkan nomor telepon"
                class="input input-bordered"
                value={formData.value.no_telp}
                onInput$={(ev: any) =>
                  (formData.value.no_telp = ev.target.value)
                }
              />
            </div>
            <div class="modal-action">
              <button class="btn" onClick$={closeModals}>
                Batal
              </button>
              <button class="btn btn-primary" onClick$={handleUpdate}>
                {loading.value ? (
                  <LuLoader2 class="w-4 h-4 animate-spin" />
                ) : (
                  "Update"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal.value && selectedPosyandu.value && (
        <div class="modal modal-open">
          <div class="modal-box">
            <h3 class="font-bold text-lg mb-4">Konfirmasi Hapus</h3>
            <p>
              Apakah Anda yakin ingin menghapus posyandu{" "}
              <strong>{selectedPosyandu.value.nama_posyandu}</strong>?
            </p>
            <p class="text-sm text-base-content/70 mt-2">
              Tindakan ini tidak dapat dibatalkan.
            </p>
            <div class="modal-action">
              <button class="btn" onClick$={closeModals}>
                Batal
              </button>
              <button class="btn btn-error" onClick$={handleDelete}>
                {loading.value ? (
                  <LuLoader2 class="w-4 h-4 animate-spin" />
                ) : (
                  "Hapus"
                )}
              </button>
            </div>
          </div>
        </div>
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
