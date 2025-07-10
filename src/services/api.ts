import axios from "axios";
import { cookieUtils } from "~/utils/auth";

const api = axios.create({
  baseURL: import.meta.env.PUBLIC_API_URL || "http://localhost:3000/api/v1",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true,
  timeout: 10000, // 10 detik timeout
});

// Request interceptor untuk JWT dan logging
api.interceptors.request.use((config) => {
  // Ambil token dari cookie (bukan localStorage)
  const token = cookieUtils.getAccessToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;

  console.log("🚀 REQUEST:", {
    method: config.method?.toUpperCase(),
    url: config.url,
    baseURL: config.baseURL,
    fullURL: `${config.baseURL}${config.url}`,
    data: config.data,
    headers: config.headers,
  });

  return config;
});

// Response interceptor untuk logging dan token refresh
api.interceptors.response.use(
  (response) => {
    console.log("✅ RESPONSE:", {
      status: response.status,
      url: response.config.url,
      data: response.data,
    });
    return response;
  },
  async (error) => {
    console.log("❌ ERROR:", {
      status: error.response?.status,
      url: error.config?.url,
      data: error.response?.data,
      message: error.message,
    });
    return Promise.reject(new Error(error.response?.data?.message));
  },
);

// Profile service functions
export const profileService = {
  async getProfile() {
    const response = await api.get("/auth/profile");
    return response.data;
  },
};

// Auth service functions
export const authService = {
  async logout() {
    const response = await api.post("/auth/logout");
    return response.data;
  },
  async refresh() {
    const response = await api.post("/auth/refresh");
    return response.data;
  },
};

export default api;
