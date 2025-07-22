export interface PosyanduItem {
  id: string;
  nama_posyandu: string;
  alamat: string;
  no_telp: string;
  users_id?: string;
  created_at: string;
  updated_at: string | null;
  deleted_at: string | null;
  isRegistered?: boolean; // Indicates if the current kader is registered to this posyandu
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
