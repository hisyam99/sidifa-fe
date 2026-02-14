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
      <div class="relative overflow-hidden rounded-2xl border border-base-300/50 bg-base-100 shadow-sm transition-all duration-300 h-full flex flex-col">
        {/* Subtle top accent line */}
        <div class="pointer-events-none absolute inset-x-0 top-0 h-0.5 bg-linear-to-r from-primary/40 via-primary/20 to-transparent"></div>

        <header class="flex items-center justify-between gap-4 px-5 pt-5 pb-3">
          <div class="min-w-0">
            <h2 class="text-sm font-semibold text-base-content tracking-tight">
              Jadwal Kegiatan Terbaru
            </h2>
            <p class="text-xs text-base-content/50 mt-0.5">
              Daftar kegiatan posyandu terkini
            </p>
          </div>
          <span class="inline-flex items-center rounded-lg bg-base-200/80 px-2.5 py-1 text-xs font-medium text-base-content/60 tabular-nums">
            {activities.length} kegiatan
          </span>
        </header>

        <div class="flex-1 overflow-hidden">
          <div class="overflow-x-auto">
            <table class="table table-sm w-full">
              <thead>
                <tr class="border-b border-base-200">
                  <th class="text-[11px] font-semibold uppercase tracking-wider text-base-content/40 bg-base-200/30">
                    #
                  </th>
                  <th class="text-[11px] font-semibold uppercase tracking-wider text-base-content/40 bg-base-200/30">
                    Nama Kegiatan
                  </th>
                  <th class="text-[11px] font-semibold uppercase tracking-wider text-base-content/40 bg-base-200/30 hidden md:table-cell">
                    Jenis
                  </th>
                  <th class="text-[11px] font-semibold uppercase tracking-wider text-base-content/40 bg-base-200/30 hidden lg:table-cell">
                    Posyandu
                  </th>
                  <th class="text-[11px] font-semibold uppercase tracking-wider text-base-content/40 bg-base-200/30 hidden sm:table-cell">
                    Lokasi
                  </th>
                  <th class="text-[11px] font-semibold uppercase tracking-wider text-base-content/40 bg-base-200/30">
                    Tanggal
                  </th>
                  <th class="text-[11px] font-semibold uppercase tracking-wider text-base-content/40 bg-base-200/30 hidden xl:table-cell">
                    Waktu
                  </th>
                </tr>
              </thead>
              <tbody>
                {activities.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      class="text-center text-sm text-base-content/50 py-12"
                    >
                      <div class="flex flex-col items-center gap-2">
                        <svg
                          class="w-8 h-8 text-base-content/20"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="1.5"
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        <span>Tidak ada jadwal kegiatan.</span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  activities.map((activity, index) => (
                    <tr
                      key={activity.id}
                      class="hover:bg-base-200/30 transition-colors duration-150 border-b border-base-200/50 last:border-b-0"
                    >
                      <th class="align-top text-xs text-base-content/40 tabular-nums">
                        {index + 1}
                      </th>
                      <td class="align-top">
                        <div>
                          <p class="text-sm font-medium text-base-content leading-snug">
                            {activity.nama_kegiatan}
                          </p>
                          {activity.deskripsi && (
                            <p class="text-xs text-base-content/50 line-clamp-1 mt-0.5">
                              {activity.deskripsi}
                            </p>
                          )}
                        </div>
                      </td>
                      <td class="align-top hidden md:table-cell">
                        <span class="inline-flex items-center rounded-md bg-primary/8 px-2 py-0.5 text-xs font-medium text-primary/80 ring-1 ring-inset ring-primary/15">
                          {activity.jenis_kegiatan}
                        </span>
                      </td>
                      <td class="align-top hidden lg:table-cell">
                        <div>
                          <p class="text-sm font-medium text-base-content/80">
                            {activity.posyandu.nama_posyandu}
                          </p>
                          <p class="text-xs text-base-content/50 line-clamp-1">
                            {activity.posyandu.alamat}
                          </p>
                        </div>
                      </td>
                      <td class="align-top text-sm text-base-content/60 hidden sm:table-cell">
                        {activity.lokasi}
                      </td>
                      <td class="align-top whitespace-nowrap text-sm text-base-content/70 tabular-nums">
                        {formatDate(activity.tanggal)}
                      </td>
                      <td class="align-top whitespace-nowrap text-xs text-base-content/50 tabular-nums hidden xl:table-cell">
                        {formatTime(activity.waktu_mulai)} –{" "}
                        {formatTime(activity.waktu_selesai)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  },
);
