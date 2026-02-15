import { component$ } from "@builder.io/qwik";
import type { DistribusiItem } from "~/types/statistik-laporan";

/**
 * Color palette for donut segments — hex values for SVG stroke.
 * Matches the semantic colors from DaisyUI/Tailwind.
 */
const DONUT_COLORS = [
  "#6419E6", // primary
  "#D926A9", // secondary
  "#1FB2A6", // accent
  "#3ABFF8", // info
  "#36D399", // success
  "#FBBD23", // warning
  "#F87272", // error
  "#8B5CF6", // purple
  "#F472B6", // pink
  "#34D399", // emerald
  "#60A5FA", // blue
  "#FBBF24", // amber
];

const CIRCUMFERENCE = 2 * Math.PI * 40; // r = 40

interface DonutSegment {
  label: string;
  jumlah: number;
  color: string;
  percentage: number;
  dashArray: string;
  dashOffset: number;
}

/**
 * Compute SVG circle segments from data items.
 * All helper logic at module scope for Qwik serialization safety.
 */
function computeSegments(data: DistribusiItem[]): DonutSegment[] {
  const total = data.reduce((sum, item) => sum + item.jumlah, 0);
  if (total === 0) return [];

  const sorted = [...data].sort((a, b) => b.jumlah - a.jumlah);
  const segments: DonutSegment[] = [];
  let cumulativeOffset = 0;

  for (let i = 0; i < sorted.length; i++) {
    const item = sorted[i];
    const pct = (item.jumlah / total) * 100;
    const segLen = (pct / 100) * CIRCUMFERENCE;

    segments.push({
      label: item.label,
      jumlah: item.jumlah,
      color: DONUT_COLORS[i % DONUT_COLORS.length],
      percentage: Math.round(pct * 10) / 10,
      dashArray: `${segLen} ${CIRCUMFERENCE - segLen}`,
      dashOffset: -cumulativeOffset,
    });

    cumulativeOffset += segLen;
  }

  return segments;
}

interface DashboardDonutChartProps {
  title: string;
  data: DistribusiItem[];
  emptyMessage?: string;
  /** Optional center label (e.g. "Total") */
  centerLabel?: string;
}

export const DashboardDonutChart = component$<DashboardDonutChartProps>(
  (props) => {
    const { title, data, emptyMessage, centerLabel } = props;
    const total = data.reduce((sum, item) => sum + item.jumlah, 0);
    const segments = computeSegments(data);

    return (
      <div class="card bg-base-100 shadow-md border border-base-200/50 flex flex-col h-full">
        <div class="card-body p-5 flex flex-col min-h-0">
          {/* Pinned header */}
          <h3 class="font-semibold text-base text-base-content/90 mb-3 shrink-0">
            {title}
          </h3>

          {segments.length === 0 ? (
            <div class="flex items-center justify-center flex-1 min-h-[8rem] text-base-content/40 text-sm">
              {emptyMessage || "Belum ada data"}
            </div>
          ) : (
            <div class="flex flex-col sm:flex-row items-center gap-4 flex-1 min-h-0">
              {/* SVG Donut */}
              <div
                class="relative shrink-0"
                style={{ width: "140px", height: "140px" }}
              >
                <svg viewBox="0 0 100 100" class="w-full h-full -rotate-90">
                  {/* Background circle */}
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="oklch(var(--b3))"
                    stroke-width="14"
                  />
                  {/* Data segments */}
                  {segments.map((seg, idx) => (
                    <circle
                      key={`seg-${idx}`}
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke={seg.color}
                      stroke-width="14"
                      stroke-dasharray={seg.dashArray}
                      stroke-dashoffset={seg.dashOffset}
                      stroke-linecap="butt"
                      class="transition-all duration-500"
                    />
                  ))}
                </svg>
                {/* Center text */}
                <div class="absolute inset-0 flex flex-col items-center justify-center">
                  <span class="text-xl font-bold text-base-content/90 tabular-nums leading-none">
                    {total}
                  </span>
                  <span class="text-[10px] text-base-content/50 font-medium mt-0.5">
                    {centerLabel || "Total"}
                  </span>
                </div>
              </div>

              {/* Legend — scrollable when items overflow */}
              <div class="flex-1 min-w-0 min-h-0 space-y-1.5 max-h-[160px] overflow-y-auto overscroll-contain pr-1">
                {segments.map((seg, idx) => (
                  <div
                    key={`legend-${idx}`}
                    class="flex items-center gap-2 text-sm"
                  >
                    <span
                      class="inline-block w-2.5 h-2.5 rounded-sm shrink-0"
                      style={{ backgroundColor: seg.color }}
                    ></span>
                    <span class="truncate text-base-content/70 flex-1 min-w-0">
                      {seg.label}
                    </span>
                    <span class="text-xs font-medium text-base-content/60 tabular-nums whitespace-nowrap">
                      {seg.jumlah} ({seg.percentage}%)
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  },
);
