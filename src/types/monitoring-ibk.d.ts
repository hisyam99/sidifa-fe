// ========== Monitoring IBK Types ==========

export interface MonitoringIBKBase {
  ibk_id: string;
  jadwal_posyandu_id: string;
  keluhan: string;
  perilaku_baru: string;
  tindak_lanjut: string;
  fungsional_checklist: string;
  tanggal_kunjungan: string; // ISO-8601
  kecamatan: string;
  keterangan?: string;
}

export type MonitoringIBKCreateRequest = MonitoringIBKBase;

export type MonitoringIBKUpdateRequest = Partial<
  Omit<MonitoringIBKBase, "ibk_id">
>;

export interface MonitoringIBKItem extends MonitoringIBKBase {
  id: string;
  created_at: string;
  updated_at: string | null;
  deleted_at?: string | null;
  ibk?: {
    id: string;
    nama: string;
    nik: number | string;
    jenis_kelamin: string;
    alamat: string;
  };
  jadwal_posyandu?: {
    id: string;
    nama_kegiatan: string;
    tanggal: string;
    waktu_mulai: string;
    waktu_selesai: string;
    lokasi: string;
  };
}

export interface MonitoringIBKListResponse {
  data: MonitoringIBKItem[];
  meta?: {
    currentPage: number;
    limit: number;
    totalData: number;
    totalPage: number;
  };
}

export interface MonitoringIBKDetailResponse {
  data: MonitoringIBKItem;
}
