/**
 * Detects whether a URL segment looks like a UUID or database ID
 * (i.e. not a human-readable route name).
 */
export const isIdSegment = (segment: string): boolean => {
  // Standard UUID v4: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
  if (
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
      segment,
    )
  )
    return true;
  // Short or numeric IDs (pure digits, or long hex/alphanum strings)
  if (/^\d+$/.test(segment) && segment.length > 3) return true;
  if (/^[0-9a-f]{16,}$/i.test(segment)) return true;
  return false;
};

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
    case "laporan-asesmen":
      return "Laporan Asesmen";
    case "ibk":
      return "Pendataan IBK";
    case "lowongan":
      return "Lowongan";
    case "informasi":
      return "Informasi";
    case "settings":
      return "Pengaturan";
    case "jadwal":
      return "Jadwal";
    case "monitoring":
      return "Monitoring";
    case "presensi":
      return "Presensi";
    case "create":
      return "Tambah Baru";
    case "edit":
      return "Edit";
    case "profile":
      return "Profil";
    case "faq":
      return "FAQ";
    case "jadwal-posyandu":
      return "Jadwal Posyandu";
    case "jadwal-kegiatan":
      return "Jadwal Kegiatan";
    default:
      return (
        segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " ")
      );
  }
};
