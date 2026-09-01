import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api/",
});

api.interceptors.request.use((config) => {
  // Login API does not need access token
  if (config.url === "accounts/login/") {
    return config;
  }

  const token = localStorage.getItem("access");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// ===============================
// RESPONSE INTERCEPTOR
// ===============================

api.interceptors.response.use(
  (response) => response,

  (error) => {
    // Don't redirect when login itself returns 401
    if (
      error.response?.status === 401 &&
      !error.config?.url?.includes("accounts/login/")
    ) {
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");

      window.location.href = "/";
    }

    return Promise.reject(error);
  },
);

export default api;
