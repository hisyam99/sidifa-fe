import { component$, QRL } from "@builder.io/qwik";
import type { AdminVerificationItem } from "~/types/admin-account-verification";
import Spinner from "~/components/ui/Spinner";
import { LuEye, LuPencil } from "~/components/icons/lucide-optimized";

interface AdminVerificationTableProps {
  items: AdminVerificationItem[];
  page: number;
  limit: number;
  loading?: boolean;
  onViewDetail$?: QRL<(item: AdminVerificationItem) => void>;
  onVerify$?: QRL<(item: AdminVerificationItem) => void>;
  onUnverify$?: QRL<(item: AdminVerificationItem) => void>;
  error?: string | null;
}

export const AdminVerificationTable = component$(
  (props: AdminVerificationTableProps) => {
    const {
      items,
      loading = false,
      onViewDetail$,
      onVerify$,
      onUnverify$,
      error,
    } = props;

    const getStatusBadgeClass = (verification: "verified" | "unverified") => {
      return verification === "verified" ? "badge-success" : "badge-warning";
    };

    return (
      <div class="overflow-x-auto bg-base-100 p-2 ">
        <h2
          id="admin-verif-table-title"
          tabIndex={-1}
          class="text-lg font-bold mb-2 md:card-title md:text-xl md:mb-4"
        >
          Daftar Akun untuk Verifikasi
        </h2>
        {loading && <Spinner overlay />}
        {error && (
          <div class="alert alert-error mb-2 md:mb-4">
            <span>{error}</span>
          </div>
        )}
        <div class="overflow-x-auto">
          <div class="max-h-[60vh] overflow-y-auto">
            <table class="table table-xs xl:table-md table-pin-cols w-full">
              <thead>
                <tr>
                  <th class="sticky top-0 z-20 bg-base-100">Nama</th>
                  <th class="sticky top-0 z-20 bg-base-100">Email</th>
                  <th class="sticky top-0 z-20 bg-base-100">Peran</th>
                  <th class="sticky top-0 z-20 bg-base-100">
                    Status Verifikasi
                  </th>
                  <th class="sticky top-0 z-20 bg-base-100 table-pin-col">
                    Aksi
                  </th>
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
                    <tr key={item.id}>
                      <td
                        class="font-medium max-w-[160px] line-clamp-2 break-words whitespace-normal"
                        style="display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;"
                        title={item.name}
                      >
                        {item.name}
                      </td>
                      <td
                        class="max-w-[180px] overflow-hidden text-ellipsis whitespace-nowrap"
                        title={item.email}
                      >
                        {item.email}
                      </td>
                      <td
                        class="max-w-[120px] overflow-hidden text-ellipsis whitespace-nowrap"
                        title={item.role}
                      >
                        {item.role}
                      </td>
                      <td>
                        <span
                          class={`badge ${getStatusBadgeClass(item.verification)}`}
                        >
                          {item.verification === "verified"
                            ? "Terverifikasi"
                            : "Belum Terverifikasi"}
                        </span>
                      </td>
                      <th class="table-pin-col">
                        <div class="flex gap-2">
                          {onViewDetail$ && (
                            <button
                              class="btn btn-ghost btn-xs md:btn-sm"
                              onClick$={() => onViewDetail$(item)}
                            >
                              <span class="inline xl:hidden">
                                <LuEye class="w-4 h-4" />
                              </span>
                              <span class="hidden xl:inline">Lihat Detail</span>
                            </button>
                          )}
                          {item.verification === "unverified" && onVerify$ && (
                            <button
                              class="btn btn-success btn-xs md:btn-sm"
                              onClick$={() => onVerify$(item)}
                            >
                              <span class="inline xl:hidden">
                                <LuPencil class="w-4 h-4" />
                              </span>
                              <span class="hidden xl:inline">Verifikasi</span>
                            </button>
                          )}
                          {item.verification === "verified" && onUnverify$ && (
                            <button
                              class="btn btn-warning btn-xs md:btn-sm"
                              onClick$={() => onUnverify$(item)}
                            >
                              <span class="inline xl:hidden">
                                <LuPencil class="w-4 h-4" />
                              </span>
                              <span class="hidden xl:inline">
                                Batalkan Verifikasi
                              </span>
                            </button>
                          )}
                        </div>
                      </th>
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
