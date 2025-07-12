import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { LuPlus } from "@qwikest/icons/lucide";

export default component$(() => {
  const dummyPsikolog = [
    {
      id: 1,
      name: "Dr. Budi Santoso",
      specialization: "Psikolog Anak",
      phone: "081211112222",
      email: "budi.s@example.com",
    },
    {
      id: 2,
      name: "Dr. Rina Wijaya",
      specialization: "Psikolog Klinis",
      phone: "081233334444",
      email: "rina.w@example.com",
    },
    {
      id: 3,
      name: "Dr. Agus Setiawan",
      specialization: "Psikolog Pendidikan",
      phone: "081255556666",
      email: "agus.s@example.com",
    },
  ];

  return (
    <div>
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-3xl font-bold">Manajemen Data Psikolog</h1>
        <button class="btn btn-primary">
          <LuPlus class="w-4 h-4 mr-2" />
          Tambah Psikolog
        </button>
      </div>

      <div class="overflow-x-auto">
        <table class="table w-full">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nama Psikolog</th>
              <th>Spesialisasi</th>
              <th>No. Telepon</th>
              <th>Email</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {dummyPsikolog.map((psikolog) => (
              <tr key={psikolog.id}>
                <td>{psikolog.id}</td>
                <td>{psikolog.name}</td>
                <td>{psikolog.specialization}</td>
                <td>{psikolog.phone}</td>
                <td>{psikolog.email}</td>
                <td class="flex gap-2">
                  <button class="btn btn-sm btn-info">Edit</button>
                  <button class="btn btn-sm btn-error">Hapus</button>
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
  title: "Manajemen Psikolog - Si-DIFA",
  meta: [
    {
      name: "description",
      content: "Halaman manajemen data psikolog untuk admin Si-DIFA",
    },
  ],
};
