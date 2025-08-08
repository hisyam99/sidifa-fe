export interface InformasiItem {
  id: string;
  judul: string;
  tipe: string;
  deskripsi: string;
  file_url?: string;
  file_name?: string;
  // created_at, updated_at, etc. can be added if needed
}

export interface InformasiFilterOptions {
  judul?: string;
  deskripsi?: string;
  tipe?: string;
}
