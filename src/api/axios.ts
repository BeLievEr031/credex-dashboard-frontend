import axios from "axios";

const API_BASE_URL = "https://credex-dashboard-backend.onrender.com/api";

const axiosInstance = axios.create({
    baseURL: "https://credex-dashboard-backend.onrender.com/api",
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

// Response interceptor for handling 401 errors (token refresh)
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // If the error is 401 and not already retried
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // Call refresh-token endpoint
                await axios.post(
                    `${API_BASE_URL}/auth/refresh-token`,
                    {},
                    { withCredentials: true }
                );

                // Retry the original request
                return axiosInstance(originalRequest);
            } catch (refreshError) {
                // If refresh token also fails, redirect or handle as logout
                console.error("Refresh token expired or invalid", refreshError);
                // We can't use window.location.href here if we want a smoother SPA experience,
                // but for a hard reset, it works. Better to handle in context.
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;
