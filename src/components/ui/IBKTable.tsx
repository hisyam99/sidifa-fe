import { component$, QRL, Signal } from "@builder.io/qwik";
import type { IBKRecord } from "~/types/ibk";
import { Spinner } from "./Spinner";

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
    <div class="overflow-x-auto bg-base-100 p-2 md:card md:p-6 md:shadow-xl">
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
      <table class="table table-xs md:table-md table-pin-rows table-pin-cols w-full">
        <thead>
          <tr>
            <th class="table-pin-row">NIK</th>
            <th class="table-pin-row">Nama</th>
            <th class="table-pin-row">Jenis Kelamin</th>
            <th class="table-pin-row">Alamat</th>
            <th class="table-pin-col table-pin-row">Aksi</th>
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
                <td>{ibk.personal_data.nama_lengkap}</td>
                <td>
                  {ibk.personal_data.gender === "laki-laki"
                    ? "Laki-laki"
                    : "Perempuan"}
                </td>
                <td>{ibk.personal_data.alamat_lengkap}</td>
                <th class="table-pin-col">
                  <div class="flex gap-2">
                    {onViewDetail$ && (
                      <button
                        class="btn btn-ghost btn-xs md:btn-sm"
                        onClick$={() => onViewDetail$(ibk)}
                      >
                        Lihat Detail
                      </button>
                    )}
                    {onEdit$ && (
                      <button
                        class="btn btn-primary btn-xs md:btn-sm"
                        onClick$={() => onEdit$(ibk)}
                      >
                        Edit
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
  );
});
