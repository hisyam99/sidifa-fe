export const getPrettyBreadcrumbName = (segment: string): string => {
  switch (segment) {
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
    case "ibk":
      return "Pendataan IBK";
    case "lowongan":
      return "Lowongan";
    case "informasi":
      return "Informasi";
    case "settings":
      return "Pengaturan";
    default:
      return (
        segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " ")
      );
  }
};
