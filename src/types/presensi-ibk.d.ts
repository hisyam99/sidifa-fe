// ========== Presensi IBK Types ==========

export type PresensiStatus = "BELUM_HADIR" | "HADIR" | "SAKIT" | "IZIN";

export interface PresensiIBKBase {
  user_ibk_id: string;
  jadwal_id: string;
  status_presensi?: PresensiStatus;
}

export interface PresensiIBKItem extends PresensiIBKBase {
  id: string;
  created_at: string;
  updated_at: string | null;
  deleted_at?: string | null;
  // Add ibk_id as fallback when ibk object is not available
  ibk_id?: string;
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

export interface PresensiIBKListResponse {
  data: PresensiIBKItem[];
  meta?: {
    currentPage: number;
    limit: number;
    totalData: number;
    totalPage: number;
  };
}

export interface PresensiIBKDetailResponse {
  data: PresensiIBKItem;
}
