import api from "./api";

// ===========================
// Admin Dashboard Service
// ===========================

export interface AdminDashboardStats {
  totalPosyandu: number;
  totalKader: number;
  totalIbk: number;
  kaderNeedVerification: number;
}

export interface AdminDashboardStatsResponse {
  data: AdminDashboardStats;
}

export interface JadwalKegiatanItem {
  id: string;
  posyandu_id: string;
  nama_kegiatan: string;
  jenis_kegiatan: string;
  deskripsi: string;
  file_name: string | null;
  lokasi: string;
  tanggal: string;
  waktu_mulai: string;
  waktu_selesai: string;
  created_at: string;
  updated_at: string | null;
  deleted_at: string | null;
  posyandu: {
    id: string;
    nama_posyandu: string;
    alamat: string;
  };
}

export interface JadwalKegiatanResponse {
  data: JadwalKegiatanItem[];
  meta: {
    totalData: number;
    totalPage: number;
    currentPage: number;
    limit: number;
  };
}

export const adminDashboardService = {
  async getStats(): Promise<AdminDashboardStats> {
    const response = await api.get<AdminDashboardStatsResponse>(
      "/admin/dashboard/stats",
    );
    return response.data.data;
  },

  async getJadwalKegiatan(params?: {
    page?: number;
    limit?: number;
  }): Promise<JadwalKegiatanResponse> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.limit) queryParams.append("limit", params.limit.toString());

    const queryString = queryParams.toString();
    const url = queryString
      ? `/admin/dashboard/jadwal-kegiatan?${queryString}`
      : "/admin/dashboard/jadwal-kegiatan";

    const response = await api.get<JadwalKegiatanResponse>(url);
    return response.data;
  },
};

// ===========================
// Kader Dashboard Service
// ===========================

export interface KaderDashboardStats {
  totalAnggota: number;
  totalIbk: number;
  kunjunganBulanIni: number;
}

export interface KaderDashboardStatsResponse {
  data: KaderDashboardStats;
}

export const kaderDashboardService = {
  async getStats(): Promise<KaderDashboardStats> {
    const response = await api.get<KaderDashboardStatsResponse>(
      "/kader/dashboard/stats",
    );
    return response.data.data;
  },

  async getStatsByPosyandu(posyanduId: string): Promise<KaderDashboardStats> {
    const response = await api.get<KaderDashboardStatsResponse>(
      `/kader/dashboard/stats?posyandu_id=${posyanduId}`,
    );
    return response.data.data;
  },
};
