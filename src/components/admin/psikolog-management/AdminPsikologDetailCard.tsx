import { component$, QRL } from "@qwik.dev/core";
import type { AdminPsikologItem } from "~/types/admin-psikolog-management";

interface AdminPsikologDetailCardProps {
  item: AdminPsikologItem;
  onEdit$?: QRL<(item: AdminPsikologItem) => void>;
  onDelete$?: QRL<(item: AdminPsikologItem) => void>;
  onToggleStatus$?: QRL<(item: AdminPsikologItem) => void>;
}

export const AdminPsikologDetailCard = component$(
  (props: AdminPsikologDetailCardProps) => {
    const { item, onEdit$, onDelete$, onToggleStatus$ } = props;

    const getStatusBadgeClass = (status: string) => {
      return status === "Aktif" ? "badge-success" : "badge-error";
    };

    return (
      <div class="card bg-base-100 shadow-md p-6">
        <h2 class="card-title text-xl font-bold mb-4">Detail Psikolog</h2>
        <div class="space-y-2 mb-4">
          <div>
            <b>Nama:</b> {item.nama}
          </div>
          <div>
            <b>Email:</b> {item.email}
          </div>
          <div>
            <b>No. Telepon:</b> {item.no_telp}
          </div>
          <div>
            <b>Spesialisasi:</b> {item.spesialisasi}
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
            <button class="btn btn-primary" onClick$={() => onEdit$(item)}>
              Edit
            </button>
          )}
          {onToggleStatus$ && (
            <button
              class="btn btn-warning"
              onClick$={() => onToggleStatus$(item)}
            >
              {item.status === "Aktif" ? "Nonaktifkan" : "Aktifkan"}
            </button>
          )}
          {onDelete$ && (
            <button class="btn btn-error" onClick$={() => onDelete$(item)}>
              Hapus
            </button>
          )}
        </div>
      </div>
    );
  },
);
