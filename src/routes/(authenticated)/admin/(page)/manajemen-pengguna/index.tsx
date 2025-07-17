import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";

export default component$(() => {
  const dummyUsers = [
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
    <div>
      <h1 class="text-3xl font-bold mb-6">Manajemen Pengguna</h1>

      <div class="mb-4 flex gap-4">
        <input
          type="text"
          placeholder="Cari pengguna..."
          class="input input-bordered w-full max-w-xs"
        />
        <select class="select select-bordered">
          <option disabled selected>
            Filter berdasarkan peran
          </option>
          <option>Semua</option>
          <option>Admin</option>
          <option>Psikolog</option>
          <option>Kader Posyandu</option>
        </select>
      </div>

      <div class="overflow-x-auto">
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
            {dummyUsers.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.name}</td>
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
                  <button class="btn btn-sm btn-info">Edit</button>
                  <button class="btn btn-sm btn-warning">Nonaktifkan</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
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
