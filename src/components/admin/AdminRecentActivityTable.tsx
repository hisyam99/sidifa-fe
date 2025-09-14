import { component$ } from "@qwik.dev/core";
import type { AdminRecentActivityItem } from "~/data/admin-dashboard-data";

interface AdminRecentActivityTableProps {
  activities: AdminRecentActivityItem[];
}

export const AdminRecentActivityTable = component$(
  (props: AdminRecentActivityTableProps) => {
    const { activities } = props;
    return (
      <section class="group relative overflow-hidden rounded-2xl border border-white/30 bg-white/10 backdrop-blur-xl shadow-[0_8px_24px_rgba(0,0,0,0.08)] transition-all duration-300">
        <div class="pointer-events-none absolute inset-px rounded-[1rem] bg-gradient-to-br from-white/25 via-white/10 to-transparent opacity-70"></div>

        <header class="relative z-[1] flex items-center justify-between p-4">
          <h2 class="text-base font-semibold text-base-content/80">
            Aktivitas Terbaru
          </h2>
          <span class="text-xs text-base-content/60">
            {activities.length} item
          </span>
        </header>

        <div class="relative z-[1] overflow-hidden">
          <div class="overflow-x-auto">
            <table class="table table-sm w-full">
              <thead>
                <tr class="bg-white/20 backdrop-blur-md sticky top-0 z-10">
                  <th class="text-xs font-semibold text-base-content/60">#</th>
                  <th class="text-xs font-semibold text-base-content/60">
                    Aktivitas
                  </th>
                  <th class="text-xs font-semibold text-base-content/60 hidden sm:table-cell">
                    Pengguna
                  </th>
                  <th class="text-xs font-semibold text-base-content/60">
                    Waktu
                  </th>
                </tr>
              </thead>
              <tbody>
                {activities.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      class="text-center text-base-content/60 py-8"
                    >
                      Tidak ada aktivitas terbaru.
                    </td>
                  </tr>
                ) : (
                  activities.map((activity) => (
                    <tr
                      key={activity.id}
                      class="hover:bg-white/10 transition-colors duration-200"
                    >
                      <th class="align-top text-base-content/60">
                        {activity.id}
                      </th>
                      <td class="align-top">
                        <p class="text-sm text-base-content/90">
                          {activity.activity}
                        </p>
                      </td>
                      <td class="align-top hidden sm:table-cell text-base-content/80">
                        {activity.user}
                      </td>
                      <td class="align-top whitespace-nowrap text-base-content/70">
                        {activity.time}
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
