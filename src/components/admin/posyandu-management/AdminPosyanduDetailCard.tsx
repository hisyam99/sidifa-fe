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
    const { item, onEdit$, onDelete$, onToggleStatus$ } = props;

    const getStatusBadgeClass = (status: string) => {
      return status === "Aktif" ? "badge-success" : "badge-error";
    };

    return (
      <div class="card bg-base-100 shadow-md p-6">
        <h2 class="card-title text-xl font-bold mb-4">Detail Posyandu</h2>
        <div class="space-y-2 mb-4">
          <div>
            <b>Nama Posyandu:</b> {item.nama_posyandu}
          </div>
          <div>
            <b>Alamat:</b> {item.alamat}
          </div>
          <div>
            <b>No. Telepon:</b> {item.no_telp}
          </div>
          <div>
            <b>Status:</b>{" "}
            <span class={`badge ${getStatusBadgeClass(item.status)}`}>
              {item.status}
            </span>
          </div>
        </div>
        <div class="flex gap-2 mt-4">
          {onEdit$ && (
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
          )}
        </div>
      </div>
    );
  },
);
