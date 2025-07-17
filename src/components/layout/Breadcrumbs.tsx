import { component$ } from "@builder.io/qwik";
import { useLocation } from "@builder.io/qwik-city";

export const Breadcrumbs = component$(() => {
  const location = useLocation();
  const path = location.url.pathname;
  const segments = path.split("/").filter(Boolean);

  // Map for pretty names if needed
  const pretty = (seg: string) => {
    switch (seg) {
      case "kader":
        return "Kader";
      case "admin":
        return "Admin";
      case "psikolog":
        return "Psikolog";
      case "dashboard":
        return "Dashboard";
      case "posyandu":
        return "Posyandu";
      case "detail":
        return "Detail";
      case "laporan-statistik":
        return "Laporan Statistik";
      case "pendataan-ibk":
        return "Pendataan IBK";
      case "lowongan":
        return "Lowongan";
      case "informasi":
        return "Informasi";
      default:
        return seg.charAt(0).toUpperCase() + seg.slice(1).replace(/-/g, " ");
    }
  };

  let href = "";

  return (
    <div class="mb-4">
      <div class="breadcrumbs text-sm">
        <ul>
          <li>
            <a href="/">Home</a>
          </li>
          {segments.map((seg, idx) => {
            href += "/" + seg;
            const isLast = idx === segments.length - 1;
            // Jangan link untuk segmen 'detail' dan segmen setelahnya (biasanya ID)
            const isDetailOrAfter =
              segments[idx - 1] === "detail" || seg === "detail";
            if (isLast) {
              return (
                <li key={seg} class="font-semibold text-primary">
                  {pretty(seg)}
                </li>
              );
            }
            if (isDetailOrAfter) {
              return <li key={seg}>{pretty(seg)}</li>;
            }
            return (
              <li key={seg}>
                <a href={href}>{pretty(seg)}</a>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
});
