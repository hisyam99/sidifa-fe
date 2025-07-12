import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { LuPlus } from "@qwikest/icons/lucide";

export default component$(() => {
  const upcomingAppointments = [
    { name: "Andi Pratama", time: "10:00 - 11:00", type: "Konsultasi Awal" },
    { name: "Sari Dewi", time: "13:00 - 14:00", type: "Asesmen Lanjutan" },
  ];

  const handledIBK = [
    { id: "IBK-001", name: "Budi Cahyono", last_session: "10 Des 2024" },
    { id: "IBK-007", name: "Rina Amelia", last_session: "12 Des 2024" },
  ];

  return (
    <div>
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-3xl font-bold">Dashboard Psikolog</h1>
        <a href="/psikolog/laporan-asesmen" class="btn btn-primary">
          <LuPlus class="w-4 h-4 mr-2" />
          Buat Laporan Asesmen
        </a>
      </div>

      {/* Jadwal Hari Ini */}
      <div class="mb-8">
        <h2 class="text-2xl font-bold mb-4">Jadwal Hari Ini</h2>
        <div class="space-y-4">
          {upcomingAppointments.map((apt) => (
            <div
              key={apt.name}
              class="p-4 bg-base-200 rounded-lg flex justify-between items-center"
            >
              <div>
                <p class="font-bold">{apt.name}</p>
                <p class="text-sm">{apt.type}</p>
              </div>
              <div class="font-mono badge badge-outline p-4">{apt.time}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Daftar Pasien/IBK */}
      <div>
        <h2 class="text-2xl font-bold mb-4">Pasien/IBK Ditangani</h2>
        <div class="overflow-x-auto">
          <table class="table w-full">
            <thead>
              <tr>
                <th>ID Pasien</th>
                <th>Nama</th>
                <th>Sesi Terakhir</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {handledIBK.map((ibk) => (
                <tr key={ibk.id}>
                  <td>{ibk.id}</td>
                  <td>{ibk.name}</td>
                  <td>{ibk.last_session}</td>
                  <td>
                    <button class="btn btn-sm btn-ghost">Lihat Riwayat</button>
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
  title: "Dashboard Psikolog - Si-DIFA",
  meta: [
    {
      name: "description",
      content: "Halaman dashboard untuk Psikolog Si-DIFA",
    },
  ],
};
