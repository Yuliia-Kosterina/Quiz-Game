import axios, {
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";

export const axiosInstance = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000"}/api`,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

let accessToken = "";

export function setAccessToken(newToken: string) {
  accessToken = newToken;
}

export function getAccessToken() {
  return accessToken;
}

axiosInstance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (accessToken && !config.headers.Authorization) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const previousRequest = error.config as InternalAxiosRequestConfig & {
      sent?: boolean;
    };

    if (error.response?.status === 403 && previousRequest && !previousRequest.sent) {
      previousRequest.sent = true;

      try {
        const { data } = await axiosInstance.get("/auth/refresh");
        const newToken = data.data.accessToken as string;
        setAccessToken(newToken);
        previousRequest.headers.Authorization = `Bearer ${accessToken}`;
        return axiosInstance(previousRequest);
      } catch (refreshError) {
        setAccessToken("");

        if (typeof window !== "undefined") {
          window.location.href = "/auth";
        }

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);
