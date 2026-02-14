import { component$ } from "@builder.io/qwik";
import type { DistribusiItem } from "~/types/statistik-laporan";

// Predefined color palette for bars
const BAR_COLORS = [
  "bg-primary",
  "bg-secondary",
  "bg-accent",
  "bg-info",
  "bg-success",
  "bg-warning",
  "bg-error",
  "bg-primary/70",
  "bg-secondary/70",
  "bg-accent/70",
  "bg-info/70",
  "bg-success/70",
];

interface StatDistributionBarProps {
  title: string;
  data: DistribusiItem[];
  emptyMessage?: string;
}

export const StatDistributionBar = component$<StatDistributionBarProps>(
  (props) => {
    const { title, data, emptyMessage } = props;
    const total = data.reduce((sum, item) => sum + item.jumlah, 0);

    return (
      <div class="card bg-base-100 shadow-md border border-base-200/50">
        <div class="card-body p-5">
          <h3 class="font-semibold text-base text-base-content/90 mb-4">
            {title}
          </h3>

          {data.length === 0 || total === 0 ? (
            <div class="flex items-center justify-center h-32 text-base-content/40 text-sm">
              {emptyMessage || "Belum ada data"}
            </div>
          ) : (
            <div class="space-y-3">
              {data
                .sort((a, b) => b.jumlah - a.jumlah)
                .map((item, idx) => {
                  const pct =
                    total > 0
                      ? Math.round((item.jumlah / total) * 1000) / 10
                      : 0;
                  const colorClass = BAR_COLORS[idx % BAR_COLORS.length];

                  return (
                    <div key={`${item.label}-${idx}`}>
                      <div class="flex items-center justify-between mb-1">
                        <span class="text-sm text-base-content/80 truncate max-w-[60%]">
                          {item.label}
                        </span>
                        <span class="text-xs font-medium text-base-content/60 tabular-nums whitespace-nowrap ml-2">
                          {item.jumlah} ({pct}%)
                        </span>
                      </div>
                      <div class="w-full bg-base-200/80 rounded-full h-2.5 overflow-hidden">
                        <div
                          class={`h-full rounded-full transition-all duration-500 ${colorClass}`}
                          style={{ width: `${Math.max(pct, 1)}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}

              {/* Total footer */}
              <div class="pt-2 mt-1 border-t border-base-200/60 flex items-center justify-between">
                <span class="text-xs font-medium text-base-content/50">
                  Total
                </span>
                <span class="text-xs font-bold text-base-content/70 tabular-nums">
                  {total}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  },
);
