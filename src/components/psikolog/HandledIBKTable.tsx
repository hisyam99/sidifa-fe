import { component$, QRL } from "@builder.io/qwik";
import type { HandledIBKItem } from "~/data/psikolog-dashboard-data";

interface HandledIBKTableProps {
  ibkList: HandledIBKItem[];
  onViewHistory$?: QRL<(id: string) => void>; // Optional view history functionality
}

export const HandledIBKTable = component$((props: HandledIBKTableProps) => {
  const { ibkList, onViewHistory$ } = props;
  return (
    <div class="overflow-x-auto card bg-base-100 shadow-xl p-6">
      <h2 class="card-title text-xl font-bold mb-4">Pasien/IBK Ditangani</h2>
      <table class="table w-full">
        <thead>
          <tr>
            <th>ID Pasien</th>
            <th>Nama</th>
            <th>Sesi Terakhir</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {ibkList.length === 0 ? (
            <tr>
              <td colSpan={4} class="text-center text-base-content/60 py-8">
                Tidak ada pasien/IBK yang ditangani.
              </td>
            </tr>
          ) : (
            ibkList.map((ibk) => (
              <tr key={ibk.id}>
                <td>{ibk.id}</td>
                <td>{ibk.name}</td>
                <td>{ibk.last_session}</td>
                <td>
                  {onViewHistory$ && (
                    <button
                      class="btn btn-sm btn-ghost"
                      onClick$={() => onViewHistory$(ibk.id)}
                    >
                      Lihat Riwayat
                    </button>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
});
