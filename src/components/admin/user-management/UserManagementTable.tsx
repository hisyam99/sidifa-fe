import { component$, QRL } from "@qwik.dev/core";
import type { UserItem } from "~/types/user-management";

interface UserManagementTableProps {
  users: UserItem[];
  onEdit$?: QRL<(id: number) => void>;
  onToggleStatus$?: QRL<(id: number, currentStatus: string) => void>;
}

export const UserManagementTable = component$(
  (props: UserManagementTableProps) => {
    const { users, onEdit$, onToggleStatus$ } = props;

    const getRoleBadge = (role: string) => {
      switch (role) {
        case "Admin":
          return "badge-neutral";
        case "Psikolog":
          return "badge-info";
        case "Kader Posyandu":
          return "badge-success";
        default:
          return "badge-ghost";
      }
    };

    const getStatusBadge = (status: string) => {
      return status === "Aktif" ? "badge-success" : "badge-error";
    };

    return (
      <div class="overflow-x-auto card bg-base-100 shadow-xl p-6">
        <h2 class="card-title text-xl font-bold mb-4">Daftar Pengguna</h2>
        <table class="table w-full">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nama</th>
              <th>Email</th>
              <th>Peran</th>
              <th>Status</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan={6} class="text-center text-base-content/60 py-8">
                  Tidak ada data pengguna.
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td class="font-medium">{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    <span class={`badge ${getRoleBadge(user.role)}`}>
                      {user.role}
                    </span>
                  </td>
                  <td>
                    <span class={`badge ${getStatusBadge(user.status)}`}>
                      {user.status}
                    </span>
                  </td>
                  <td class="flex gap-2">
                    {onEdit$ && (
                      <button
                        class="btn btn-sm btn-info"
                        onClick$={() => onEdit$(user.id)}
                      >
                        Edit
                      </button>
                    )}
                    {onToggleStatus$ && (
                      <button
                        class="btn btn-sm btn-warning"
                        onClick$={() => onToggleStatus$(user.id, user.status)}
                      >
                        {user.status === "Aktif" ? "Nonaktifkan" : "Aktifkan"}
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    );
  },
);
