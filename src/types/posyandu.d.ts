export interface PosyanduItem {
  id: string;
  nama_posyandu: string;
  alamat: string;
  no_telp: string;
  // Tambahkan properti lain yang relevan dari API jika ada
}

export interface PosyanduDetail extends PosyanduItem {
  created_at: string;
  deleted_at: string | null;
  // Add any other detail-specific fields if necessary
}

export interface PaginationMeta {
  totalData: number;
  totalPage: number;
  currentPage: number;
  limit: number;
}

export interface PosyanduFilterOptions {
  nama_posyandu?: string;
  status?: "Aktif" | "Tidak Aktif" | "";
}

export interface PosyanduSortOptions {
  sortBy?: string;
}
