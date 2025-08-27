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
    <div class="group relative overflow-hidden rounded-2xl border border-white/30 bg-white/10 p-6 backdrop-blur-xl shadow-[0_8px_24px_rgba(0,0,0,0.08)] transition-all duration-300">
      {/* subtle glass gradient edge */}
      <div class="pointer-events-none absolute inset-px rounded-[1rem] bg-gradient-to-br from-white/25 via-white/10 to-transparent opacity-70"></div>

      <div class="relative z-[1]">
        <header class="mb-4">
          <h2 class="text-lg font-semibold text-base-content/80">
            Total Pengguna
          </h2>
          <p class="text-sm text-base-content/60">
            Perbandingan kategori pengguna aktif
          </p>
        </header>

        <div class="mb-4">
          <div class="text-3xl font-extrabold text-base-content/90">
            {(ibkCount + kaderCount + psikologCount).toLocaleString()}
          </div>
          <p class="text-xs text-base-content/60">Total pengguna keseluruhan</p>
        </div>

        <div ref={chartRef} class="w-full"></div>
      </div>

      {/* animated accent blur blob */}
      <div class="pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full bg-primary/20 blur-2xl transition-opacity duration-300 opacity-0 group-hover:opacity-100"></div>
    </div>
  );
});
