import { component$, QRL } from "@builder.io/qwik";
import type { AdminVerificationItem } from "~/types/admin-account-verification";
import Spinner from "~/components/ui/Spinner";
import { LuCheck, LuAlertTriangle } from "~/components/icons/lucide-optimized";

interface AdminVerificationTableProps {
  items: AdminVerificationItem[];
  page: number;
  limit: number;
  loading?: boolean;
  onVerify$?: QRL<(item: AdminVerificationItem) => void>;
  onDecline$?: QRL<(item: AdminVerificationItem) => void>;
  error?: string | null;
}

export const AdminVerificationTable = component$(
  (props: AdminVerificationTableProps) => {
    const { items, loading = false, onVerify$, onDecline$, error } = props;

    const getStatusBadgeClass = (
      status: "verified" | "unverified" | "declined",
    ) => {
      if (status === "verified") return "badge-success";
      if (status === "declined") return "badge-error";
      return "badge-warning";
    };

    const getStatusLabel = (status: "verified" | "unverified" | "declined") => {
      if (status === "verified") return "Terverifikasi";
      if (status === "declined") return "Ditolak";
      return "Belum Terverifikasi";
    };

    return (
      <div class="bg-base-100 p-3 md:p-4 rounded-xl shadow-sm border border-base-200/60">
        <div class="flex items-center justify-between mb-3">
          <h2
            id="admin-verif-table-title"
            tabIndex={-1}
            class="text-lg font-bold md:text-xl"
          >
            Daftar Akun untuk Verifikasi
          </h2>
        </div>

        {loading && <Spinner overlay />}
        {error && (
          <div class="alert alert-error mb-3">
            <span>{error}</span>
          </div>
        )}

        {/* Desktop table */}
        <div class="hidden md:block overflow-x-auto">
          <div class="max-h-[60vh] overflow-y-auto rounded-lg">
            <table class="table table-sm xl:table-md w-full table-pin-rows table-pin-cols">
              <thead>
                <tr class="bg-base-200">
                  <th class="bg-base-200">Nama</th>
                  <th class="bg-base-200">Email</th>
                  <th class="bg-base-200">Peran</th>
                  <th class="bg-base-200">Status</th>
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
                      Tidak ada data akun untuk verifikasi.
                    </td>
                  </tr>
                ) : (
                  items.map((item: AdminVerificationItem) => (
                    <tr key={item.id} class="hover">
                      <td class="font-medium max-w-[220px] whitespace-normal break-words">
                        {item.name}
                      </td>
                      <td class="max-w-[260px] whitespace-normal break-words">
                        {item.email}
                      </td>
                      <td class="max-w-[140px] whitespace-normal break-words">
                        {item.role}
                      </td>
                      <td>
                        <span
                          class={`badge ${getStatusBadgeClass(item.status)}`}
                        >
                          {getStatusLabel(item.status)}
                        </span>
                      </td>
                      <td class="table-pin-col relative isolate">
                        <div class="join">
                          {onVerify$ && (
                            <div
                              class="tooltip tooltip-success tooltip-top"
                              data-tip="Verify account"
                            >
                              <button
                                class="btn btn-success btn-xs md:btn-sm join-item"
                                onClick$={() => onVerify$(item)}
                              >
                                <LuCheck class="w-4 h-4" />
                              </button>
                            </div>
                          )}
                          {onDecline$ && (
                            <div
                              class="tooltip tooltip-error tooltip-top"
                              data-tip="Decline account"
                            >
                              <button
                                class="btn btn-error btn-xs md:btn-sm join-item"
                                onClick$={() => onDecline$(item)}
                              >
                                <LuAlertTriangle class="w-4 h-4" />
                              </button>
                            </div>
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
              Tidak ada data akun untuk verifikasi.
            </div>
          ) : (
            items.map((item: AdminVerificationItem) => (
              <div
                key={item.id}
                class="card bg-base-100 border border-base-200 shadow-sm"
              >
                <div class="card-body p-4">
                  <div class="flex items-start justify-between gap-3">
                    <div class="min-w-0">
                      <div class="font-semibold break-words">{item.name}</div>
                      <div class="text-sm opacity-80 break-words">
                        {item.email}
                      </div>
                      <div class="text-sm mt-1">Peran: {item.role}</div>
                    </div>
                    <span class={`badge ${getStatusBadgeClass(item.status)}`}>
                      {getStatusLabel(item.status)}
                    </span>
                  </div>
                  <div class="mt-3">
                    <div class="join">
                      {onVerify$ && (
                        <div
                          class="tooltip tooltip-success tooltip-top"
                          data-tip="Verify"
                        >
                          <button
                            class="btn btn-success btn-xs join-item"
                            onClick$={() => onVerify$(item)}
                          >
                            <LuCheck class="w-4 h-4" />
                          </button>
                        </div>
                      )}
                      {onDecline$ && (
                        <div
                          class="tooltip tooltip-error tooltip-top"
                          data-tip="Decline"
                        >
                          <button
                            class="btn btn-error btn-xs join-item"
                            onClick$={() => onDecline$(item)}
                          >
                            <LuAlertTriangle class="w-4 h-4" />
                          </button>
                        </div>
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
