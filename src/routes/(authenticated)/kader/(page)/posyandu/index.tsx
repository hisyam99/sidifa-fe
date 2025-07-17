import { component$ } from "@builder.io/qwik";

export default component$(() => {
  // Placeholder data
  const posyanduList = [
    { id: 1, name: "Posyandu Melati", alamat: "Jl. Mawar No. 1" },
    { id: 2, name: "Posyandu Anggrek", alamat: "Jl. Kenanga No. 2" },
    { id: 3, name: "Posyandu Dahlia", alamat: "Jl. Dahlia No. 3" },
  ];

  return (
    <div class="container mx-auto py-8">
      <h1 class="text-2xl font-bold mb-6 text-primary">Daftar Posyandu</h1>
      <div class="overflow-x-auto">
        <table class="table table-zebra w-full">
          <thead>
            <tr>
              <th>No</th>
              <th>Nama Posyandu</th>
              <th>Alamat</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {posyanduList.map((posyandu, idx) => (
              <tr key={posyandu.id}>
                <td>{idx + 1}</td>
                <td>{posyandu.name}</td>
                <td>{posyandu.alamat}</td>
                <td>
                  <a
                    href={`/kader/posyandu/detail/${posyandu.id}`}
                    class="btn btn-primary btn-sm"
                  >
                    Detail
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
});
