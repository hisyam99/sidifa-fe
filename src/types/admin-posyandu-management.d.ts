export interface AdminPosyanduItem {
  id: string;
  nama_posyandu: string;
  alamat: string;
  no_telp: string;
  status: "Aktif" | "Tidak Aktif";
  users_id?: string;
  created_at?: string;
  updated_at?: string | null;
  deleted_at?: string | null;
}

export interface AdminPosyanduFilterOptions {
  nama_posyandu?: string;
  status?: "Aktif" | "Tidak Aktif" | "";
  // Add other filter options
}

// Reusing PaginationMeta from posyandu.d.ts if it's generic enough
// import { PaginationMeta } from "./posyandu";
