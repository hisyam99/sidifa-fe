import { component$, QRL } from "@builder.io/qwik";
import { LuLoader2 } from "~/components/icons/lucide-optimized";
import type { AdminPosyanduItem } from "~/types/admin-posyandu-management";

interface AdminPosyanduTableProps {
  items: AdminPosyanduItem[];
  page: number;
  limit: number;
  loading?: boolean;
  onViewDetail$?: QRL<(item: AdminPosyanduItem) => void>;
  onEdit$?: QRL<(item: AdminPosyanduItem) => void>;
  onDelete$?: QRL<(item: AdminPosyanduItem) => void>;
  onToggleStatus$?: QRL<(item: AdminPosyanduItem) => void>;
}

export const AdminPosyanduTable = component$(
  (props: AdminPosyanduTableProps) => {
    const {
      items,
      loading = false,
      onViewDetail$,
      onEdit$,
      onDelete$,
      // onToggleStatus$,
    } = props;

    const getStatusBadgeClass = (status: string) => {
      return status === "Aktif" ? "badge-success" : "badge-error";
    };

    return (
      <div class="card bg-base-100 shadow-xl relative">
        <div class="card-body">
          <h2 class="card-title text-xl font-bold mb-4">Daftar Posyandu</h2>

          {/* Loading Overlay */}
          {loading && (
            <div class="absolute inset-0 bg-base-100/70 rounded-3xl flex justify-center items-center z-10">
              <LuLoader2
                class="animate-spin text-primary"
                style={{ width: "32px", height: "32px" }}
              />
            </div>
          )}

          <div
            class={`overflow-x-auto ${loading ? "pointer-events-none opacity-60" : ""}`}
          >
            <table class="table table-zebra w-full">
              <thead>
                <tr>
                  <th>Nama Posyandu</th>
                  <th>Alamat</th>
                  <th>No. Telp</th>
                  <th>Status</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {items.length === 0 && !loading ? (
                  <tr>
                    <td
                      colSpan={5}
                      class="text-center text-base-content/60 py-8"
                    >
                      Tidak ada data posyandu.
                    </td>
                  </tr>
                ) : (
                  items.map((item: AdminPosyanduItem) => (
                    <tr key={item.id}>
                      <td class="font-medium">{item.nama_posyandu}</td>
                      <td>{item.alamat}</td>
                      <td>{item.no_telp}</td>
                      <td>
                        <span
                          class={`badge ${getStatusBadgeClass(item.status)}`}
                        >
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
                          {/* {onToggleStatus$ && (
                            <button
                              class="btn btn-sm btn-warning"
                              onClick$={() => onToggleStatus$(item)}
                            >
                              {item.status === "Aktif"
                                ? "Nonaktifkan"
                                : "Aktifkan"}
                            </button>
                          )} */}
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
        </div>
      </div>
    );
  },
);
