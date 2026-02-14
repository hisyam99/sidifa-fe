import { component$ } from "@builder.io/qwik";

interface UserCategoryData {
  category: string;
  count: number;
  colorBar: string;
  colorText: string;
  colorBadge: string;
}

interface AdminUserChartProps {
  ibkCount: number;
  kaderCount: number;
  psikologCount: number;
}

export const AdminUserChart = component$<AdminUserChartProps>((props) => {
  const { ibkCount, kaderCount, psikologCount } = props;
  const total = ibkCount + kaderCount + psikologCount;

  const data: UserCategoryData[] = [
    {
      category: "IBK",
      count: ibkCount,
      colorBar: "bg-primary",
      colorText: "text-primary",
      colorBadge: "bg-primary/15",
    },
    {
      category: "Kader",
      count: kaderCount,
      colorBar: "bg-success",
      colorText: "text-success",
      colorBadge: "bg-success/15",
    },
    {
      category: "Psikolog",
      count: psikologCount,
      colorBar: "bg-warning",
      colorText: "text-warning",
      colorBadge: "bg-warning/15",
    },
  ];

  const maxVal = Math.max(...data.map((d) => d.count), 1);

  return (
    <div class="relative overflow-hidden rounded-2xl border border-base-300/50 bg-base-100 shadow-sm transition-all duration-300 h-full flex flex-col">
      {/* Subtle top accent line */}
      <div class="pointer-events-none absolute inset-x-0 top-0 h-0.5 bg-linear-to-r from-primary/40 via-primary/20 to-transparent"></div>

      <div class="px-5 pt-5 pb-3">
        <div class="flex items-start justify-between gap-4">
          <div class="min-w-0">
            <h2 class="text-sm font-semibold text-base-content tracking-tight">
              Total Pengguna
            </h2>
            <p class="text-xs text-base-content/50 mt-0.5">
              Perbandingan kategori pengguna aktif
            </p>
          </div>
          <span class="inline-flex items-center rounded-lg bg-base-200/80 px-2.5 py-1 text-xs font-medium text-base-content/60 tabular-nums">
            {total.toLocaleString()} total
          </span>
        </div>

        <div class="mt-3">
          <div class="text-3xl font-extrabold text-base-content tracking-tight tabular-nums">
            {total.toLocaleString()}
          </div>
          <p class="text-xs text-base-content/50 mt-0.5">
            Total pengguna keseluruhan
          </p>
        </div>
      </div>

      <div class="flex-1 px-5 pb-5">
        {/* Stacked overview bar */}
        {total > 0 && (
          <div class="w-full h-3 rounded-full overflow-hidden flex bg-base-200/60 mb-5">
            {data.map((item, idx) => {
              const pct = total > 0 ? (item.count / total) * 100 : 0;
              if (pct === 0) return null;
              return (
                <div
                  key={`stack-${idx}`}
                  class={`h-full transition-all duration-500 ${item.colorBar} ${idx === 0 ? "rounded-l-full" : ""} ${idx === data.length - 1 ? "rounded-r-full" : ""}`}
                  style={{ width: `${Math.max(pct, 2)}%` }}
                ></div>
              );
            })}
          </div>
        )}

        {/* Vertical bar chart */}
        <div
          class="flex items-end gap-3 sm:gap-4 md:gap-6 justify-center"
          style={{ height: "140px" }}
        >
          {data.map((item, idx) => {
            const heightPct =
              maxVal > 0 ? Math.max((item.count / maxVal) * 100, 4) : 4;
            const pctOfTotal =
              total > 0 ? Math.round((item.count / total) * 1000) / 10 : 0;

            return (
              <div
                key={`bar-${idx}`}
                class="flex flex-col items-center justify-end group flex-1 max-w-[100px]"
                style={{ height: "100%" }}
              >
                {/* Value label */}
                <span
                  class={`text-sm font-bold tabular-nums mb-1.5 ${item.colorText}`}
                >
                  {item.count.toLocaleString()}
                </span>

                {/* Bar */}
                <div
                  class={`w-full rounded-t-lg transition-all duration-500 ${item.colorBar} opacity-80 group-hover:opacity-100 min-w-[32px]`}
                  style={{ height: `${heightPct}%` }}
                ></div>

                {/* Category label */}
                <div class="mt-2.5 text-center">
                  <span class="text-xs font-semibold text-base-content/80 block">
                    {item.category}
                  </span>
                  <span
                    class={`inline-block mt-1 text-[10px] font-medium px-1.5 py-0.5 rounded-md ${item.colorBadge} ${item.colorText}`}
                  >
                    {pctOfTotal}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Legend row */}
        <div class="flex items-center justify-center gap-4 mt-4 pt-3 border-t border-base-200/60">
          {data.map((item, idx) => (
            <div key={`legend-${idx}`} class="flex items-center gap-1.5">
              <span
                class={`inline-block w-2.5 h-2.5 rounded-full ${item.colorBar}`}
              ></span>
              <span class="text-[11px] text-base-content/60 font-medium">
                {item.category}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});
