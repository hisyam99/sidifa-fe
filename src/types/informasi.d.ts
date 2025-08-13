export interface InformasiItem {
  id: string;
  judul: string;
  tipe: string;
  deskripsi: string;
  file_name?: string;
  created_at?: string;
  updated_at?: string | null;
}

export interface InformasiFilterOptions {
  [key: string]: unknown;
  deskripsi?: string;
  judul?: string;
  tipe?: string;
}
