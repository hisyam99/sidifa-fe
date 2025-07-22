import { component$, QRL } from "@qwik.dev/core";
import type { AdminPsikologItem } from "~/types/admin-psikolog-management";

interface AdminPsikologTableProps {
  items: AdminPsikologItem[];
  page: number;
  limit: number;
  onViewDetail$?: QRL<(item: AdminPsikologItem) => void>;
  onEdit$?: QRL<(item: AdminPsikologItem) => void>;
  onDelete$?: QRL<(item: AdminPsikologItem) => void>;
  onToggleStatus$?: QRL<(item: AdminPsikologItem) => void>;
}

export const AdminPsikologTable = component$(
  (props: AdminPsikologTableProps) => {
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
        <h2 class="card-title text-xl font-bold mb-4">Daftar Psikolog</h2>
        <table class="table table-zebra w-full">
          <thead>
            <tr>
              <th>No</th>
              <th>Nama</th>
              <th>Email</th>
              <th>Spesialisasi</th>
              <th>Status</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td colSpan={6} class="text-center text-base-content/60 py-8">
                  Tidak ada data psikolog.
                </td>
              </tr>
            ) : (
              items.map((item: AdminPsikologItem, idx: number) => (
                <tr key={item.id}>
                  <td>{(page - 1) * limit + idx + 1}</td>
                  <td class="font-medium">{item.nama}</td>
                  <td>{item.email}</td>
                  <td>{item.spesialisasi}</td>
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
