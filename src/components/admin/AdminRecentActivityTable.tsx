import { component$ } from "@builder.io/qwik";
import type { AdminRecentActivityItem } from "~/data/admin-dashboard-data";

interface AdminRecentActivityTableProps {
  activities: AdminRecentActivityItem[];
}

export const AdminRecentActivityTable = component$(
  (props: AdminRecentActivityTableProps) => {
    const { activities } = props;
    return (
      <div class="card bg-base-100 shadow-xl p-6">
        <h2 class="card-title text-xl font-bold mb-4">Aktivitas Terbaru</h2>
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
              {activities.length === 0 ? (
                <tr>
                  <td colSpan={4} class="text-center text-base-content/60 py-8">
                    Tidak ada aktivitas terbaru.
                  </td>
                </tr>
              ) : (
                activities.map((activity) => (
                  <tr key={activity.id}>
                    <th>{activity.id}</th>
                    <td>{activity.activity}</td>
                    <td>{activity.user}</td>
                    <td>{activity.time}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  },
);
