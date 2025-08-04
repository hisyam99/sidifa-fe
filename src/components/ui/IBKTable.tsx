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
    <div class="overflow-x-auto card bg-base-100 shadow-xl p-6">
      <h2
        id="ibk-table-title"
        tabIndex={-1}
        class="card-title text-xl font-bold mb-4"
      >
        Daftar IBK
      </h2>
      {loading?.value && <Spinner overlay />}
      {error.value && (
        <div class="alert alert-error mb-4">
          <span>{error.value}</span>
        </div>
      )}
      <table class="table w-full">
        <thead>
          <tr>
            <th>NIK</th>
            <th>Nama</th>
            <th>Jenis Kelamin</th>
            <th>Alamat</th>
            <th>Aksi</th>
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
                <td class="font-mono">{ibk.personal_data.nik}</td>
                <td>{ibk.personal_data.nama_lengkap}</td>
                <td>
                  {ibk.personal_data.gender === "laki-laki"
                    ? "Laki-laki"
                    : "Perempuan"}
                </td>
                <td>{ibk.personal_data.alamat_lengkap}</td>
                <td>
                  <div class="flex gap-2">
                    {onViewDetail$ && (
                      <button
                        class="btn btn-ghost btn-sm"
                        onClick$={() => onViewDetail$(ibk)}
                      >
                        Lihat Detail
                      </button>
                    )}
                    {onEdit$ && (
                      <button
                        class="btn btn-primary btn-sm"
                        onClick$={() => onEdit$(ibk)}
                      >
                        Edit
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
});
