
import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        Accept: "application/json",
    },
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("news_token");

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            const isAuthRequest =
                error.config?.url?.includes("/auth/login") ||
                error.config?.url?.includes("/auth/register");

            if (!isAuthRequest && localStorage.getItem("news_token")) {
                localStorage.removeItem("news_token");
                localStorage.removeItem("news_user");

                window.dispatchEvent(
                    new Event("auth:unauthorized")
                );
            }
        }

        return Promise.reject(error);
    }
);

export default api;
