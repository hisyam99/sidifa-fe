import { component$, QRL } from "@qwik.dev/core";
import type { AssessmentReportItem } from "~/data/assessment-report-data";

interface AssessmentReportHistoryTableProps {
  history: AssessmentReportItem[];
  onViewDetail$?: QRL<(id: string) => void>;
}

export const AssessmentReportHistoryTable = component$(
  (props: AssessmentReportHistoryTableProps) => {
    const { history, onViewDetail$ } = props;
    return (
      <div class="card bg-base-100 shadow-xl p-6">
        <h2 class="card-title text-xl font-bold mb-4">Riwayat Laporan</h2>
        <div class="overflow-x-auto">
          {/* Desktop table */}
          <div class="hidden md:block overflow-x-auto">
            <div class="max-h-[60vh] overflow-y-auto rounded-lg">
              <table class="table w-full table-pin-rows">
                <thead>
                  <tr class="bg-base-200">
                    <th class="bg-base-200">ID Laporan</th>
                    <th class="bg-base-200">Nama Pasien</th>
                    <th class="bg-base-200">Tanggal</th>
                    <th class="bg-base-200">Status</th>
                    <th class="bg-base-200">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {history.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        class="text-center text-base-content/60 py-8"
                      >
                        Belum ada riwayat laporan asesmen.
                      </td>
                    </tr>
                  ) : (
                    history.map((item) => (
                      <tr key={item.id}>
                        <td>{item.id}</td>
                        <td>{item.patient}</td>
                        <td>{item.date}</td>
                        <td>
                          <span class="badge badge-success">{item.status}</span>
                        </td>
                        <td>
                          {onViewDetail$ && (
                            <button
                              class="btn btn-sm btn-ghost"
                              onClick$={() => onViewDetail$(item.id)}
                            >
                              Lihat Detail
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
            {history.length === 0 ? (
              <div class="text-center text-base-content/60 py-8">
                Belum ada riwayat laporan asesmen.
              </div>
            ) : (
              history.map((item) => (
                <div
                  key={item.id}
                  class="card bg-base-100 border border-base-200 shadow-sm"
                >
                  <div class="card-body p-4">
                    <div class="font-semibold">{item.patient}</div>
                    <div class="text-sm opacity-80">ID: {item.id}</div>
                    <div class="text-sm mt-1">Tanggal: {item.date}</div>
                    <div class="mt-2">
                      <span class="badge badge-success">{item.status}</span>
                    </div>
                    <div class="mt-3">
                      <div class="join">
                        {onViewDetail$ && (
                          <button
                            class="btn btn-ghost btn-xs join-item"
                            onClick$={() => onViewDetail$(item.id)}
                          >
                            Lihat Detail
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
      </div>
    );
  },
);
