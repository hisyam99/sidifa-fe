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
      {/* Desktop table */}
      <div class="hidden md:block overflow-x-auto">
        <div class="max-h-[60vh] overflow-y-auto rounded-lg">
          <table class="table w-full table-pin-rows">
            <thead>
              <tr class="bg-base-200">
                <th class="bg-base-200">ID Pasien</th>
                <th class="bg-base-200">Nama</th>
                <th class="bg-base-200">Sesi Terakhir</th>
                <th class="bg-base-200">Aksi</th>
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
      </div>

      {/* Mobile card list */}
      <div class="md:hidden space-y-3">
        {ibkList.length === 0 ? (
          <div class="text-center text-base-content/60 py-8">
            Tidak ada pasien/IBK yang ditangani.
          </div>
        ) : (
          ibkList.map((ibk) => (
            <div
              key={ibk.id}
              class="card bg-base-100 border border-base-200 shadow-sm"
            >
              <div class="card-body p-4">
                <div class="font-semibold">{ibk.name}</div>
                <div class="text-sm opacity-80">ID: {ibk.id}</div>
                <div class="text-sm mt-1">
                  Sesi Terakhir: {ibk.last_session}
                </div>
                <div class="mt-3">
                  {onViewHistory$ && (
                    <button
                      class="btn btn-ghost btn-xs"
                      onClick$={() => onViewHistory$(ibk.id)}
                    >
                      Lihat Riwayat
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
});
