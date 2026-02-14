import { component$, useSignal, useTask$ } from "@builder.io/qwik";
import * as d3 from "d3";

interface UserCategoryData {
  category: string;
  count: number;
  color: string;
}

interface AdminUserChartProps {
  ibkCount: number;
  kaderCount: number;
  psikologCount: number;
}

export const AdminUserChart = component$<AdminUserChartProps>((props) => {
  const chartRef = useSignal<HTMLDivElement>();
  const { ibkCount, kaderCount, psikologCount } = props;

  const data: UserCategoryData[] = [
    { category: "IBK", count: ibkCount, color: "hsl(220, 70%, 60%)" },
    { category: "Kader", count: kaderCount, color: "hsl(160, 70%, 50%)" },
    { category: "Psikolog", count: psikologCount, color: "hsl(30, 80%, 60%)" },
  ];

  useTask$(({ track }) => {
    track(() => chartRef.value);
    if (!chartRef.value) return;

    const container = chartRef.value;
    const width = container.clientWidth;
    const height = 200;
    const margin = { top: 20, right: 20, bottom: 40, left: 60 };

    // Clear previous chart
    container.innerHTML = "";

    const svg = d3
      .select(container)
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", `0 0 ${width} ${height}`)
      .style("max-width", "100%")
      .style("height", "auto");

    // Create scales with proper typing
    const xScale = d3
      .scaleBand()
      .domain(data.map((d) => d.category))
      .range([margin.left, width - margin.right])
      .padding(0.3);

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.count) || 0])
      .range([height - margin.bottom, margin.top]);

    // Add bars with proper event typing
    svg
      .selectAll<SVGRectElement, UserCategoryData>("rect")
      .data(data)
      .enter()
      .append("rect")
      .attr("x", (d) => xScale(d.category) || 0)
      .attr("y", (d) => yScale(d.count))
      .attr("width", xScale.bandwidth())
      .attr("height", (d) => height - margin.bottom - yScale(d.count))
      .attr("fill", (d) => d.color)
      .attr("rx", 6)
      .style("opacity", 0.8)
      .on("mouseover", function (this: SVGRectElement) {
        d3.select(this).style("opacity", 1);
      })
      .on("mouseout", function (this: SVGRectElement) {
        d3.select(this).style("opacity", 0.8);
      });

    // Add value labels on bars
    svg
      .selectAll<SVGTextElement, UserCategoryData>("text.value-label")
      .data(data)
      .enter()
      .append("text")
      .attr("class", "value-label")
      .attr(
        "x",
        (d) => (xScale(d.category) || 0) + (xScale.bandwidth() || 0) / 2,
      )
      .attr("y", (d) => yScale(d.count) - 10)
      .attr("text-anchor", "middle")
      .attr("fill", "currentColor")
      .style("font-size", "14px")
      .style("font-weight", "600")
      .text((d) => d.count.toLocaleString());

    // Add X axis
    const xAxis = d3.axisBottom(xScale);
    svg
      .append("g")
      .attr("transform", `translate(0, ${height - margin.bottom})`)
      .call(xAxis)
      .selectAll("text")
      .style("font-size", "12px")
      .attr("fill", "currentColor");

    // Add Y axis
    const yAxis = d3.axisLeft(yScale).ticks(5);
    svg
      .append("g")
      .attr("transform", `translate(${margin.left}, 0)`)
      .call(yAxis)
      .selectAll("text")
      .style("font-size", "12px")
      .attr("fill", "currentColor");

    // Add legend with proper typing
    const legend = svg.append("g").attr("class", "legend");
    const legendItems = legend
      .selectAll<SVGGElement, UserCategoryData>("g.legend-item")
      .data(data)
      .enter()
      .append("g")
      .attr("class", "legend-item")
      .attr(
        "transform",
        (d, i) =>
          `translate(${width - margin.right - 200 + i * 60}, ${margin.top})`,
      );

    legendItems
      .append("circle")
      .attr("r", 5)
      .attr("fill", (d) => d.color);

    legendItems
      .append("text")
      .attr("x", 10)
      .attr("y", 4)
      .attr("text-anchor", "start")
      .style("font-size", "12px")
      .attr("fill", "currentColor")
      .text((d) => d.category);
  });

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
            {(ibkCount + kaderCount + psikologCount).toLocaleString()} total
          </span>
        </div>

        <div class="mt-3">
          <div class="text-3xl font-extrabold text-base-content tracking-tight tabular-nums">
            {(ibkCount + kaderCount + psikologCount).toLocaleString()}
          </div>
          <p class="text-xs text-base-content/50 mt-0.5">
            Total pengguna keseluruhan
          </p>
        </div>
      </div>

      <div class="flex-1 px-5 pb-5">
        <div ref={chartRef} class="w-full"></div>
      </div>
    </div>
  );
});
