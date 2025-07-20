import { component$, QRL } from "@builder.io/qwik";
import type { AdminPosyanduItem } from "~/types/admin-posyandu-management";

interface AdminPosyanduTableProps {
  items: AdminPosyanduItem[];
  page: number;
  limit: number;
  onViewDetail$?: QRL<(item: AdminPosyanduItem) => void>;
  onEdit$?: QRL<(item: AdminPosyanduItem) => void>;
  onDelete$?: QRL<(item: AdminPosyanduItem) => void>;
  onToggleStatus$?: QRL<(item: AdminPosyanduItem) => void>;
}

export const AdminPosyanduTable = component$(
  (props: AdminPosyanduTableProps) => {
    const {
      items,
      page,
      limit,
      onViewDetail$,
      onEdit$,
      onDelete$,
      onToggleStatus$,
    } = props;

    const getStatusBadgeClass = (status: string) => {
      return status === "Aktif" ? "badge-success" : "badge-error";
    };

    return (
      <div class="overflow-x-auto card bg-base-100 shadow-xl p-6">
        <h2 class="card-title text-xl font-bold mb-4">Daftar Posyandu</h2>
        <table class="table table-zebra w-full">
          <thead>
            <tr>
              <th>No</th>
              <th>Nama Posyandu</th>
              <th>Alamat</th>
              <th>No. Telp</th>
              <th>Status</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td colSpan={6} class="text-center text-base-content/60 py-8">
                  Tidak ada data posyandu.
                </td>
              </tr>
            ) : (
              items.map((item: AdminPosyanduItem, idx: number) => (
                <tr key={item.id}>
                  <td>{(page - 1) * limit + idx + 1}</td>
                  <td class="font-medium">{item.nama_posyandu}</td>
                  <td>{item.alamat}</td>
                  <td>{item.no_telp}</td>
                  <td>
                    <span class={`badge ${getStatusBadgeClass(item.status)}`}>
                      {item.status}
                    </span>
                  </td>
                  <td>
                    <div class="flex gap-2">
                      {onViewDetail$ && (
                        <button
                          class="btn btn-sm btn-ghost"
                          onClick$={() => onViewDetail$(item)}
                        >
                          Lihat
                        </button>
                      )}
                      {onEdit$ && (
                        <button
                          class="btn btn-sm btn-info"
                          onClick$={() => onEdit$(item)}
                        >
                          Edit
                        </button>
                      )}
                      {onToggleStatus$ && (
                        <button
                          class="btn btn-sm btn-warning"
                          onClick$={() => onToggleStatus$(item)}
                        >
                          {item.status === "Aktif" ? "Nonaktifkan" : "Aktifkan"}
                        </button>
                      )}
                      {onDelete$ && (
                        <button
                          class="btn btn-sm btn-error"
                          onClick$={() => onDelete$(item)}
                        >
                          Hapus
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    );
  },
);
