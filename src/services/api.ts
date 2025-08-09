import axios from "axios";
import { sessionUtils } from "~/utils/auth"; // Impor sessionUtils

const api = axios.create({
  baseURL: import.meta.env.PUBLIC_API_URL || "__PUBLIC_API_URL__",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true,
  xsrfCookieName: "_csrf",
  xsrfHeaderName: "X-CSRF-TOKEN",
});

// CSRF Token fetcher
export async function fetchCsrfToken() {
  const response = await api.get("/csrf/token");
  return response.data;
}

// Auto-fetch CSRF token untuk POST/PUT/PATCH/DELETE
let csrfFetched = false;
let csrfTokenValue: string | null = null;
api.interceptors.request.use(async (config) => {
  if (
    ["post", "put", "patch", "delete"].includes(
      config.method?.toLowerCase() || "",
    ) &&
    !csrfFetched
  ) {
    try {
      const response = await fetchCsrfToken();
      csrfTokenValue = response.csrfToken;
      csrfFetched = true;
    } catch (error) {
      console.error("Gagal mengambil CSRF token:", error);
      return Promise.reject(new Error("Tidak dapat mengambil CSRF token"));
    }
  }
  if (
    csrfTokenValue &&
    ["post", "put", "patch", "delete"].includes(
      config.method?.toLowerCase() || "",
    )
  ) {
    config.headers["X-CSRF-TOKEN"] = csrfTokenValue;
  }
  return config;
});

// Request interceptor untuk logging
api.interceptors.request.use((config) => {
  console.log("🚀 REQUEST:", {
    method: config.method?.toUpperCase(),
    url: config.url,
    fullURL: `${config.baseURL}${config.url}`,
  });
  return config;
});

// Response interceptor untuk logging, penanganan error, dan refresh token
api.interceptors.response.use(
  (response) => {
    console.log("✅ RESPONSE:", {
      status: response.status,
      url: response.config.url,
    });
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    console.log("❌ ERROR:", {
      status: error.response?.status,
      url: originalRequest?.url,
      data: error.response?.data,
      message: error.message,
    });

    // Tangani 429 (Too Many Requests) - JANGAN hapus session/data apapun
    if (error.response?.status === 429) {
      console.log("⚠️ Rate limit exceeded (429) - preserving session data");
      // Buat error custom yang tidak akan menyebabkan session clearing
      const rateLimitError = new Error(
        "Terlalu banyak permintaan, silakan coba lagi nanti.",
      );
      rateLimitError.name = "RateLimitError";
      // Tambahkan flag untuk menandai ini adalah 429 error
      (rateLimitError as any).isRateLimit = true;
      (rateLimitError as any).response = error.response;
      return Promise.reject(rateLimitError);
    }

    // Tangani token kadaluarsa (401)
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      originalRequest.url !== "/auth/refresh"
    ) {
      originalRequest._retry = true;

      try {
        console.log("🔄 Mencoba refresh token...");
        await authService.refresh();
        console.log("✅ Token berhasil di-refresh. Mengulang request asli...");
        return api(originalRequest);
      } catch (refreshError) {
        console.error("Gagal refresh token:", refreshError);
        sessionUtils.clearAllAuthData();
        return Promise.reject(new Error(error.response?.data.message));
      }
    }

    // Untuk semua error lain, bungkus ke Error bila perlu, lalu teruskan.
    const ensureError = (err: unknown): Error => {
      if (err instanceof Error) return err;
      try {
        const msg = (err as any)?.message ?? JSON.stringify(err);
        return new Error(String(msg));
      } catch {
        return new Error("Unknown error");
      }
    };
    return Promise.reject(ensureError(error));
  },
);

// Profile service
export const profileService = {
  async getProfile() {
    // Prevent API calls during SSG/server
    if (typeof window === "undefined") {
      return null;
    }
    const response = await api.get("/auth/me");
    return response.data;
  },
};

// Auth service
export const authService = {
  async logout() {
    // Prevent API calls during SSG/server
    if (typeof window === "undefined") {
      return null;
    }
    // Saat logout, reset status csrf agar diambil ulang jika login lagi.
    csrfFetched = false;
    csrfTokenValue = null;
    const response = await api.post("/auth/logout");
    return response.data;
  },
  async refresh() {
    // Prevent API calls during SSG/server
    if (typeof window === "undefined") {
      return null;
    }
    const response = await api.post("/auth/refresh");
    return response.data;
  },
  async login(data: any) {
    // Prevent API calls during SSG/server
    if (typeof window === "undefined") {
      return null;
    }
    const response = await api.post("/auth/login", data);
    return response.data;
  },
};

// Admin service
export const adminService = {
  async listUsers(params: {
    limit?: number;
    page?: number;
    name?: string;
    role?: "admin" | "posyandu" | "psikolog" | "";
    verification?: "verified" | "unverified" | "";
    orderBy?: string;
  }) {
    // Prevent API calls during SSG/server
    if (typeof window === "undefined") {
      return [];
    }
    const queryParams = new URLSearchParams();
    if (params.limit) queryParams.append("limit", params.limit.toString());
    if (params.page) queryParams.append("page", params.page.toString());
    if (params.name) queryParams.append("name", params.name);
    if (params.role) queryParams.append("role", params.role);
    if (params.verification)
      queryParams.append("verification", params.verification);
    if (params.orderBy) queryParams.append("orderBy", params.orderBy);

    const response = await api.get(
      `/admin/list-user?${queryParams.toString()}`,
    );
    return response.data;
  },

  async verifyUser(userId: string, verification: "verified" | "unverified") {
    const response = await api.patch("/admin/verification", {
      userId,
      verification,
    });
    return response.data;
  },

  // Admin Posyandu CRUD operations
  async listPosyandu(params: {
    limit?: number;
    page?: number;
    nama_posyandu?: string;
  }) {
    const queryParams = new URLSearchParams();
    if (params.limit) queryParams.append("limit", params.limit.toString());
    if (params.page) queryParams.append("page", params.page.toString());
    if (params.nama_posyandu)
      queryParams.append("nama_posyandu", params.nama_posyandu);

    const response = await api.get(`/admin/posyandu?${queryParams.toString()}`);
    return response.data;
  },

  async createPosyandu(data: {
    nama_posyandu: string;
    alamat: string;
    no_telp: string;
  }) {
    const response = await api.post("/admin/posyandu", data);
    return response.data;
  },

  async updatePosyandu(data: {
    id: string;
    nama_posyandu?: string;
    alamat?: string;
    no_telp?: string;
  }) {
    const response = await api.patch("/admin/posyandu", data);
    return response.data;
  },

  async deletePosyandu(id: string) {
    const response = await api.delete("/admin/posyandu", {
      data: { id },
    });
    return response.data;
  },

  async detailPosyandu(id: string) {
    const response = await api.get(`/admin/posyandu/detail/${id}`);
    return response.data;
  },

  // Admin Psikolog CRUD operations
  async listPsikolog(params: {
    limit?: number;
    page?: number;
    nama?: string;
    spesialisasi?: string;
    status?: "Aktif" | "Tidak Aktif" | "";
  }) {
    const queryParams = new URLSearchParams();
    if (params.limit) queryParams.append("limit", params.limit.toString());
    if (params.page) queryParams.append("page", params.page.toString());
    if (params.nama) queryParams.append("nama", params.nama);
    if (params.spesialisasi)
      queryParams.append("spesialisasi", params.spesialisasi);
    if (params.status) queryParams.append("status", params.status);

    const response = await api.get(`/admin/psikolog?${queryParams.toString()}`);
    return response.data;
  },

  async createPsikolog(data: {
    nama: string;
    email: string;
    no_telp: string;
    spesialisasi: string;
  }) {
    const response = await api.post("/admin/psikolog", data);
    return response.data;
  },

  async updatePsikolog(data: {
    id: string;
    nama?: string;
    email?: string;
    no_telp?: string;
    spesialisasi?: string;
    status?: "Aktif" | "Tidak Aktif";
  }) {
    const response = await api.patch(`/admin/psikolog/${data.id}`, data);
    return response.data;
  },

  async deletePsikolog(id: string) {
    const response = await api.delete(`/admin/psikolog/${id}`);
    return response.data;
  },
};

// Kader service
export const kaderService = {
  async getKaderPosyanduList(params: {
    limit?: number;
    nama_posyandu?: string;
    page?: number;
  }) {
    const queryParams = new URLSearchParams();
    if (params.limit) queryParams.append("limit", params.limit.toString());
    if (params.nama_posyandu)
      queryParams.append("nama_posyandu", params.nama_posyandu);
    if (params.page) queryParams.append("page", params.page.toString());
    const response = await api.get(`/kader/posyandu?${queryParams.toString()}`);
    return response.data;
  },

  async getPosyanduDetail(params: { id: string }) {
    const response = await api.get(`/kader/posyandu/detail`, { data: params });
    return response.data;
  },

  async registerKaderPosyandu(posyandu_id: string) {
    const response = await api.post(`/kader/register-kader-posyandu`, {
      posyandu_id,
    });
    return response.data;
  },
};

export const getPosyanduDetail = async (id: string) => {
  const response = await api.get(`/kader/posyandu/detail/${id}`);
  return response.data;
};

export const informasiEdukasiAdminService = {
  async list(params: {
    limit?: number;
    page?: number;
    deskripsi?: string;
    judul?: string;
    tipe?: string;
  }) {
    // Prevent API calls during SSG/server
    if (typeof window === "undefined") {
      return {
        data: [],
        meta: {
          totalData: 0,
          totalPage: 1,
        },
      };
    }
    const queryParams = new URLSearchParams();
    if (params.limit) queryParams.append("limit", params.limit.toString());
    if (params.page) queryParams.append("page", params.page.toString());
    if (params.deskripsi) queryParams.append("deskripsi", params.deskripsi);
    if (params.judul) queryParams.append("judul", params.judul);
    if (params.tipe) queryParams.append("tipe", params.tipe);

    const response = await api.get(
      `/admin/informasi-edukasi?${queryParams.toString()}`,
    );
    return response.data;
  },
  async detail(id: string) {
    // Prevent API calls during SSG/server
    if (typeof window === "undefined") {
      return null;
    }
    // Guard non-UUID id (e.g., "create")
    const isUuid =
      /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(
        id,
      );
    if (!isUuid) return null;

    const response = await api.get(`/admin/informasi-edukasi/detail/${id}`);
    const body = response.data;
    return body?.data ?? body;
  },
  async update(data: {
    id: string;
    judul?: string;
    tipe?: string;
    deskripsi?: string;
    file?: File;
  }) {
    // Prevent API calls during SSG/server
    if (typeof window === "undefined") {
      return null;
    }
    const formData = new FormData();
    formData.append("id", data.id);
    if (data.judul) formData.append("judul", data.judul);
    if (data.tipe) formData.append("tipe", data.tipe);
    if (data.deskripsi) formData.append("deskripsi", data.deskripsi);
    if (data.file) formData.append("file", data.file);

    const response = await api.patch(`/admin/informasi-edukasi`, formData, {
      params: { role: "admin", name: "Nam" },
    });
    return response.data;
  },
  async delete(id: string) {
    // Prevent API calls during SSG/server
    if (typeof window === "undefined") {
      return null;
    }
    const response = await api.delete(`/admin/informasi-edukasi`, {
      params: { role: "admin", name: "Nam" },
      data: { id },
    });
    return response.data;
  },
  async create(data: {
    judul: string;
    tipe: string;
    deskripsi: string;
    file?: File;
  }) {
    // Prevent API calls during SSG/server
    if (typeof window === "undefined") {
      return null;
    }
    const formData = new FormData();
    formData.append("judul", data.judul);
    formData.append("tipe", data.tipe);
    formData.append("deskripsi", data.deskripsi);
    if (data.file) formData.append("file", data.file);

    const response = await api.post(`/admin/informasi-edukasi`, formData, {
      params: { role: "admin", name: "Nam" },
    });
    return response.data;
  },
};

// ADD START: Admin Lowongan service
export const adminLowonganService = {
  async list(params: {
    limit?: number;
    page?: number;
    nama_lowongan?: string;
    nama_perusahaan?: string;
    jenis_pekerjaan?: string;
    lokasi?: string;
    jenis_difasilitas?: string;
    status?: string;
  }) {
    if (typeof window === "undefined") {
      return {
        data: [],
        meta: {
          totalData: 0,
          totalPage: 1,
          currentPage: 1,
          limit: params.limit ?? 10,
        },
      };
    }
    const query = new URLSearchParams();
    if (params.limit) query.append("limit", String(params.limit));
    if (params.page) query.append("page", String(params.page));
    if (params.nama_lowongan)
      query.append("nama_lowongan", params.nama_lowongan);
    if (params.nama_perusahaan)
      query.append("nama_perusahaan", params.nama_perusahaan);
    if (params.jenis_pekerjaan)
      query.append("jenis_pekerjaan", params.jenis_pekerjaan);
    if (params.lokasi) query.append("lokasi", params.lokasi);
    if (params.jenis_difasilitas)
      query.append("jenis_difasilitas", params.jenis_difasilitas);
    if (params.status) query.append("status", params.status);

    const response = await api.get(`/admin/lowongan?${query.toString()}`);
    return response.data;
  },
  async detail(id: string) {
    if (typeof window === "undefined") return null;
    const response = await api.get(`/admin/lowongan/detail/${id}`);
    const body = response.data;
    return body?.data ?? body;
  },
  async create(data: {
    nama_lowongan: string;
    nama_perusahaan: string;
    jenis_pekerjaan: string;
    lokasi: string;
    jenis_difasilitas: string;
    deskripsi: string;
    status: string;
    tanggal_mulai?: string;
    tanggal_selesai?: string;
    file?: File;
  }) {
    if (typeof window === "undefined") return null;
    const fd = new FormData();
    const appendDate = (key: string, value?: string) => {
      if (!value) return;
      let t = String(value);
      if (/^\d{4}-\d{2}-\d{2}$/.test(t)) {
        t = new Date(`${t}T00:00:00`).toISOString();
      }
      fd.append(key, t);
    };
    fd.append("nama_lowongan", data.nama_lowongan);
    fd.append("nama_perusahaan", data.nama_perusahaan);
    fd.append("jenis_pekerjaan", data.jenis_pekerjaan);
    fd.append("lokasi", data.lokasi);
    fd.append("jenis_difasilitas", data.jenis_difasilitas);
    fd.append("deskripsi", data.deskripsi);
    fd.append("status", data.status);
    appendDate("tanggal_mulai", data.tanggal_mulai);
    appendDate("tanggal_selesai", data.tanggal_selesai);
    if (data.file) fd.append("file", data.file);

    const response = await api.post(`/admin/lowongan`, fd, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },
  async update(
    id: string,
    data: {
      nama_lowongan?: string;
      nama_perusahaan?: string;
      jenis_pekerjaan?: string;
      lokasi?: string;
      jenis_difasilitas?: string;
      deskripsi?: string;
      status?: string;
      tanggal_mulai?: string;
      tanggal_selesai?: string;
      file?: File;
    },
  ) {
    if (typeof window === "undefined") return null;
    const fd = new FormData();
    const appendIf = (k: string, v?: string) => {
      if (v !== undefined && v !== null) fd.append(k, v);
    };
    const appendDate = (key: string, value?: string) => {
      if (value === undefined || value === null) return;
      let t = String(value);
      if (/^\d{4}-\d{2}-\d{2}$/.test(t)) {
        t = new Date(`${t}T00:00:00`).toISOString();
      }
      fd.append(key, t);
    };
    fd.append("id", id);
    appendIf("nama_lowongan", data.nama_lowongan);
    appendIf("nama_perusahaan", data.nama_perusahaan);
    appendIf("jenis_pekerjaan", data.jenis_pekerjaan);
    appendIf("lokasi", data.lokasi);
    appendIf("jenis_difasilitas", data.jenis_difasilitas);
    appendIf("deskripsi", data.deskripsi);
    appendIf("status", data.status);
    appendDate("tanggal_mulai", data.tanggal_mulai);
    appendDate("tanggal_selesai", data.tanggal_selesai);
    if (data.file) fd.append("file", data.file);

    const response = await api.patch(`/admin/lowongan`, fd, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },
  async delete(id: string) {
    if (typeof window === "undefined") return null;
    const response = await api.delete(`/admin/lowongan`, { data: { id } });
    return response.data;
  },
};
// ADD END: Admin Lowongan service

// ADD START: Kader Lowongan service
export const kaderLowonganService = {
  async list(params: {
    limit?: number;
    page?: number;
    nama_lowongan?: string;
    nama_perusahaan?: string;
    jenis_pekerjaan?: string;
    lokasi?: string;
    jenis_difasilitas?: string;
    status?: string;
  }) {
    if (typeof window === "undefined") {
      return {
        data: [],
        meta: {
          totalData: 0,
          totalPage: 1,
          currentPage: 1,
          limit: params.limit ?? 10,
        },
      };
    }
    const query = new URLSearchParams();
    if (params.limit) query.append("limit", String(params.limit));
    if (params.page) query.append("page", String(params.page));
    if (params.nama_lowongan)
      query.append("nama_lowongan", params.nama_lowongan);
    if (params.nama_perusahaan)
      query.append("nama_perusahaan", params.nama_perusahaan);
    if (params.jenis_pekerjaan)
      query.append("jenis_pekerjaan", params.jenis_pekerjaan);
    if (params.lokasi) query.append("lokasi", params.lokasi);
    if (params.jenis_difasilitas)
      query.append("jenis_difasilitas", params.jenis_difasilitas);
    if (params.status) query.append("status", params.status);

    const response = await api.get(`/kader/lowongan?${query.toString()}`);
    return response.data;
  },
  async detail(id: string) {
    if (typeof window === "undefined") return null;
    const response = await api.get(`/kader/lowongan/detail/${id}`);
    const body = response.data;
    return body?.data ?? body;
  },
};
// ADD END: Kader Lowongan service

// ADD START: Kader Informasi & Edukasi service
export const informasiEdukasiKaderService = {
  async list(params: {
    limit?: number;
    page?: number;
    deskripsi?: string;
    judul?: string;
  }) {
    if (typeof window === "undefined") {
      return {
        data: [],
        meta: {
          totalData: 0,
          totalPage: 1,
          currentPage: 1,
          limit: params.limit ?? 10,
        },
      };
    }
    const queryParams = new URLSearchParams();
    if (params.limit) queryParams.append("limit", params.limit.toString());
    if (params.page) queryParams.append("page", params.page.toString());
    if (params.deskripsi) queryParams.append("deskripsi", params.deskripsi);
    if (params.judul) queryParams.append("judul", params.judul);

    const response = await api.get(
      `/kader/informasi-edukasi-kader?${queryParams.toString()}`,
    );
    return response.data;
  },
  async detail(id: string) {
    if (typeof window === "undefined") {
      return null;
    }
    const isUuid =
      /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(
        id,
      );
    if (!isUuid) return null;

    // Direct GET without forcing CSRF for read-only endpoint
    const response = await api.get(
      `/kader/informasi-edukasi-kader/detail/${id}`,
    );
    const body = response.data;
    return body?.data ?? body;
  },
};
// ADD END: Kader Informasi & Edukasi service

export const ibkService = {
  async createIbk(formData: FormData) {
    const response = await api.post("/kader/pendataan-ibk", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },
  async updateIbk(id: string, formData: FormData) {
    const response = await api.patch(
      `/kader/pendataan-ibk/update/${id}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
    return response.data;
  },
  buildIbkUpdateFormData(payload: Record<string, any>): FormData {
    const fd = new FormData();

    // Helpers to normalize values
    const clampNumber = (value: unknown, min: number, max: number): number => {
      const n = parseInt(String(value), 10);
      if (Number.isNaN(n)) return min;
      return Math.max(min, Math.min(max, n));
    };
    const normalizeBooleanString = (value: unknown): string => {
      const v = String(value).toLowerCase();
      return ["true", "t", "ya", "iya", "1"].includes(v) ? "true" : "false";
    };
    const normalizeDateISOString = (value: unknown): string => {
      let t = String(value);
      if (/^\d{4}-\d{2}-\d{2}$/.test(t)) {
        t = new Date(`${t}T00:00:00`).toISOString();
      }
      return t;
    };

    // Handlers map to reduce branching complexity
    const handlers: Record<string, (value: unknown) => void> = {
      file: (value: unknown) => {
        // Accept File (Blob) or string path uniformly
        fd.append("file_foto", value as File);
      },
      tanggal_lahir: (value: unknown) => {
        fd.append("tanggal_lahir", normalizeDateISOString(value));
      },
      odgj: (value: unknown) => {
        fd.append("odgj", normalizeBooleanString(value));
      },
      total_iq: (value: unknown) => {
        fd.append("total_iq", String(clampNumber(value, 0, 200)));
      },
      umur: (value: unknown) => {
        fd.append("umur", String(clampNumber(value, 0, 150)));
      },
    };

    for (const [key, value] of Object.entries(payload)) {
      if (value === undefined || value === null) continue;
      const handler = handlers[key];
      if (handler) {
        handler(value);
        continue;
      }
      fd.append(key, String(value));
    }

    return fd;
  },
  async getIbkListByPosyandu(params: {
    posyanduId: string;
    page?: number;
    limit?: number;
    orderBy?: string;
    nama?: string;
  }) {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append("page", params.page.toString());
    if (params.limit) queryParams.append("limit", params.limit.toString());
    if (params.orderBy) queryParams.append("orderBy", params.orderBy);
    if (params.posyanduId) queryParams.append("posyanduId", params.posyanduId);
    if (params.nama) queryParams.append("nama", params.nama);
    const response = await api.get(
      `/kader/pendataan-ibk/${params.posyanduId}?${queryParams.toString()}`,
    );
    return response.data;
  },
  async getIbkDetail(id: string) {
    const response = await api.get(`/kader/pendataan-ibk/detail/${id}`);
    return response.data;
  },
};

export default api;
