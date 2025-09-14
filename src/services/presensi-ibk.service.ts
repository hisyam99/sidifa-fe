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
    return res.data as PresensiIBKListResponse;
  }

  async detail(id: string): Promise<PresensiIBKDetailResponse> {
    const res = await api.get(`/kader/presensi-ibk/detail/${id}`);

    // Handle case where API returns data directly vs wrapped in {data: ...}
    if (res.data && typeof res.data === "object" && "data" in res.data) {
      // Response is {data: {data: PresensiIBKItem}} - return the outer wrapper
      return res.data as PresensiIBKDetailResponse;
    } else {
      // Response is {data: PresensiIBKItem} - wrap it
      return { data: res.data } as PresensiIBKDetailResponse;
    }
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
    return res.data as PresensiIBKDetailResponse;
  }

  // New: Bulk update status for multiple IBK in a jadwal
  async bulkUpdate(
    jadwalId: string,
    updates: Array<{ user_ibk_id: string; status_presensi: PresensiStatus }>,
  ): Promise<void> {
    await api.patch(`/kader/presensi-ibk/bulk-update/${jadwalId}`, updates, {});
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
    const body = res.data as
      | { data?: Array<Record<string, unknown>> }
      | Array<Record<string, unknown>>;
    const arr = Array.isArray((body as { data?: unknown }).data)
      ? (body as { data: Array<Record<string, unknown>> }).data
      : (body as Array<Record<string, unknown>>);
    return (Array.isArray(arr) ? arr : []).map((row) => ({
      id:
        (row.id as string | undefined) ||
        (row.ibk_id as string | undefined) ||
        (row.user_ibk_id as string | undefined) ||
        (row.user_id as string | undefined) ||
        "",
      nama:
        (row.nama as string | undefined) ||
        (row.nama_lengkap as string | undefined) ||
        ((row.personal_data as { nama_lengkap?: string } | undefined)
          ?.nama_lengkap as string | undefined) ||
        ((row.ibk as { nama?: string } | undefined)?.nama as
          | string
          | undefined) ||
        "(Tanpa Nama)",
    }));
  }
}

export const presensiIBKService = PresensiIBKService.getInstance();
