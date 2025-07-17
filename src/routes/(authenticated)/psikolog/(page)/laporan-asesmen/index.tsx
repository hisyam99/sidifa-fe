import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";

export default component$(() => {
  const history = [
    {
      id: "LAP-0012",
      patient: "Budi Cahyono",
      date: "10 Des 2024",
      status: "Selesai",
    },
    {
      id: "LAP-0011",
      patient: "Rina Amelia",
      date: "12 Des 2024",
      status: "Selesai",
    },
    {
      id: "LAP-0010",
      patient: "Andi Pratama",
      date: "05 Des 2024",
      status: "Selesai",
    },
  ];

  return (
    <div>
      <h1 class="text-3xl font-bold mb-6">Laporan Asesmen Psikologis</h1>

      {/* Formulir Laporan Baru */}
      <div class="mb-8 p-6 bg-base-200 rounded-lg">
        <h2 class="text-2xl font-bold mb-4">Buat Laporan Baru</h2>
        <form class="space-y-4">
          <div class="form-control">
            <label class="label">
              <span class="label-text">Pilih Pasien/IBK</span>
            </label>
            <select class="select select-bordered">
              <option disabled selected>
                Pilih dari daftar pasien
              </option>
              <option>Andi Pratama</option>
              <option>Sari Dewi</option>
              <option>Budi Cahyono</option>
              <option>Rina Amelia</option>
            </select>
          </div>
          <div class="form-control">
            <label class="label">
              <span class="label-text">Tanggal Asesmen</span>
            </label>
            <input type="date" class="input input-bordered" />
          </div>
          <div class="form-control">
            <label class="label">
              <span class="label-text">Hasil Asesmen & Rekomendasi</span>
            </label>
            <textarea
              class="textarea textarea-bordered h-32"
              placeholder="Tuliskan hasil observasi, analisis, dan rekomendasi..."
            ></textarea>
          </div>
          <div class="flex justify-end pt-4">
            <button type="submit" class="btn btn-primary">
              Simpan Laporan
            </button>
          </div>
        </form>
      </div>

      {/* Riwayat Laporan */}
      <div>
        <h2 class="text-2xl font-bold mb-4">Riwayat Laporan</h2>
        <div class="overflow-x-auto">
          <table class="table w-full">
            <thead>
              <tr>
                <th>ID Laporan</th>
                <th>Nama Pasien</th>
                <th>Tanggal</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {history.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.patient}</td>
                  <td>{item.date}</td>
                  <td>
                    <span class="badge badge-success">{item.status}</span>
                  </td>
                  <td>
                    <button class="btn btn-sm btn-ghost">Lihat Detail</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Laporan Asesmen - Si-DIFA",
  meta: [
    {
      name: "description",
      content: "Laporan Asesmen Psikologis - Si-DIFA",
    },
  ],
};
