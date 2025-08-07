import api from "./api";
import type {
  MonitoringIBKCreateRequest,
  MonitoringIBKUpdateRequest,
  MonitoringIBKListResponse,
  MonitoringIBKDetailResponse,
} from "~/types";

export class MonitoringIBKService {
  private static instance: MonitoringIBKService;
  private constructor() {}

  static getInstance() {
    if (!MonitoringIBKService.instance) {
      MonitoringIBKService.instance = new MonitoringIBKService();
    }
    return MonitoringIBKService.instance;
  }

  async create(payload: MonitoringIBKCreateRequest): Promise<void> {
    await api.post(`/kader/monitoring-ibk`, payload);
  }

  async update(id: string, payload: MonitoringIBKUpdateRequest): Promise<void> {
    await api.patch(`/kader/monitoring-ibk/update/${id}`, payload);
  }

  async listByJadwal(
    jadwalId: string,
    params: { limit?: number; page?: number } = {},
  ): Promise<MonitoringIBKListResponse> {
    const query = new URLSearchParams();
    if (params.limit) query.append("limit", params.limit.toString());
    if (params.page) query.append("page", params.page.toString());
    const res = await api.get(
      `/kader/monitoring-ibk/${jadwalId}?${query.toString()}`,
    );
    return res.data;
  }

  async detail(id: string): Promise<MonitoringIBKDetailResponse> {
    const res = await api.get(`/kader/monitoring-ibk/detail/${id}`);
    return res.data;
  }
}

export const monitoringIBKService = MonitoringIBKService.getInstance();
