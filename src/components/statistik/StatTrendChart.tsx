import { component$ } from "@builder.io/qwik";
import type { TrendBulananItem } from "~/types/statistik-laporan";

interface StatTrendChartProps {
  title: string;
  data: TrendBulananItem[];
  barColor?: string;
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

/** Minimum width per bar column in px when horizontal scrolling kicks in */
const MIN_BAR_WIDTH = 40;
const SCROLL_THRESHOLD = 12;

export const StatTrendChart = component$<StatTrendChartProps>((props) => {
  const { title, data, barColor, emptyMessage } = props;
  const color = barColor || "bg-primary";
  const maxVal = Math.max(...data.map((d) => d.jumlah), 1);
  const totalAll = data.reduce((sum, d) => sum + d.jumlah, 0);
  const needsScroll = data.length > SCROLL_THRESHOLD;
  const chartMinWidth = needsScroll
    ? `${data.length * MIN_BAR_WIDTH}px`
    : undefined;

  return (
    <div class="card bg-base-100 shadow-md border border-base-200/50 flex flex-col h-full">
      <div class="card-body p-5 flex flex-col min-h-0">
        {/* Pinned header */}
        <div class="flex items-center justify-between mb-4 shrink-0">
          <h3 class="font-semibold text-base text-base-content/90">{title}</h3>
          {data.length > 0 && (
            <span class="badge badge-ghost badge-sm tabular-nums">
              Total: {totalAll}
            </span>
          )}
        </div>

        {data.length === 0 ? (
          <div class="flex items-center justify-center flex-1 min-h-[10rem] text-base-content/40 text-sm">
            {emptyMessage || "Belum ada data trend"}
          </div>
        ) : (
          /* Scrollable chart area */
          <div class="flex-1 min-h-0 overflow-x-auto overscroll-x-contain">
            <div
              class="relative"
              style={chartMinWidth ? { minWidth: chartMinWidth } : undefined}
            >
              {/* Y-axis guide lines */}
              <div class="absolute inset-0 flex flex-col justify-between pointer-events-none">
                {[0, 1, 2, 3].map((i) => (
                  <div
                    key={`guide-${i}`}
                    class="border-b border-base-200/40 w-full"
                  ></div>
                ))}
              </div>

              {/* Bars container */}
              <div
                class="relative flex items-end gap-1 sm:gap-1.5 md:gap-2"
                style={{ height: "180px" }}
              >
                {data.map((item, idx) => {
                  const heightPct =
                    maxVal > 0 ? Math.max((item.jumlah / maxVal) * 100, 2) : 2;

                  return (
                    <div
                      key={`bar-${idx}`}
                      class="flex-1 flex flex-col items-center justify-end group relative min-w-0"
                      style={{ height: "100%" }}
                    >
                      {/* Tooltip on hover */}
                      <div class="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10 pointer-events-none">
                        <div class="bg-base-content text-base-100 text-[10px] px-2 py-1 rounded-md shadow-lg whitespace-nowrap font-medium">
                          {formatFullMonthLabel(item.bulan)}: {item.jumlah}
                        </div>
                      </div>

                      {/* Value label on top of bar */}
                      {item.jumlah > 0 && (
                        <span class="text-[10px] font-semibold text-base-content/60 mb-0.5 tabular-nums leading-none">
                          {item.jumlah}
                        </span>
                      )}

                      {/* The bar */}
                      <div
                        class={`w-full rounded-t-sm transition-all duration-500 ${color} opacity-80 group-hover:opacity-100 min-w-1.5 max-w-12`}
                        style={{ height: `${heightPct}%` }}
                      ></div>
                    </div>
                  );
                })}
              </div>

              {/* X-axis labels */}
              <div class="flex gap-1 sm:gap-1.5 md:gap-2 mt-1.5 border-t border-base-200/60 pt-1.5">
                {data.map((item, idx) => (
                  <div key={`label-${idx}`} class="flex-1 text-center min-w-0">
                    <span class="text-[9px] sm:text-[10px] text-base-content/50 font-medium truncate block">
                      {formatMonthLabel(item.bulan)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
});
