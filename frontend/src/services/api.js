import axios from "axios";
import { notifySessionEnded } from "./sessionEvents.js";

const renderApiHost = import.meta.env.VITE_API_HOST;

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL
    || (renderApiHost ? `https://${renderApiHost}/api` : "http://localhost:8000/api"),
  timeout: 10000
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isLoginRequest = String(error.config?.url || "").includes("/auth/login");
    const hadSession = Boolean(localStorage.getItem("token"));

    if (error.response?.status === 401 && !isLoginRequest && hadSession) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      notifySessionEnded("expired");
    }

    return Promise.reject(error);
  }
);

export const getApiError = (error, fallback = "No se pudo completar la operacion") =>
  error.response?.data?.errors?.[0] || error.response?.data?.message || fallback;

export default api;
