import axios from "axios";

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true // This ensures cookies (including Clerk session cookies) are sent with requests
});

export default axiosInstance;
