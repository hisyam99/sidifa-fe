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
}

export const presensiIBKService = PresensiIBKService.getInstance();
