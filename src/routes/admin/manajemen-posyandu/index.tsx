import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { LuPlus } from "@qwikest/icons/lucide";

export default component$(() => {
  const dummyPosyandu = [
    {
      id: 1,
      name: "Posyandu Melati",
      address: "Jl. Mawar No. 10, Jakarta",
      pic: "Ibu Bunga",
      phone: "081234567890",
    },
    {
      id: 2,
      name: "Posyandu Anggrek",
      address: "Jl. Anggrek No. 2, Bandung",
      pic: "Ibu Rini",
      phone: "081234567891",
    },
    {
      id: 3,
      name: "Posyandu Kamboja",
      address: "Jl. Kamboja No. 3, Surabaya",
      pic: "Ibu Siti",
      phone: "081234567892",
    },
    {
      id: 4,
      name: "Posyandu Tulip",
      address: "Jl. Tulip No. 4, Medan",
      pic: "Ibu Ani",
      phone: "081234567893",
    },
  ];

  return (
    <div>
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-3xl font-bold">Manajemen Data Posyandu</h1>
        <button class="btn btn-primary">
          <LuPlus class="w-4 h-4 mr-2" />
          Tambah Posyandu
        </button>
      </div>

      <div class="overflow-x-auto">
        <table class="table w-full">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nama Posyandu</th>
              <th>Alamat</th>
              <th>Penanggung Jawab</th>
              <th>No. Telepon</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {dummyPosyandu.map((pos) => (
              <tr key={pos.id}>
                <td>{pos.id}</td>
                <td>{pos.name}</td>
                <td>{pos.address}</td>
                <td>{pos.pic}</td>
                <td>{pos.phone}</td>
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
  title: "Manajemen Posyandu - Si-DIFA",
  meta: [
    {
      name: "description",
      content: "Halaman manajemen data Posyandu untuk admin Si-DIFA",
    },
  ],
};
