import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { LuBell, LuCalendar, LuUsers } from "@qwikest/icons/lucide";

export default component$(() => {
  return (
    <div>
      <h1 class="text-3xl font-bold mb-4">Dashboard Posyandu Bedali</h1>

      {/* Ringkasan Data */}
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div class="card bg-base-100 shadow-xl">
          <div class="card-body items-center text-center">
            <LuUsers class="w-12 h-12 text-primary mb-2" />
            <h2 class="card-title">Total IBK Terdata</h2>
            <p class="text-4xl font-bold">58</p>
          </div>
        </div>
        <div class="card bg-base-100 shadow-xl">
          <div class="card-body items-center text-center">
            <LuCalendar class="w-12 h-12 text-secondary mb-2" />
            <h2 class="card-title">Jadwal Selanjutnya</h2>
            <p>
              Penyuluhan Gizi
              <br />
              25 Des 2024
            </p>
          </div>
        </div>
        <div class="card bg-base-100 shadow-xl">
          <div class="card-body items-center text-center">
            <LuBell class="w-12 h-12 text-accent mb-2" />
            <h2 class="card-title">Notifikasi Baru</h2>
            <p class="text-4xl font-bold">3</p>
          </div>
        </div>
      </div>

      {/* Notifikasi Penting */}
      <div class="mb-8">
        <h2 class="text-2xl font-bold mb-4">Notifikasi Penting</h2>
        <div class="alert alert-info shadow-lg">
          <div>
            <LuBell />
            <span>
              Jangan lupa untuk melengkapi data IBK baru sebelum akhir bulan.
            </span>
          </div>
        </div>
      </div>

      {/* Jadwal Kegiatan */}
      <div>
        <h2 class="text-2xl font-bold mb-4">Jadwal Kegiatan Bulan Ini</h2>
        <div class="overflow-x-auto">
          <table class="table w-full">
            <thead>
              <tr>
                <th>Tanggal</th>
                <th>Kegiatan</th>
                <th>Lokasi</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>15 Des 2024</td>
                <td>Pemeriksaan Rutin</td>
                <td>Balai Desa</td>
              </tr>
              <tr>
                <td>25 Des 2024</td>
                <td>Penyuluhan Gizi</td>
                <td>Balai Desa</td>
              </tr>
              <tr>
                <td>30 Des 2024</td>
                <td>Rapat Kader</td>
                <td>Rumah Ibu Ketua</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Dashboard Posyandu - Si-DIFA",
  meta: [
    {
      name: "description",
      content: "Halaman dashboard untuk Kader Posyandu Si-DIFA",
    },
  ],
};
