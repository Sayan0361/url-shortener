import axios from "axios";

const BASE_URL =
    import.meta.env.MODE === "development"
        ? "http://localhost:5000"
        : import.meta.env.VITE_API_URL;


export const axiosInstance = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
    headers: { "Content-Type": "application/json" },
});

