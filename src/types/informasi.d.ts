export interface InformasiItem {
  id: string;
  judul: string;
  tipe: string;
  deskripsi: string;
  file_url?: string;
  // Add any other relevant fields from your API
}

export interface InformasiFilterOptions {
  judul?: string;
  deskripsi?: string;
  tipe?: string;
}
