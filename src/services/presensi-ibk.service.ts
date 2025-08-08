import api from "./api";
import type {
  PresensiIBKListResponse,
  PresensiIBKDetailResponse,
  PresensiStatus,
} from "~/types";

export class PresensiIBKService {
  private static instance: PresensiIBKService;
  private constructor() {}

  static getInstance() {
    if (!PresensiIBKService.instance) {
      PresensiIBKService.instance = new PresensiIBKService();
    }
    return PresensiIBKService.instance;
  }

  async listByJadwal(
    jadwalId: string,
    params: { limit?: number; page?: number } = {},
  ): Promise<PresensiIBKListResponse> {
    const query = new URLSearchParams();
    if (params.limit) query.append("limit", params.limit.toString());
    if (params.page) query.append("page", params.page.toString());
    const res = await api.get(
      `/kader/presensi-ibk/${jadwalId}?${query.toString()}`,
    );
    return res.data;
  }

  async detail(id: string): Promise<PresensiIBKDetailResponse> {
    const res = await api.get(`/kader/presensi-ibk/detail/${id}`);
    return res.data;
  }

  async add(payload: {
    user_ibk_id: string;
    jadwal_id: string;
  }): Promise<void> {
    await api.post(`/kader/presensi-ibk`, payload);
  }

  async updateStatus(
    id: string,
    status: PresensiStatus,
  ): Promise<PresensiIBKDetailResponse | void> {
    const res = await api.patch(`/kader/presensi-ibk/update/${id}`, {
      status_presensi: status,
    });
    return res.data;
  }

  // New: list IBK not yet registered in the jadwal for a given posyandu
  async listIbkNotRegistered(
    jadwalId: string,
    posyanduId: string,
  ): Promise<Array<{ id: string; nama: string }>> {
    const res = await api.get(
      `/kader/presensi-ibk/ibk-not-registered/${jadwalId}/posyandu/${posyanduId}`,
    );
    // The backend returns an array; normalize to id and nama keys commonly used in UI
    const data = Array.isArray(res.data?.data) ? res.data.data : res.data;
    return (Array.isArray(data) ? data : []).map((row: any) => ({
      id: row.id ?? row.ibk_id ?? row.user_ibk_id ?? row.user_id ?? "",
      nama:
        row.nama ||
        row.nama_lengkap ||
        row.personal_data?.nama_lengkap ||
        row.ibk?.nama ||
        "(Tanpa Nama)",
    }));
  }
}

export const presensiIBKService = PresensiIBKService.getInstance();
 