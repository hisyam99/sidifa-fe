import axios from "axios";
import { sessionUtils } from "~/utils/auth"; // Impor sessionUtils

const api = axios.create({
  baseURL: import.meta.env.PUBLIC_API_URL || "http://localhost:3000/api/v1",
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

        // --- PERBAIKAN PENTING ---
        // Jangan panggil logout() di sini. Ini yang menyebabkan rentetan request.
        // Cukup bersihkan sesi di sisi client dan biarkan error mengalir
        // agar useAuth hook bisa menanganinya.
        sessionUtils.clearAllAuthData();

        // Tolak promise agar pemanggil tahu bahwa otentikasi gagal total.
        return Promise.reject(
          new Error("Sesi telah berakhir, silakan login kembali."),
        );
      }
    }

    // Untuk semua error lain, teruskan saja error aslinya.
    return Promise.reject(new Error(error));
  },
);

// Profile service
export const profileService = {
  async getProfile() {
    const response = await api.get("/auth/me");
    return response.data;
  },
};

// Auth service
export const authService = {
  async logout() {
    // Saat logout, reset status csrf agar diambil ulang jika login lagi.
    csrfFetched = false;
    csrfTokenValue = null;
    const response = await api.post("/auth/logout");
    return response.data;
  },
  async refresh() {
    const response = await api.post("/auth/refresh");
    return response.data;
  },
  async login(data: any) {
    const response = await api.post("/auth/login", data);
    return response.data;
  },
};

// Admin service
export const adminService = {
  async listUsers(params: { limit?: number; page?: number; name?: string }) {
    const queryParams = new URLSearchParams();
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.name) queryParams.append('name', params.name);
    
    const response = await api.get(`/admin/list-user?${queryParams.toString()}`);
    return response.data;
  },
  
  async verifyUser(userId: string, verification: "verified" | "unverified") {
    const response = await api.patch("/admin/verification", {
      userId,
      verification
    });
    return response.data;
  }
};

export default api;
