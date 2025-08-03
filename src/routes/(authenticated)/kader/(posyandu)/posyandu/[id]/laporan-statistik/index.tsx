import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { LuDownload } from "~/components/icons/lucide-optimized"; // Updated import path

export default component$(() => {
  return (
    <div>
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-3xl font-bold">Laporan & Statistik</h1>
        <button class="btn btn-primary">
          <LuDownload class="w-4 h-4 mr-2" />
          Unduh Laporan
        </button>
      </div>

      {/* Filter */}
      <div class="mb-6 bg-base-200 p-4 rounded-lg">
        <h3 class="font-bold mb-2">Filter Data</h3>
        <div class="flex flex-wrap gap-4">
          <select class="select select-bordered">
            <option disabled selected>
              Pilih Jenis Laporan
            </option>
            <option>Laporan Bulanan</option>
            <option>Laporan Tahunan</option>
            <option>Laporan Data IBK</option>
          </select>
          <input type="date" class="input input-bordered" />
          <input type="date" class="input input-bordered" />
          <button class="btn">Terapkan Filter</button>
        </div>
      </div>

      {/* Visualisasi Data */}
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="card bg-base-100 shadow-xl">
          <div class="card-body">
            <h2 class="card-title">Grafik Pertumbuhan Data IBK</h2>
            <div class="bg-gray-200 w-full h-64 flex items-center justify-center rounded-lg">
              <p class="text-gray-500">[Placeholder untuk Grafik]</p>
            </div>
          </div>
        </div>
        <div class="card bg-base-100 shadow-xl">
          <div class="card-body">
            <h2 class="card-title">Demografi Disabilitas</h2>
            <div class="bg-gray-200 w-full h-64 flex items-center justify-center rounded-lg">
              <p class="text-gray-500">[Placeholder untuk Pie Chart]</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabel Ringkasan */}
      <div class="mt-8">
        <h2 class="text-2xl font-bold mb-4">Ringkasan Data Laporan</h2>
        <div class="overflow-x-auto">
          <table class="table w-full">
            <thead>
              <tr>
                <th>Jenis Data</th>
                <th>Jumlah</th>
                <th>Perubahan</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Total IBK</td>
                <td>58</td>
                <td class="text-success">+5 bulan ini</td>
              </tr>
              <tr>
                <td>Kunjungan Kader</td>
                <td>120</td>
                <td class="text-success">+15 bulan ini</td>
              </tr>
              <tr>
                <td>Kegiatan Terlaksana</td>
                <td>4</td>
                <td class="text-error">-1 bulan ini</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Laporan & Statistik - Si-DIFA",
  meta: [
    {
      name: "description",
      content: "Laporan & Statistik untuk Kader Posyandu Si-DIFA",
    },
  ],
};
