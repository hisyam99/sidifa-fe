import { component$, useSignal, useTask$, $ } from "@builder.io/qwik";
import { useAuth } from "~/hooks";
import {
  LuChevronLeft,
  LuChevronRight,
  LuLoader2,
  LuSearch,
} from "@qwikest/icons/lucide";
import { kaderService } from "~/services/api";

export default component$(() => {
  const posyanduList = useSignal<any[]>([]);
  const meta = useSignal<any | null>(null);
  const loading = useSignal(true); // Change initial state to true
  const error = useSignal<string | null>(null);
  const currentPage = useSignal(1);
  const limit = useSignal(10); // default 10
  const searchName = useSignal("");

  const { isLoggedIn } = useAuth(); // Get isLoggedIn from useAuth

  const fetchPosyandu = $(async () => {
    loading.value = true;
    error.value = null;
    try {
      const response = await kaderService.getKaderPosyanduList({
        limit: limit.value,
        page: currentPage.value,
        nama_posyandu: searchName.value || undefined,
      });
      posyanduList.value = response.data;
      meta.value = response.meta;
    } catch (err: any) {
      error.value = err.message || "Gagal memuat data posyandu.";
    } finally {
      loading.value = false;
    }
  });

  // Initial load or re-load if authentication state changes
  useTask$(({ track }) => {
    track(isLoggedIn); // Re-run when isLoggedIn changes

    if (isLoggedIn.value) {
      fetchPosyandu();
    } else {
      // If not logged in, clear data and show an error/message
      posyanduList.value = [];
      meta.value = null;
      error.value =
        "Anda tidak memiliki akses untuk melihat data ini. Silakan login.";
      loading.value = false;
    }
  });

  const handlePageChange = $(async (page: number) => {
    if (page < 1 || (meta.value && page > meta.value.totalPage)) return;
    currentPage.value = page;
    await fetchPosyandu();
  });

  const handleSearch = $(async () => {
    currentPage.value = 1;
    await fetchPosyandu();
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
      <h1 class="text-3xl font-bold mb-4">Daftar Posyandu</h1>
      <p class="mb-6">
        Berikut adalah daftar posyandu yang terdaftar pada sistem.
      </p>

      {/* Search by Name */}
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
                value={limit.value}
                onChange$={(ev: any) => {
                  limit.value = parseInt(ev.target.value);
                  currentPage.value = 1;
                  fetchPosyandu();
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

      {/* Alert Messages */}
      {error.value && (
        <div class="alert alert-error mb-6">
          <span>{error.value}</span>
        </div>
      )}

      {/* Card Table */}
      <div class="card bg-base-100 shadow-xl relative">
        <div class="card-body">
          <h2 class="card-title">Daftar Posyandu</h2>

          {/* Overlay Spinner */}
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
                      <td>
                        <a
                          href={`/kader/posyandu/${posyandu.id}`}
                          class="btn btn-primary btn-sm"
                        >
                          Detail
                        </a>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {meta.value && meta.value.totalPage > 1 && (
            <div class="flex items-center justify-between mt-6">
              <div class="text-sm text-base-content/70">
                Menampilkan {posyanduList.value.length} dari{" "}
                {meta.value.totalData} posyandu
              </div>
              <div class="join">
                <button
                  class="join-item btn btn-sm"
                  disabled={meta.value.currentPage === 1}
                  onClick$={() => handlePageChange(meta.value.currentPage - 1)}
                >
                  <LuChevronLeft class="w-4 h-4" />
                </button>
                {getPaginationButtons(
                  meta.value.currentPage,
                  meta.value.totalPage,
                ).map((page, idx) => (
                  <button
                    key={idx}
                    class={`join-item btn btn-sm ${page === meta.value.currentPage ? "btn-active" : ""} ${page === "..." ? "btn-disabled" : ""}`}
                    disabled={page === "..."}
                    onClick$={() =>
                      typeof page === "number" && handlePageChange(page)
                    }
                  >
                    {page}
                  </button>
                ))}
                <button
                  class="join-item btn btn-sm"
                  disabled={meta.value.currentPage === meta.value.totalPage}
                  onClick$={() => handlePageChange(meta.value.currentPage + 1)}
                >
                  <LuChevronRight class="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});
