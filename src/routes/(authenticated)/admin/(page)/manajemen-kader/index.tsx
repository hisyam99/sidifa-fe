import { component$, useSignal, useTask$, $ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import {
  UserManagementTable,
  UserFilterControls,
} from "~/components/admin/user-management";
import type { UserItem, RoleFilterOption } from "~/types/user-management";
import { GenericLoadingSpinner, ConfirmationModal } from "~/components/common";
import { QSuspense } from "~/integrations/react/Suspense";

export default component$(() => {
  const dummyUsers: UserItem[] = [
    {
      id: 1,
      name: "Admin Utama",
      email: "admin@sidifa.com",
      role: "Admin",
      status: "Aktif",
    },
    {
      id: 2,
      name: "Dr. Budi Santoso",
      email: "budi.s@example.com",
      role: "Psikolog",
      status: "Aktif",
    },
    {
      id: 3,
      name: "Kader Melati",
      email: "kader.melati@example.com",
      role: "Kader Posyandu",
      status: "Aktif",
    },
    {
      id: 4,
      name: "Kader Anggrek",
      email: "kader.anggrek@example.com",
      role: "Kader Posyandu",
      status: "Tidak Aktif",
    },
    {
      id: 5,
      name: "Dr. Rina Wijaya",
      email: "rina.w@example.com",
      role: "Psikolog",
      status: "Aktif",
    },
  ];

  const roleFilterOptions: RoleFilterOption[] = [
    { label: "Semua", value: "" },
    { label: "Admin", value: "Admin" },
    { label: "Psikolog", value: "Psikolog" },
    { label: "Kader Posyandu", value: "Kader Posyandu" },
  ];

  const users = useSignal<UserItem[]>([]);
  const loading = useSignal(false);
  const error = useSignal<string | null>(null);
  const searchQuery = useSignal("");
  const selectedRole = useSignal("");
  const currentPage = useSignal(1);
  const limit = useSignal(10);
  const showConfirmationModal = useSignal(false);
  const userToToggleStatus = useSignal<{ id: number; status: string } | null>(
    null,
  );

  const fetchUsers = $(async () => {
    loading.value = true;
    error.value = null;
    try {
      // This is a placeholder. Replace with actual API call.
      // Example: const response = await userService.getUsers({ searchQuery: searchQuery.value, role: selectedRole.value, page: currentPage.value, limit: limit.value });
      // users.value = response.data;
      // Implement pagination meta if your API returns it

      // For now, simulate filtering and pagination on dummy data
      let filtered = dummyUsers.filter(
        (user) =>
          user.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
          user.email.toLowerCase().includes(searchQuery.value.toLowerCase()),
      );
      if (selectedRole.value) {
        filtered = filtered.filter((user) => user.role === selectedRole.value);
      }

      const startIndex = (currentPage.value - 1) * limit.value;
      const endIndex = startIndex + limit.value;
      users.value = filtered.slice(startIndex, endIndex);
      // Simulate meta for pagination
      // In a real app, meta would come from API
      // For now, calculate total pages based on filtered data
      // const totalItems = filtered.length; // Removed unused variable
      // const totalPages = Math.ceil(totalItems / limit.value); // Removed unused variable

      // Update meta for PaginationControls
      // meta.value = { totalData: totalItems, totalPage: totalPages, currentPage: currentPage.value, limit: limit.value };
    } catch (err: unknown) {
      error.value = (err as Error)?.message || "Gagal memuat data pengguna.";
    } finally {
      loading.value = false;
    }
  });

  useTask$(({ track }) => {
    track(searchQuery);
    track(selectedRole);
    track(currentPage);
    track(limit);
    fetchUsers();
  });

  const handleFilterChange = $(() => {
    currentPage.value = 1; // Reset page on filter/search change
    fetchUsers(); // Re-fetch data
  });

  // const handlePageChange = $((page: number) => { // Removed unused function
  //   currentPage.value = page;
  //   fetchUsers(); // Re-fetch data
  // });

  const handleEditUser = $((id: number) => {
    console.log(`Edit user with ID: ${id}`);
    // Implement navigation to edit user page
  });

  const handleToggleStatusClick = $((id: number, currentStatus: string) => {
    userToToggleStatus.value = { id, status: currentStatus };
    showConfirmationModal.value = true;
  });

  const handleConfirmToggleStatus = $(async () => {
    if (userToToggleStatus.value) {
      const { id, status } = userToToggleStatus.value;
      const newStatus = status === "Aktif" ? "Tidak Aktif" : "Aktif";
      console.log(
        `Toggling status for user ID ${id} from ${status} to ${newStatus}`,
      );
      // Implement actual API call to toggle user status
      // await userService.toggleUserStatus(id, newStatus);
      showConfirmationModal.value = false;
      userToToggleStatus.value = null;
      fetchUsers(); // Re-fetch data to update table
    }
  });

  const handleCancelToggleStatus = $(() => {
    showConfirmationModal.value = false;
    userToToggleStatus.value = null;
  });

  return (
    <div>
      <h1 class="text-3xl font-bold mb-6">Manajemen Pengguna</h1>

      <UserFilterControls
        searchQuery={searchQuery}
        selectedRole={selectedRole}
        roleOptions={roleFilterOptions}
        onFilterChange$={handleFilterChange}
      />

      <QSuspense fallback={<GenericLoadingSpinner />}>
        <UserManagementTable
          users={users.value}
          onEdit$={handleEditUser}
          onToggleStatus$={handleToggleStatusClick}
        />
      </QSuspense>

      {error.value && (
        <div class="alert alert-error mt-4">
          <span>{error.value}</span>
        </div>
      )}

      {/* Pagination will be here if meta is implemented from API */}
      {/* Example: <PaginationControls meta={meta.value} currentPage={currentPage.value} onPageChange$={handlePageChange} /> */}

      <ConfirmationModal
        isOpen={showConfirmationModal}
        title="Konfirmasi Perubahan Status"
        message={`Apakah Anda yakin ingin ${userToToggleStatus.value?.status === "Aktif" ? "menonaktifkan" : "mengaktifkan"} pengguna ini?`}
        onConfirm$={handleConfirmToggleStatus}
        onCancel$={handleCancelToggleStatus}
      />
    </div>
  );
});

export const head: DocumentHead = {
  title: "Manajemen Pengguna - Si-DIFA",
  meta: [
    {
      name: "description",
      content: "Halaman manajemen pengguna untuk admin Si-DIFA",
    },
  ],
};
