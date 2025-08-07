import api from "./api";
import type {
  JadwalPosyanduCreateRequest,
  JadwalPosyanduUpdateRequest,
  JadwalPosyanduListResponse,
  JadwalPosyanduDetailResponse,
} from "~/types";

export class JadwalPosyanduService {
  private static instance: JadwalPosyanduService;
  private constructor() {}

  static getInstance() {
    if (!JadwalPosyanduService.instance) {
      JadwalPosyanduService.instance = new JadwalPosyanduService();
    }
    return JadwalPosyanduService.instance;
  }

  async createJadwal(data: JadwalPosyanduCreateRequest): Promise<void> {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (key === "file_name" && value instanceof File) {
          formData.append(key, value);
        } else if (key === "tanggal") {
          // Pastikan tanggal dalam format ISO-8601
          let tgl = value as string;
          if (/^\d{4}-\d{2}-\d{2}$/.test(tgl)) {
            tgl = new Date(tgl).toISOString();
          }
          formData.append(key, tgl);
        } else {
          formData.append(key, value as string);
        }
      }
    });
    await api.post("/kader/jadwal-posyandu", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }

  async updateJadwal(
    id: string,
    data: JadwalPosyanduUpdateRequest,
  ): Promise<void> {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (key === "file_name" && value instanceof File) {
          formData.append(key, value);
        } else {
          formData.append(key, value as string);
        }
      }
    });
    await api.patch(`/kader/jadwal-posyandu/update/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }

  async getJadwalList(
    posyanduId: string,
    params: { limit?: number; page?: number },
  ): Promise<JadwalPosyanduListResponse> {
    const query = new URLSearchParams();
    if (params.limit) query.append("limit", params.limit.toString());
    if (params.page) query.append("page", params.page.toString());
    const response = await api.get(
      `/kader/jadwal-posyandu/${posyanduId}?${query.toString()}`,
    );
    return response.data;
  }

  async getJadwalDetail(id: string): Promise<JadwalPosyanduDetailResponse> {
    const response = await api.get(`/kader/jadwal-posyandu/detail/${id}`);
    return response.data;
  }
}

export const jadwalPosyanduService = JadwalPosyanduService.getInstance();
