// ========== Jadwal Posyandu Types ==========

export interface JadwalPosyanduBase {
  posyandu_id: string;
  nama_kegiatan: string;
  jenis_kegiatan: string;
  deskripsi: string;
  lokasi: string;
  tanggal: string; // ISO-8601
  waktu_mulai: string; // HH:mm
  waktu_selesai: string; // HH:mm
}

export interface JadwalPosyanduCreateRequest extends JadwalPosyanduBase {
  file_name?: File | string; // File (upload) or string (existing)
}

export interface JadwalPosyanduUpdateRequest
  extends Partial<JadwalPosyanduBase> {
  file_name?: File | string;
}

export interface JadwalPosyanduItem extends JadwalPosyanduBase {
  id: string;
  file_name?: string;
  file_url?: string; // generated in FE for convenience
  created_at: string;
  updated_at: string;
  posyandu?: {
    id: string;
    nama_posyandu: string;
    alamat: string;
  };
}

export interface JadwalPosyanduListResponse {
  data: JadwalPosyanduItem[];
  total: number;
  page: number;
  limit: number;
}

export interface JadwalPosyanduDetailResponse {
  data: JadwalPosyanduItem;
}
