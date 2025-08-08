export interface LowonganItem {
  id: string;
  nama_lowongan: string;
  nama_perusahaan: string;
  jenis_pekerjaan: string;
  lokasi: string;
  jenis_difasilitas: string;
  deskripsi: string;
  status: "aktif" | "nonaktif" | string;
  file_url?: string;
  file_name?: string;
  tanggal_mulai?: string; // ISO-8601
  tanggal_selesai?: string; // ISO-8601
  created_at?: string;
  updated_at?: string | null;
}

export interface LowonganFilterOptions {
  nama_lowongan?: string;
  nama_perusahaan?: string;
  jenis_pekerjaan?: string;
  lokasi?: string;
  jenis_difasilitas?: string;
  status?: string;
}

export interface LowonganCreateRequest {
  nama_lowongan: string;
  nama_perusahaan: string;
  jenis_pekerjaan: string;
  lokasi: string;
  jenis_difasilitas: string;
  deskripsi: string;
  status: string;
  tanggal_mulai?: string; // ISO-8601
  tanggal_selesai?: string; // ISO-8601
  file?: File | string;
}

export interface LowonganUpdateRequest extends Partial<LowonganCreateRequest> {
  id: string;
}

export interface LowonganListResponse {
  data: LowonganItem[];
  meta?: {
    totalData?: number;
    totalPage?: number;
    currentPage?: number;
    limit?: number;
    total?: number;
    page?: number;
  };
}

export interface LowonganDetailResponse {
  data?: LowonganItem;
}
