import { component$, QRL } from "@builder.io/qwik";
import type { AdminVerificationItem } from "~/types/admin-account-verification";

interface AdminVerificationTableProps {
  items: AdminVerificationItem[];
  page: number;
  limit: number;
  onViewDetail$?: QRL<(item: AdminVerificationItem) => void>;
  onVerify$?: QRL<(item: AdminVerificationItem) => void>;
  onUnverify$?: QRL<(item: AdminVerificationItem) => void>;
}

export const AdminVerificationTable = component$(
  (props: AdminVerificationTableProps) => {
    const { items, onViewDetail$, onVerify$, onUnverify$ } = props;

    const getStatusBadgeClass = (verification: "verified" | "unverified") => {
      return verification === "verified" ? "badge-success" : "badge-warning";
    };

    return (
      <div class="overflow-x-auto card bg-base-100 shadow-xl p-6">
        <h2 class="card-title text-xl font-bold mb-4">
          Daftar Akun untuk Verifikasi
        </h2>
        <table class="table table-zebra w-full">
          <thead>
            <tr>
              <th>Nama</th>
              <th>Email</th>
              <th>Peran</th>
              <th>Status Verifikasi</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td colSpan={5} class="text-center text-base-content/60 py-8">
                  Tidak ada data akun untuk verifikasi.
                </td>
              </tr>
            ) : (
              items.map((item: AdminVerificationItem) => (
                <tr key={item.id}>
                  <td class="font-medium">{item.name}</td>
                  <td>{item.email}</td>
                  <td>{item.role}</td>
                  <td>
                    <span
                      class={`badge ${getStatusBadgeClass(item.verification)}`}
                    >
                      {item.verification === "verified"
                        ? "Terverifikasi"
                        : "Belum Terverifikasi"}
                    </span>
                  </td>
                  <td>
                    <div class="flex gap-2">
                      {onViewDetail$ && (
                        <button
                          class="btn btn-sm btn-ghost"
                          onClick$={() => onViewDetail$(item)}
                        >
                          Lihat Detail
                        </button>
                      )}
                      {item.verification === "unverified" && onVerify$ && (
                        <button
                          class="btn btn-sm btn-success"
                          onClick$={() => onVerify$(item)}
                        >
                          Verifikasi
                        </button>
                      )}
                      {item.verification === "verified" && onUnverify$ && (
                        <button
                          class="btn btn-sm btn-warning"
                          onClick$={() => onUnverify$(item)}
                        >
                          Batalkan Verifikasi
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
