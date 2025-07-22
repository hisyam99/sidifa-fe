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
          <table class="table w-full">
            <thead>
              <tr>
                <th>ID Laporan</th>
                <th>Nama Pasien</th>
                <th>Tanggal</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {history.length === 0 ? (
                <tr>
                  <td colSpan={5} class="text-center text-base-content/60 py-8">
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
    );
  },
);
