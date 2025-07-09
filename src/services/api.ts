import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.PUBLIC_API_URL || "http://localhost:3001/api/v1",
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

// Helper untuk ambil token dari cookie
function getTokenFromCookie() {
  if (typeof document !== "undefined") {
    const match = document.cookie.match(/(?:^|; )access_token=([^;]*)/);
    return match ? decodeURIComponent(match[1]) : null;
  }
  return null;
}

// Request interceptor untuk JWT dan logging
api.interceptors.request.use((config) => {
  // Ambil token dari cookie (bukan localStorage)
  const token = getTokenFromCookie();
  if (token) config.headers.Authorization = `Bearer ${token}`;

  console.log("🚀 REQUEST:", {
    method: config.method?.toUpperCase(),
    url: config.url,
    data: config.data,
    headers: config.headers,
  });

  return config;
});

// Response interceptor untuk logging
api.interceptors.response.use(
  (response) => {
    console.log("✅ RESPONSE:", {
      status: response.status,
      url: response.config.url,
      data: response.data,
    });
    return response;
  },
  (error) => {
    console.log("❌ ERROR:", {
      status: error.response?.status,
      url: error.config?.url,
      data: error.response?.data,
      message: error.message,
    });
    return Promise.reject(error);
  },
);

export default api;
