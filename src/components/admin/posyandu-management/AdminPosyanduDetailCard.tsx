import { component$, QRL } from "@builder.io/qwik";
import type { AdminPosyanduItem } from "~/types/admin-posyandu-management";

interface AdminPosyanduDetailCardProps {
  item: AdminPosyanduItem;
  onEdit$?: QRL<(id: string) => void>;
  onDelete$?: QRL<(id: string) => void>;
  onToggleStatus$?: QRL<(id: string, currentStatus: string) => void>;
}

export const AdminPosyanduDetailCard = component$(
  (props: AdminPosyanduDetailCardProps) => {
    const { item /* onEdit$, onDelete$, onToggleStatus$ */ } = props;

    // Add null check for item
    if (!item) {
      return (
        <div class="card bg-base-100 shadow-md p-6">
          {/* <h2 class="card-title text-xl font-bold mb-4">Detail Posyandu</h2> */}
          <p class="text-gray-500">Data posyandu tidak tersedia.</p>
        </div>
      );
    }

    const getStatusBadgeClass = (status: string) => {
      return status === "Aktif" ? "badge-success" : "badge-error";
    };

    const formatDate = (dateString: string | null) => {
      if (!dateString) return "Tidak tersedia";
      return new Date(dateString).toLocaleDateString("id-ID", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    };

    return (
      <div class="card bg-base-100 shadow-xl relative">
        <div class="card-body">
          {/* <h2 class="card-title text-xl font-bold mb-4">Detail Posyandu</h2> */}
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label class="font-semibold text-sm text-gray-500">
                ID Posyandu:
              </label>
              <p class="text-gray-800 break-all font-mono text-sm">{item.id}</p>
            </div>
            <div>
              <label class="font-semibold text-sm text-gray-500">
                Nama Posyandu:
              </label>
              <p class="text-gray-800 font-medium">{item.nama_posyandu}</p>
            </div>
            <div class="md:col-span-2">
              <label class="font-semibold text-sm text-gray-500">Alamat:</label>
              <p class="text-gray-800">{item.alamat}</p>
            </div>
            <div>
              <label class="font-semibold text-sm text-gray-500">
                No. Telepon:
              </label>
              <p class="text-gray-800">{item.no_telp}</p>
            </div>
            <div>
              <label class="font-semibold text-sm text-gray-500">Status:</label>
              <div class="mt-1">
                <span class={`badge ${getStatusBadgeClass(item.status)}`}>
                  {item.status}
                </span>
              </div>
            </div>
            {item.users_id && (
              <div>
                <label class="font-semibold text-sm text-gray-500">
                  User ID:
                </label>
                <p class="text-gray-800 break-all font-mono text-sm">
                  {item.users_id}
                </p>
              </div>
            )}
            {item.created_at && (
              <div>
                <label class="font-semibold text-sm text-gray-500">
                  Tanggal Dibuat:
                </label>
                <p class="text-gray-800">{formatDate(item.created_at)}</p>
              </div>
            )}
            {item.updated_at && (
              <div>
                <label class="font-semibold text-sm text-gray-500">
                  Terakhir Diperbarui:
                </label>
                <p class="text-gray-800">{formatDate(item.updated_at)}</p>
              </div>
            )}
            {item.deleted_at && (
              <div>
                <label class="font-semibold text-sm text-gray-500">
                  Tanggal Dihapus:
                </label>
                <p class="text-red-600">{formatDate(item.deleted_at)}</p>
              </div>
            )}
          </div>
          <div class="flex gap-2 mt-4">
            {/* {onEdit$ && (
            <button class="btn btn-primary" onClick$={() => onEdit$(item.id)}>
              Edit
            </button>
          )}
          {onToggleStatus$ && (
            <button
              class="btn btn-warning"
              onClick$={() => onToggleStatus$(item.id, item.status)}
            >
              {item.status === "Aktif" ? "Nonaktifkan" : "Aktifkan"}
            </button>
          )}
          {onDelete$ && (
            <button class="btn btn-error" onClick$={() => onDelete$(item.id)}>
              Hapus
            </button>
          )} */}
          </div>
        </div>
      </div>
    );
  },
);
