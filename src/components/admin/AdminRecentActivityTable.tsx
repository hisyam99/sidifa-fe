import { component$ } from "@builder.io/qwik";
import type { JadwalKegiatanItem } from "~/services/dashboard.service";

interface AdminRecentActivityTableProps {
  activities: JadwalKegiatanItem[];
}

export const AdminRecentActivityTable = component$(
  (props: AdminRecentActivityTableProps) => {
    const { activities } = props;

    const formatDate = (dateString: string) => {
      const date = new Date(dateString);
      return date.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    };

    const formatTime = (time: string) => {
      return time.substring(0, 5); // Get HH:MM from HH:MM:SS
    };

    return (
      <section class="group relative overflow-hidden rounded-2xl border border-white/30 bg-white/10 backdrop-blur-xl shadow-[0_8px_24px_rgba(0,0,0,0.08)] transition-all duration-300">
        <div class="pointer-events-none absolute inset-px rounded-[1rem] bg-gradient-to-br from-white/25 via-white/10 to-transparent opacity-70"></div>

        <header class="relative z-[1] flex items-center justify-between p-4">
          <div>
            <h2 class="text-base font-semibold text-base-content/80">
              Jadwal Kegiatan Terbaru
            </h2>
            <p class="text-xs text-base-content/60 mt-1">
              Daftar kegiatan posyandu
            </p>
          </div>
          <span class="text-xs text-base-content/60">
            {activities.length} kegiatan
          </span>
        </header>

        <div class="relative z-[1] overflow-hidden">
          <div class="overflow-x-auto">
            <table class="table table-sm w-full">
              <thead>
                <tr class="bg-white/20 backdrop-blur-md sticky top-0 z-10">
                  <th class="text-xs font-semibold text-base-content/60">#</th>
                  <th class="text-xs font-semibold text-base-content/60">
                    Nama Kegiatan
                  </th>
                  <th class="text-xs font-semibold text-base-content/60 hidden md:table-cell">
                    Jenis Kegiatan
                  </th>
                  <th class="text-xs font-semibold text-base-content/60 hidden lg:table-cell">
                    Posyandu
                  </th>
                  <th class="text-xs font-semibold text-base-content/60 hidden sm:table-cell">
                    Lokasi
                  </th>
                  <th class="text-xs font-semibold text-base-content/60">
                    Tanggal
                  </th>
                  <th class="text-xs font-semibold text-base-content/60 hidden xl:table-cell">
                    Waktu
                  </th>
                </tr>
              </thead>
              <tbody>
                {activities.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      class="text-center text-base-content/60 py-8"
                    >
                      Tidak ada jadwal kegiatan.
                    </td>
                  </tr>
                ) : (
                  activities.map((activity, index) => (
                    <tr
                      key={activity.id}
                      class="hover:bg-white/10 transition-colors duration-200"
                    >
                      <th class="align-top text-base-content/60">
                        {index + 1}
                      </th>
                      <td class="align-top">
                        <div>
                          <p class="text-sm font-medium text-base-content/90">
                            {activity.nama_kegiatan}
                          </p>
                          {activity.deskripsi && (
                            <p class="text-xs text-base-content/60 line-clamp-1 mt-0.5">
                              {activity.deskripsi}
                            </p>
                          )}
                        </div>
                      </td>
                      <td class="align-top text-base-content/80 hidden md:table-cell">
                        <span class="badge badge-sm badge-ghost">
                          {activity.jenis_kegiatan}
                        </span>
                      </td>
                      <td class="align-top text-base-content/80 hidden lg:table-cell">
                        <div>
                          <p class="text-sm font-medium">
                            {activity.posyandu.nama_posyandu}
                          </p>
                          <p class="text-xs text-base-content/60 line-clamp-1">
                            {activity.posyandu.alamat}
                          </p>
                        </div>
                      </td>
                      <td class="align-top text-base-content/70 text-sm hidden sm:table-cell">
                        {activity.lokasi}
                      </td>
                      <td class="align-top whitespace-nowrap text-base-content/80 text-sm">
                        {formatDate(activity.tanggal)}
                      </td>
                      <td class="align-top whitespace-nowrap text-base-content/70 text-xs hidden xl:table-cell">
                        {formatTime(activity.waktu_mulai)} -{" "}
                        {formatTime(activity.waktu_selesai)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div class="pointer-events-none absolute -left-10 -bottom-10 h-28 w-28 rounded-full bg-primary/20 blur-2xl transition-opacity duration-300 opacity-0 group-hover:opacity-100"></div>
      </section>
    );
  },
);
