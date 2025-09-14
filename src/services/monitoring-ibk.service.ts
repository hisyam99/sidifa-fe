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
    const body: MonitoringIBKCreateRequest = { ...payload };
    if (
      body.tanggal_kunjungan &&
      /^\d{4}-\d{2}-\d{2}$/.test(body.tanggal_kunjungan)
    ) {
      body.tanggal_kunjungan = new Date(
        `${body.tanggal_kunjungan}T00:00:00`,
      ).toISOString();
    }
    await api.post(`/kader/monitoring-ibk`, body);
  }

  async update(id: string, payload: MonitoringIBKUpdateRequest): Promise<void> {
    const body: MonitoringIBKUpdateRequest = { ...payload };
    if (
      body.tanggal_kunjungan &&
      /^\d{4}-\d{2}-\d{2}$/.test(body.tanggal_kunjungan)
    ) {
      body.tanggal_kunjungan = new Date(
        `${body.tanggal_kunjungan}T00:00:00`,
      ).toISOString();
    }
    await api.patch(`/kader/monitoring-ibk/update/${id}`, body);
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
    return res.data as MonitoringIBKListResponse;
  }

  // New: fetch IBK hadir list (presensi-specific) for a jadwal
  async listHadirByJadwal(
    jadwalId: string,
    params: { limit?: number; page?: number } = {},
  ): Promise<{
    data: Array<{ id: string; nama: string }>;
    meta?: {
      currentPage: number;
      totalPage: number;
      limit: number;
      totalData: number;
    };
  }> {
    const query = new URLSearchParams();
    if (params.limit) query.append("limit", params.limit.toString());
    if (params.page) query.append("page", params.page.toString());
    const res = await api.get(
      `/kader/monitoring-ibk/list-hadir/${jadwalId}?${query.toString()}`,
    );
    const body = res.data as {
      data?: Array<{ id?: string; nama?: string; [key: string]: unknown }>;
      meta?: {
        currentPage: number;
        totalPage: number;
        limit: number;
        totalData: number;
      };
    };
    const normalized = (Array.isArray(body?.data) ? body.data : []).map(
      (row) => ({
        id: row.id ?? "",
        nama: row.nama ?? "(Tanpa Nama)",
      }),
    );
    return { data: normalized, meta: body.meta };
  }

  async detail(id: string): Promise<MonitoringIBKDetailResponse> {
    const res = await api.get(`/kader/monitoring-ibk/detail/${id}`);

    // Handle case where API returns data directly vs wrapped in {data: ...}
    if (res.data && typeof res.data === "object" && "data" in res.data) {
      // Response is {data: {data: MonitoringIBKItem}} - return the outer wrapper
      return res.data as MonitoringIBKDetailResponse;
    } else {
      // Response is {data: MonitoringIBKItem} - wrap it
      return { data: res.data } as MonitoringIBKDetailResponse;
    }
  }

  // New: delete monitoring
  async delete(id: string): Promise<void> {
    await api.delete(`/kader/monitoring-ibk/delete/${id}`);
  }
}

export const monitoringIBKService = MonitoringIBKService.getInstance();
