import { component$, QRL } from "@builder.io/qwik";
import Spinner from "~/components/ui/Spinner";
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

    // const getStatusBadgeClass = (status: string) => {
    //   return status === "Aktif" ? "badge-success" : "badge-error";
    // };

    return (
      <div class="bg-base-100 p-3 md:p-4 rounded-xl shadow-sm border border-base-200/60">
        <div class="flex items-center justify-between mb-3">
          <h2 class="text-lg font-bold md:text-xl">Daftar Posyandu</h2>
        </div>

        {loading && <Spinner overlay />}

        {/* Desktop table */}
        <div class="hidden md:block overflow-x-auto">
          <div class="max-h-[60vh] overflow-y-auto rounded-lg">
            <table class="table table-sm xl:table-md w-full table-pin-rows">
              <thead>
                <tr class="bg-base-200">
                  <th class="bg-base-200">Nama Posyandu</th>
                  <th class="bg-base-200">Alamat</th>
                  <th class="bg-base-200">No. Telp</th>
                  {/* <th class="bg-base-200">Status</th> */}
                  <th class="bg-base-200 table-pin-col">Aksi</th>
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
                    <tr key={item.id} class="hover">
                      <td class="font-medium max-w-[220px] whitespace-normal break-words">
                        {item.nama_posyandu}
                      </td>
                      <td class="max-w-[260px] whitespace-normal break-words">
                        {item.alamat}
                      </td>
                      <td class="max-w-[160px] whitespace-normal break-words">
                        {item.no_telp}
                      </td>
                      {/* <td>
                        <span
                          class={`badge ${getStatusBadgeClass(item.status)}`}
                        >
                          {item.status}
                        </span>
                      </td> */}
                      <td class="table-pin-col">
                        <div class="join">
                          {onViewDetail$ && (
                            <button
                              class="btn btn-ghost btn-xs md:btn-sm join-item"
                              onClick$={() => onViewDetail$(item)}
                            >
                              Lihat
                            </button>
                          )}
                          {onEdit$ && (
                            <button
                              class="btn btn-info btn-xs md:btn-sm join-item"
                              onClick$={() => onEdit$(item)}
                            >
                              Edit
                            </button>
                          )}
                          {onDelete$ && (
                            <button
                              class="btn btn-error btn-xs md:btn-sm join-item"
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

        {/* Mobile card list */}
        <div class="md:hidden space-y-3">
          {items.length === 0 && !loading ? (
            <div class="text-center text-base-content/60 py-8">
              Tidak ada data posyandu.
            </div>
          ) : (
            items.map((item: AdminPosyanduItem) => (
              <div
                key={item.id}
                class="card bg-base-100 border border-base-200 shadow-sm"
              >
                <div class="card-body p-4">
                  <div class="flex items-start justify-between gap-3">
                    <div class="min-w-0">
                      <div class="font-semibold break-words">
                        {item.nama_posyandu}
                      </div>
                      <div class="text-sm opacity-80 break-words">
                        {item.alamat}
                      </div>
                      <div class="text-sm mt-1">No. Telp: {item.no_telp}</div>
                    </div>
                    {/* <span class={`badge ${getStatusBadgeClass(item.status)}`}>
                      {item.status}
                    </span> */}
                  </div>
                  <div class="mt-3">
                    <div class="join">
                      {onViewDetail$ && (
                        <button
                          class="btn btn-ghost btn-xs join-item"
                          onClick$={() => onViewDetail$(item)}
                        >
                          Lihat
                        </button>
                      )}
                      {onEdit$ && (
                        <button
                          class="btn btn-info btn-xs join-item"
                          onClick$={() => onEdit$(item)}
                        >
                          Edit
                        </button>
                      )}
                      {onDelete$ && (
                        <button
                          class="btn btn-error btn-xs join-item"
                          onClick$={() => onDelete$(item)}
                        >
                          Hapus
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  },
);
