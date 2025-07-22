export interface AdminPsikologItem {
  id: string;
  nama: string;
  email: string;
  no_telp: string;
  spesialisasi: string;
  status: "Aktif" | "Tidak Aktif";
  // Add other relevant properties
}

export interface AdminPsikologFilterOptions {
  nama?: string;
  spesialisasi?: string;
  status?: "Aktif" | "Tidak Aktif" | "";
  // Add other filter options
}
