import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.PUBLIC_API_URL || "http://localhost:3001/api/v1",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true, // This is crucial for cookies
  xsrfCookieName: "_csrf",
  xsrfHeaderName: "X-CSRF-TOKEN",
  timeout: 10000,
});

// CSRF Token fetcher
export async function fetchCsrfToken() {
  console.log("🔐 Fetching CSRF token...");
  const response = await api.get("/csrf/token");
  console.log("✅ CSRF token response:", response.data);
  return response.data;
}

// Auto-fetch CSRF token untuk POST/PUT/PATCH/DELETE
let csrfFetched = false;
let csrfTokenValue: string | null = null;

api.interceptors.request.use(async (config) => {
  // Log cookies before request
  if (typeof document !== "undefined") {
    console.log("🍪 Cookies before request:", document.cookie);
  }
  
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
      console.log("✅ CSRF token set:", csrfTokenValue);
    } catch (error) {
      console.error("❌ Failed to fetch CSRF token:", error);
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
    baseURL: config.baseURL,
    fullURL: `${config.baseURL}${config.url}`,
    data: config.data,
    headers: config.headers,
    withCredentials: config.withCredentials,
  });

  if (
    ["post", "put", "patch", "delete"].includes(
      config.method?.toLowerCase() || "",
    )
  ) {
    console.log("🔍 CSRF Debug:", {
      cookieName: "_csrf",
      headerName: "X-CSRF-TOKEN",
      headerValue: config.headers?.["X-CSRF-TOKEN"],
      allHeaders: config.headers,
    });
  }

  return config;
});

// Response interceptor untuk logging, penanganan error, dan refresh token
api.interceptors.response.use(
  (response) => {
    // Log cookies after response
    if (typeof document !== "undefined") {
      console.log("🍪 Cookies after response:", document.cookie);
    }
    
    console.log("✅ RESPONSE:", {
      status: response.status,
      url: response.config.url,
      data: response.data,
      headers: response.headers,
    });
    return response;
  },
  async (error) => {
    console.log("❌ ERROR:", {
      status: error.response?.status,
      url: error.config?.url,
      data: error.response?.data,
      message: error.message,
      headers: error.response?.headers,
    });

    // Tangani token kadaluarsa (401) dengan pencegahan loop
    if (
      error.response?.status === 401 &&
      !error.config._retry && // Cegah loop tak terbatas
      error.config.url !== "/auth/refresh" && // Jangan refresh jika sudah di endpoint refresh
      error.config.url !== "/auth/logout" && // Jangan refresh jika sudah di endpoint logout
      error.config.url !== "/auth/me" // Jangan refresh jika sudah di endpoint profile
    ) {
      error.config._retry = true; // Tandai permintaan telah mencoba refresh
      try {
        await authService.refresh(); // Panggil refresh token
        // Ulangi permintaan asli dengan token baru
        return api(error.config);
      } catch (refreshError) {
        console.error("Gagal refresh token:", refreshError);
        // Bersihkan data autentikasi jika refresh gagal
        // Jangan panggil logout di sini untuk menghindari loop
        return Promise.reject(
          new Error("Sesi telah berakhir, silakan login kembali"),
        );
      }
    }

    return Promise.reject(
      new Error(error.response?.data?.message || "Terjadi kesalahan"),
    );
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
    csrfFetched = false;
    csrfTokenValue = null;
    try {
      console.log("🚪 Logging out...");
      const response = await api.post("/auth/logout");
      console.log("✅ Logout response:", response);
      return response.data;
    } catch (error) {
      // Jika logout gagal, tetap bersihkan state lokal
      console.log("Logout failed, but clearing local state:", error);
      return null;
    }
  },
  async refresh() {
    console.log("🔄 Refreshing token...");
    const response = await api.post("/auth/refresh");
    console.log("✅ Refresh response:", response);
    return response.data;
  },
  async login(data: any) {
    console.log("🔐 Login attempt with data:", { email: data.email, password: "***" });
    
    // Ensure CSRF token is fetched before login
    if (!csrfFetched) {
      console.log("🔐 Fetching CSRF token for login...");
      await fetchCsrfToken();
    }
    
    const response = await api.post("/auth/login", data);
    console.log("✅ Login response:", response);
    
    // Check if cookies were set
    if (typeof document !== "undefined") {
      const cookies = document.cookie;
      console.log("🍪 Cookies after login:", cookies);
      
      if (!cookies.includes("jwt")) {
        console.warn("⚠️ JWT cookie not found after login!");
      } else {
        console.log("✅ JWT cookie found after login");
      }
    }
    
    return response.data;
  },
};

export default api;
