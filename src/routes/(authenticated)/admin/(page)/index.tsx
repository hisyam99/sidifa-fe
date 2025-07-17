import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import {
  LuUsers,
  LuUserCheck,
  LuBuilding,
  LuActivity,
} from "@qwikest/icons/lucide";

export default component$(() => {
  const stats = [
    {
      title: "Total Pengguna",
      value: "1,200",
      icon: LuUsers,
      description: "Naik 21% dari bulan lalu",
    },
    {
      title: "Total IBK",
      value: "350",
      icon: LuUserCheck,
      description: "Naik 15% dari bulan lalu",
    },
    {
      title: "Posyandu Aktif",
      value: "45",
      icon: LuBuilding,
      description: "2 Posyandu baru bergabung",
    },
    {
      title: "Aktivitas Hari Ini",
      value: "12",
      icon: LuActivity,
      description: "Laporan & Pendaftaran baru",
    },
  ];

  return (
    <div>
      <h1 class="text-3xl font-bold mb-4">Dashboard Admin</h1>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.title} class="card bg-base-100 shadow-xl">
            <div class="card-body">
              <div class="flex items-center justify-between">
                <h2 class="card-title">{stat.title}</h2>
                <div class="text-primary">
                  <stat.icon class="w-8 h-8" />
                </div>
              </div>
              <p class="text-4xl font-bold">{stat.value}</p>
              <p class="text-sm text-gray-500">{stat.description}</p>
            </div>
          </div>
        ))}
      </div>

      <div class="mt-8">
        <h2 class="text-2xl font-bold mb-4">Aktivitas Terbaru</h2>
        <div class="overflow-x-auto">
          <table class="table w-full">
            <thead>
              <tr>
                <th></th>
                <th>Aktivitas</th>
                <th>Pengguna</th>
                <th>Waktu</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th>1</th>
                <td>Pendaftaran Kader Baru</td>
                <td>kader.baru@example.com</td>
                <td>10 menit yang lalu</td>
              </tr>
              <tr>
                <th>2</th>
                <td>Menambahkan data IBK</td>
                <td>posyandu.melati@example.com</td>
                <td>1 jam yang lalu</td>
              </tr>
              <tr>
                <th>3</th>
                <td>Verifikasi akun Psikolog</td>
                <td>admin@sidifa.com</td>
                <td>2 jam yang lalu</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Admin Dashboard - Si-DIFA",
  meta: [
    {
      name: "description",
      content: "Halaman dashboard untuk admin Si-DIFA",
    },
  ],
};
