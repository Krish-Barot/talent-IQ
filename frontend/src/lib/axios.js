import axios from "axios";
import { getToken } from "@clerk/clerk-react";

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true // by adding this field browser will send the cookies to server automatically on every single request
});

// Add request interceptor to include Clerk token in headers
axiosInstance.interceptors.request.use(async (config) => {
    try {
        const token = await getToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    } catch (error) {
        console.error("Error getting token:", error);
    }
    return config;
});

export default axiosInstance;
