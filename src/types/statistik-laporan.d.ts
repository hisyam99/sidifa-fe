// ========== Statistik Laporan Types ==========

export interface DistribusiItem {
  label: string;
  jumlah: number;
}

export interface RingkasanStatistik {
  totalIbk: number;
  totalKegiatan: number;
  totalMonitoring: number;
  totalKader: number;
  rataRataKehadiran: number;
}

export interface KesehatanOdgjStats {
  odgj: number;
  nonOdgj: number;
  tidakDiketahui: number;
}

export interface TrendBulananItem {
  bulan: string; // "YYYY-MM"
  jumlah: number;
}

export interface TrendKehadiranBulananItem {
  bulan: string; // "YYYY-MM"
  hadir: number;
  tidakHadir: number;
  total: number;
  persentase: number;
}

export interface StatistikLaporanData {
  ringkasan: RingkasanStatistik;
  demografiJenisKelamin: DistribusiItem[];
  demografiKelompokUmur: DistribusiItem[];
  demografiAgama: DistribusiItem[];
  demografiPendidikan: DistribusiItem[];
  demografiPekerjaan: DistribusiItem[];
  demografiStatusPerkawinan: DistribusiItem[];
  disabilitasJenis: DistribusiItem[];
  disabilitasTingkatKeparahan: DistribusiItem[];
  kesehatanOdgj: KesehatanOdgjStats;
  kesehatanJenisBantuan: DistribusiItem[];
  assesmenKategoriIq: DistribusiItem[];
  presensiDistribusi: DistribusiItem[];
  trendIbkBulanan: TrendBulananItem[];
  trendKegiatanBulanan: TrendBulananItem[];
  trendMonitoringBulanan: TrendBulananItem[];
  trendKehadiranBulanan: TrendKehadiranBulananItem[];
}

export interface StatistikLaporanResponse {
  data: StatistikLaporanData;
}

export type PeriodeFilter =
  | "semua"
  | "tahun_ini"
  | "6_bulan"
  | "3_bulan"
  | "bulan_ini";
