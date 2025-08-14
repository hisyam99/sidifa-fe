import { component$, QRL, Signal } from "@builder.io/qwik";
import type { IBKRecord } from "~/types/ibk";
import { Spinner } from "./Spinner";
import { LuEye, LuPencil } from "~/components/icons/lucide-optimized";

interface IBKTableProps {
  ibkList: Signal<IBKRecord[]>;
  error: Signal<string | null>;
  loading?: Signal<boolean>;
  onViewDetail$?: QRL<(ibk: IBKRecord) => void>;
  onEdit$?: QRL<(ibk: IBKRecord) => void>;
}

export const IBKTable = component$((props: IBKTableProps) => {
  const { ibkList, error, onViewDetail$, onEdit$, loading } = props;
  return (
    <div class="overflow-x-auto bg-base-100 p-2 ">
      <h2
        id="ibk-table-title"
        tabIndex={-1}
        class="text-lg font-bold mb-2 md:card-title md:text-xl md:mb-4"
      >
        Daftar IBK
      </h2>
      {loading?.value && <Spinner overlay />}
      {error.value && (
        <div class="alert alert-error mb-2 md:mb-4">
          <span>{error.value}</span>
        </div>
      )}
      {/* Desktop table */}
      <div class="hidden md:block overflow-x-auto">
        <div class="max-h-[60vh] overflow-y-auto">
          <table class="table table-xs xl:table-md table-pin-cols table-pin-rows w-full">
            <thead>
              <tr class="bg-base-200">
                <th class="bg-base-200">NIK</th>
                <th class="bg-base-200">Nama</th>
                <th class="bg-base-200">Jenis Kelamin</th>
                <th class="bg-base-200">Alamat</th>
                <th class="bg-base-200 table-pin-col">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {ibkList.value.length === 0 && !error.value ? (
                <tr>
                  <td colSpan={5} class="text-center text-base-content/60 py-8">
                    Tidak ada data IBK.
                  </td>
                </tr>
              ) : (
                ibkList.value.map((ibk) => (
                  <tr key={ibk.personal_data.id}>
                    <td>{ibk.personal_data.nik}</td>
                    <td
                      class="max-w-[160px] line-clamp-2 break-words whitespace-normal"
                      style="display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;"
                      title={ibk.personal_data.nama_lengkap}
                    >
                      {ibk.personal_data.nama_lengkap}
                    </td>
                    <td
                      class="max-w-[120px] overflow-hidden text-ellipsis whitespace-nowrap"
                      title={
                        ibk.personal_data.gender === "laki-laki"
                          ? "Laki-laki"
                          : "Perempuan"
                      }
                    >
                      {ibk.personal_data.gender === "laki-laki"
                        ? "Laki-laki"
                        : "Perempuan"}
                    </td>
                    <td
                      class="max-w-[160px] line-clamp-2 break-words whitespace-normal"
                      style="display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;"
                      title={ibk.personal_data.alamat_lengkap}
                    >
                      {ibk.personal_data.alamat_lengkap}
                    </td>
                    <th class="table-pin-col">
                      <div class="flex gap-2">
                        {onViewDetail$ && (
                          <button
                            class="btn btn-ghost btn-xs md:btn-sm"
                            onClick$={() => onViewDetail$(ibk)}
                          >
                            <span class="inline xl:hidden">
                              <LuEye class="w-4 h-4" />
                            </span>
                            <span class="hidden xl:inline">Lihat Detail</span>
                          </button>
                        )}
                        {onEdit$ && (
                          <button
                            class="btn btn-primary btn-xs md:btn-sm"
                            onClick$={() => onEdit$(ibk)}
                          >
                            <span class="inline xl:hidden">
                              <LuPencil class="w-4 h-4" />
                            </span>
                            <span class="hidden xl:inline">Edit</span>
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

      {/* Mobile card list */}
      <div class="md:hidden space-y-3">
        {ibkList.value.length === 0 && !error.value ? (
          <div class="text-center text-base-content/60 py-8">
            Tidak ada data IBK.
          </div>
        ) : (
          ibkList.value.map((ibk) => (
            <div
              key={ibk.personal_data.id}
              class="card bg-base-100 border border-base-200 shadow-sm"
            >
              <div class="card-body p-4">
                <div class="flex items-start justify-between gap-3">
                  <div class="min-w-0">
                    <div class="font-semibold break-words">
                      {ibk.personal_data.nama_lengkap}
                    </div>
                    <div class="text-sm opacity-80 break-words">
                      NIK: {ibk.personal_data.nik}
                    </div>
                    <div class="text-sm mt-1">
                      {ibk.personal_data.gender === "laki-laki"
                        ? "Laki-laki"
                        : "Perempuan"}
                    </div>
                    <div class="text-sm mt-1">
                      {ibk.personal_data.alamat_lengkap}
                    </div>
                  </div>
                </div>
                <div class="mt-3">
                  <div class="join">
                    {onViewDetail$ && (
                      <button
                        class="btn btn-ghost btn-xs join-item"
                        onClick$={() => onViewDetail$(ibk)}
                      >
                        Detail
                      </button>
                    )}
                    {onEdit$ && (
                      <button
                        class="btn btn-primary btn-xs join-item"
                        onClick$={() => onEdit$(ibk)}
                      >
                        Edit
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
});
