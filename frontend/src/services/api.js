import axios from "axios";
import { notifySessionEnded } from "./sessionEvents.js";

const renderApiHost = import.meta.env.VITE_API_HOST;
const baseURL = import.meta.env.VITE_API_URL
  || (renderApiHost ? `https://${renderApiHost}/api` : "http://localhost:8000/api");
let accessToken = "";
let refreshPromise = null;

const api = axios.create({
  baseURL,
  timeout: 10000,
  withCredentials: true
});

export const setAccessToken = (token) => {
  accessToken = token || "";
};

export const clearAccessToken = () => {
  accessToken = "";
};

export const renewSession = async () => {
  if (!refreshPromise) {
    refreshPromise = axios.post(`${baseURL}/auth/refresh`, {}, {
      timeout: 10000,
      withCredentials: true
    }).then((response) => {
      const data = response.data.data;
      setAccessToken(data.token);
      return data;
    }).finally(() => {
      refreshPromise = null;
    });
  }

  return refreshPromise;
};

api.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const request = error.config;
    const requestUrl = String(request?.url || "");
    const isAuthRequest = ["/auth/login", "/auth/refresh", "/auth/logout"]
      .some((path) => requestUrl.includes(path));
    const hadSession = localStorage.getItem("sessionActive") === "true";

    if (error.response?.status === 401 && request && !request._sessionRetry && !isAuthRequest && hadSession) {
      request._sessionRetry = true;
      try {
        const data = await renewSession();
        request.headers.Authorization = `Bearer ${data.token}`;
        return api(request);
      } catch {
        clearAccessToken();
        notifySessionEnded("expired");
      }
    }

    return Promise.reject(error);
  }
);

export const getApiError = (error, fallback = "No se pudo completar la operacion") =>
  error.response?.data?.errors?.[0] || error.response?.data?.message || fallback;

export default api;
