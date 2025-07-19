import { component$, useSignal, $, useTask$ } from "@builder.io/qwik";
import { useAuth } from "~/hooks";
import type { DocumentHead } from "@builder.io/qwik-city";
import { adminService } from "~/services/api";
import { Alert } from "~/components/ui";
import { extractErrorMessage } from "~/utils/error";
import {
  LuCheck,
  LuX,
  LuLoader2,
  LuSearch,
  LuEye,
  LuChevronLeft,
  LuChevronRight,
} from "@qwikest/icons/lucide";
import type { User, ListUserResponse } from "~/types/admin";

export default component$(() => {
  const error = useSignal<string | null>(null);
  const success = useSignal<string | null>(null);
  const loading = useSignal(true); // Change initial state to true
  const users = useSignal<User[]>([]);
  const meta = useSignal<ListUserResponse["meta"] | null>(null);

  // Pagination & Filter
  const currentPage = useSignal(1);
  const limit = useSignal(5);
  const searchName = useSignal("");
  const orderBy = useSignal(""); // default: no sorting

  // Detail Modal
  const selectedUser = useSignal<User | null>(null);
  const showDetailModal = useSignal(false);

  const { isLoggedIn } = useAuth(); // Get isLoggedIn from useAuth

  const fetchUsers = $(async () => {
    loading.value = true;
    error.value = null;

    try {
      const response = await adminService.listUsers({
        limit: limit.value,
        page: currentPage.value,
        name: searchName.value || undefined,
        orderBy: orderBy.value || undefined, // only send if not empty
      });

      users.value = response.data;
      meta.value = response.meta;
    } catch (err: any) {
      error.value = extractErrorMessage(err);
    } finally {
      loading.value = false;
    }
  });

  const handleVerification = $(
    async (userId: string, verification: "verified" | "unverified") => {
      error.value = null;
      success.value = null;

      try {
        await adminService.verifyUser(userId, verification);
        success.value = `Akun berhasil ${verification === "verified" ? "diverifikasi" : "ditolak"}`;
        // Refresh data
        await fetchUsers();
      } catch (err: any) {
        error.value = extractErrorMessage(err);
      }
    },
  );

  const handleSearch = $(async () => {
    currentPage.value = 1; // Reset to first page when searching
    await fetchUsers();
  });

  const handlePageChange = $(async (page: number) => {
    currentPage.value = page;
    await fetchUsers();
  });

  const showUserDetail = $(async (user: User) => {
    selectedUser.value = user;
    showDetailModal.value = true;
  });

  // Load initial data or re-load if authentication state changes
  useTask$(({ track }) => {
    track(isLoggedIn); // Re-run when isLoggedIn changes

    if (isLoggedIn.value) {
      fetchUsers();
    } else {
      users.value = [];
      meta.value = null;
      error.value =
        "Anda tidak memiliki akses untuk melihat data ini. Silakan login.";
      loading.value = false;
    }
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "admin":
        return "badge-neutral";
      case "psikolog":
        return "badge-info";
      case "posyandu":
        return "badge-success";
      default:
        return "badge-ghost";
    }
  };

  const getVerificationBadge = (verification: string) => {
    return verification === "verified" ? "badge-success" : "badge-warning";
  };

  // Helper function to calculate pagination buttons
  const getPaginationButtons = (currentPage: number, totalPages: number) => {
    const buttons = [];
    const maxButtons = 5;

    if (totalPages <= maxButtons) {
      // If total pages is less than or equal to max buttons, show all
      for (let i = 1; i <= totalPages; i++) {
        buttons.push(i);
      }
    } else {
      // Calculate start and end page numbers
      let startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2));
      const endPage = Math.min(totalPages, startPage + maxButtons - 1);

      // Adjust if we're near the end
      if (endPage - startPage + 1 < maxButtons) {
        startPage = Math.max(1, endPage - maxButtons + 1);
      }

      // Add first page if not included
      if (startPage > 1) {
        buttons.push(1);
        if (startPage > 2) {
          buttons.push("...");
        }
      }

      // Add middle pages
      for (let i = startPage; i <= endPage; i++) {
        if (i === 1 || i === totalPages) continue; // Skip if already added
        buttons.push(i);
      }

      // Add last page if not included
      if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
          buttons.push("...");
        }
        buttons.push(totalPages);
      }
    }

    return buttons;
  };

  return (
    <div>
      <h1 class="text-3xl font-bold mb-4">Verifikasi Akun</h1>
      <p class="mb-6">
        Setujui atau tolak pendaftaran akun baru dari Kader Posyandu dan
        Psikolog.
      </p>

      {/* Search & Filter */}
      <div class="card bg-base-100 shadow-xl mb-6">
        <div class="card-body">
          <h2 class="card-title">Filter & Pencarian</h2>
          <div class="flex flex-col md:flex-row gap-4">
            <div class="form-control flex-1">
              <label for="search-name" class="label">
                <span class="label-text">Cari berdasarkan nama</span>
              </label>
              <div class="input-group">
                <input
                  id="search-name"
                  type="text"
                  placeholder="Masukkan nama user..."
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
              <label for="order-by-select" class="label">
                <span class="label-text">Urutkan berdasarkan</span>
              </label>
              <select
                id="order-by-select"
                class="select select-bordered"
                value={orderBy.value}
                onChange$={(ev: any) => {
                  orderBy.value = ev.target.value;
                  currentPage.value = 1;
                  fetchUsers();
                }}
              >
                <option value="">(Default - Tidak diurutkan)</option>
                <option value="desc">Terbaru</option>
                <option value="asc">Terlama</option>
                <option value="name:asc">Nama A-Z</option>
                <option value="name:desc">Nama Z-A</option>
                <option value="email:asc">Email A-Z</option>
                <option value="email:desc">Email Z-A</option>
              </select>
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
                  fetchUsers();
                }}
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Alert Messages */}
      {error.value && <Alert type="error" message={error.value} class="mb-6" />}
      {success.value && (
        <Alert type="success" message={success.value} class="mb-6" />
      )}

      {/* Tabel Daftar Akun */}
      <div class="card bg-base-100 shadow-xl relative">
        <div class="card-body">
          <h2 class="card-title">Daftar User</h2>

          {/* Overlay Spinner */}
          {loading.value && (
            <div class="absolute inset-0 rounded-3xl bg-base-100/70 flex justify-center items-center z-10">
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
                  <th>Nama</th>
                  <th>Email</th>
                  <th>No. Telepon</th>
                  <th>Peran</th>
                  <th>Status</th>
                  <th>Tanggal Daftar</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {users.value.map((user) => (
                  <tr key={user.id}>
                    <td class="font-medium">{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.no_telp || "-"}</td>
                    <td>
                      <span class={`badge ${getRoleBadge(user.role)}`}>
                        {user.role}
                      </span>
                    </td>
                    <td>
                      <span
                        class={`badge ${getVerificationBadge(user.verification)}`}
                      >
                        {user.verification === "verified"
                          ? "Terverifikasi"
                          : "Menunggu Verifikasi"}
                      </span>
                    </td>
                    <td class="text-sm">{formatDate(user.created_at)}</td>
                    <td class="flex gap-2">
                      <button
                        class="btn btn-sm btn-ghost"
                        onClick$={() => showUserDetail(user)}
                      >
                        <LuEye class="w-4 h-4" />
                      </button>
                      {user.verification === "unverified" && (
                        <>
                          <button
                            class="btn btn-sm btn-success"
                            onClick$={() =>
                              handleVerification(user.id, "verified")
                            }
                          >
                            <LuCheck class="w-4 h-4" />
                          </button>
                          <button
                            class="btn btn-sm btn-error"
                            onClick$={() =>
                              handleVerification(user.id, "unverified")
                            }
                          >
                            <LuX class="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {meta.value && (
            <div class="flex items-center justify-between mt-6">
              <div class="text-sm text-base-content/70">
                Menampilkan{" "}
                {(meta.value.currentPage - 1) * meta.value.limit + 1} -{" "}
                {Math.min(
                  meta.value.currentPage * meta.value.limit,
                  meta.value.totalUsers,
                )}{" "}
                dari {meta.value.totalUsers} user
              </div>
              <div class="join">
                <button
                  class="join-item btn btn-sm"
                  disabled={meta.value.currentPage === 1}
                  onClick$={() => handlePageChange(meta.value!.currentPage - 1)}
                >
                  <LuChevronLeft class="w-4 h-4" />
                </button>
                {getPaginationButtons(
                  meta.value.currentPage,
                  meta.value.totalPages,
                ).map((page, index) => (
                  <button
                    key={index}
                    class={`join-item btn btn-sm ${page === meta.value!.currentPage ? "btn-active" : ""} ${page === "..." ? "btn-disabled" : ""}`}
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
                  disabled={meta.value.currentPage === meta.value.totalPages}
                  onClick$={() => handlePageChange(meta.value!.currentPage + 1)}
                >
                  <LuChevronRight class="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Detail User Modal */}
      {showDetailModal.value && selectedUser.value && (
        <div class="modal modal-open">
          <div class="modal-box max-w-2xl">
            <h3 class="font-bold text-lg mb-4">Detail User</h3>
            <div class="space-y-4">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label for="detail-name" class="label">
                    <span class="label-text font-medium">Nama</span>
                  </label>
                  <p id="detail-name" class="text-base-content">
                    {selectedUser.value.name}
                  </p>
                </div>
                <div>
                  <label for="detail-email" class="label">
                    <span class="label-text font-medium">Email</span>
                  </label>
                  <p id="detail-email" class="text-base-content">
                    {selectedUser.value.email}
                  </p>
                </div>
                <div>
                  <label for="detail-phone" class="label">
                    <span class="label-text font-medium">No. Telepon</span>
                  </label>
                  <p id="detail-phone" class="text-base-content">
                    {selectedUser.value.no_telp || "-"}
                  </p>
                </div>
                <div>
                  <label for="detail-role" class="label">
                    <span class="label-text font-medium">Peran</span>
                  </label>
                  <span
                    id="detail-role"
                    class={`badge ${getRoleBadge(selectedUser.value.role)}`}
                  >
                    {selectedUser.value.role}
                  </span>
                </div>
                <div>
                  <label for="detail-verification" class="label">
                    <span class="label-text font-medium">
                      Status Verifikasi
                    </span>
                  </label>
                  <span
                    id="detail-verification"
                    class={`badge ${getVerificationBadge(selectedUser.value.verification)}`}
                  >
                    {selectedUser.value.verification === "verified"
                      ? "Terverifikasi"
                      : "Menunggu Verifikasi"}
                  </span>
                </div>
                <div>
                  <label for="detail-created" class="label">
                    <span class="label-text font-medium">Tanggal Daftar</span>
                  </label>
                  <p id="detail-created" class="text-base-content">
                    {formatDate(selectedUser.value.created_at)}
                  </p>
                </div>
              </div>

              {selectedUser.value.verification === "unverified" && (
                <div class="flex gap-2 pt-4">
                  <button
                    class="btn btn-success"
                    onClick$={() => {
                      handleVerification(selectedUser.value!.id, "verified");
                      showDetailModal.value = false;
                    }}
                  >
                    <LuCheck class="w-4 h-4 mr-2" />
                    Verifikasi
                  </button>
                  <button
                    class="btn btn-error"
                    onClick$={() => {
                      handleVerification(selectedUser.value!.id, "unverified");
                      showDetailModal.value = false;
                    }}
                  >
                    <LuX class="w-4 h-4 mr-2" />
                    Tolak
                  </button>
                </div>
              )}
            </div>
            <div class="modal-action">
              <button
                class="btn"
                onClick$={() => (showDetailModal.value = false)}
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

export const head: DocumentHead = {
  title: "Verifikasi Akun - Si-DIFA",
  meta: [
    {
      name: "description",
      content: "Halaman verifikasi akun untuk admin Si-DIFA",
    },
  ],
};
