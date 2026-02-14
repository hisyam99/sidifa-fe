import { component$ } from "@builder.io/qwik";
import type { TrendKehadiranBulananItem } from "~/types/statistik-laporan";

interface StatKehadiranTrendProps {
  title: string;
  data: TrendKehadiranBulananItem[];
  emptyMessage?: string;
}

/**
 * Format "YYYY-MM" → "Jan", "Feb", etc.
 */
function formatMonthLabel(bulan: string): string {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "Mei",
    "Jun",
    "Jul",
    "Agu",
    "Sep",
    "Okt",
    "Nov",
    "Des",
  ];
  const parts = bulan.split("-");
  const monthIdx = parseInt(parts[1], 10) - 1;
  return months[monthIdx] ?? bulan;
}

function formatFullMonthLabel(bulan: string): string {
  const months = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];
  const parts = bulan.split("-");
  const monthIdx = parseInt(parts[1], 10) - 1;
  const year = parts[0];
  return `${months[monthIdx] ?? bulan} ${year}`;
}

export const StatKehadiranTrend = component$<StatKehadiranTrendProps>(
  (props) => {
    const { title, data, emptyMessage } = props;
    const maxVal = Math.max(...data.map((d) => d.total), 1);
    const totalHadir = data.reduce((sum, d) => sum + d.hadir, 0);
    const totalTidakHadir = data.reduce((sum, d) => sum + d.tidakHadir, 0);
    const totalAll = totalHadir + totalTidakHadir;
    const avgPersentase =
      data.length > 0
        ? Math.round(
            (data.reduce((sum, d) => sum + d.persentase, 0) / data.length) * 10,
          ) / 10
        : 0;

    return (
      <div class="card bg-base-100 shadow-md border border-base-200/50">
        <div class="card-body p-5">
          {/* Header */}
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
            <h3 class="font-semibold text-base text-base-content/90">
              {title}
            </h3>
            {data.length > 0 && (
              <div class="flex items-center gap-3 flex-wrap">
                <div class="flex items-center gap-1.5">
                  <span class="inline-block w-2.5 h-2.5 rounded-sm bg-success"></span>
                  <span class="text-xs text-base-content/60">
                    Hadir ({totalHadir})
                  </span>
                </div>
                <div class="flex items-center gap-1.5">
                  <span class="inline-block w-2.5 h-2.5 rounded-sm bg-error/60"></span>
                  <span class="text-xs text-base-content/60">
                    Tidak Hadir ({totalTidakHadir})
                  </span>
                </div>
                <span class="badge badge-ghost badge-sm tabular-nums">
                  Rata-rata: {avgPersentase}%
                </span>
              </div>
            )}
          </div>

          {data.length === 0 ? (
            <div class="flex items-center justify-center h-40 text-base-content/40 text-sm">
              {emptyMessage || "Belum ada data kehadiran"}
            </div>
          ) : (
            <>
              {/* Chart area */}
              <div class="relative">
                {/* Y-axis guide lines */}
                <div class="absolute inset-0 flex flex-col justify-between pointer-events-none">
                  {[0, 1, 2, 3].map((i) => (
                    <div
                      key={`guide-${i}`}
                      class="border-b border-base-200/40 w-full"
                    ></div>
                  ))}
                </div>

                {/* Stacked bars container */}
                <div
                  class="relative flex items-end gap-1 sm:gap-1.5 md:gap-2"
                  style={{ height: "200px" }}
                >
                  {data.map((item, idx) => {
                    const totalPct =
                      maxVal > 0 ? Math.max((item.total / maxVal) * 100, 3) : 3;
                    const hadirRatio =
                      item.total > 0 ? (item.hadir / item.total) * 100 : 0;
                    const tidakHadirRatio =
                      item.total > 0 ? (item.tidakHadir / item.total) * 100 : 0;

                    return (
                      <div
                        key={`bar-${idx}`}
                        class="flex-1 flex flex-col items-center justify-end group relative min-w-0"
                        style={{ height: "100%" }}
                      >
                        {/* Tooltip on hover */}
                        <div class="absolute -top-12 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10 pointer-events-none">
                          <div class="bg-base-content text-base-100 text-[10px] px-2.5 py-1.5 rounded-md shadow-lg whitespace-nowrap font-medium leading-relaxed">
                            <div class="font-semibold mb-0.5">
                              {formatFullMonthLabel(item.bulan)}
                            </div>
                            <div>
                              Hadir: {item.hadir} · Tidak: {item.tidakHadir}
                            </div>
                            <div>Kehadiran: {item.persentase}%</div>
                          </div>
                        </div>

                        {/* Percentage label */}
                        {item.total > 0 && (
                          <span class="text-[9px] sm:text-[10px] font-semibold text-base-content/60 mb-0.5 tabular-nums leading-none">
                            {item.persentase}%
                          </span>
                        )}

                        {/* Stacked bar */}
                        <div
                          class="w-full rounded-t-sm overflow-hidden flex flex-col-reverse min-w-1.5 max-w-12 transition-all duration-500"
                          style={{ height: `${totalPct}%` }}
                        >
                          {/* Hadir (bottom — green) */}
                          <div
                            class="w-full bg-success transition-all duration-500 group-hover:brightness-110"
                            style={{ height: `${hadirRatio}%` }}
                          ></div>
                          {/* Tidak hadir (top — red) */}
                          <div
                            class="w-full bg-error/60 transition-all duration-500 group-hover:brightness-110"
                            style={{ height: `${tidakHadirRatio}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* X-axis labels */}
                <div class="flex gap-1 sm:gap-1.5 md:gap-2 mt-1.5 border-t border-base-200/60 pt-1.5">
                  {data.map((item, idx) => (
                    <div
                      key={`label-${idx}`}
                      class="flex-1 text-center min-w-0"
                    >
                      <span class="text-[9px] sm:text-[10px] text-base-content/50 font-medium truncate block">
                        {formatMonthLabel(item.bulan)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Summary footer */}
              <div class="mt-4 pt-3 border-t border-base-200/60 grid grid-cols-3 gap-3 text-center">
                <div>
                  <div class="text-lg font-bold text-success tabular-nums">
                    {totalHadir}
                  </div>
                  <div class="text-[10px] text-base-content/50 font-medium uppercase tracking-wider">
                    Total Hadir
                  </div>
                </div>
                <div>
                  <div class="text-lg font-bold text-error/80 tabular-nums">
                    {totalTidakHadir}
                  </div>
                  <div class="text-[10px] text-base-content/50 font-medium uppercase tracking-wider">
                    Tidak Hadir
                  </div>
                </div>
                <div>
                  <div class="text-lg font-bold text-base-content/80 tabular-nums">
                    {totalAll}
                  </div>
                  <div class="text-[10px] text-base-content/50 font-medium uppercase tracking-wider">
                    Total Presensi
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    );
  },
);
