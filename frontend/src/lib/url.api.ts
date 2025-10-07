import { axiosInstance } from "./axios";
import type { ShortenData } from "../types/types";

// Helper to handle errors consistently
const handleError = (error: any) => {
    console.error("API Error:", error.response?.data || error.message);
    throw error.response?.data || { message: "Something went wrong. Please try again." };
};

// Create a short URL
export const createShortUrl = async (data: ShortenData) => {
    try {
        const response = await axiosInstance.post("/shorten", data);
        return response.data;
    } catch (error) {
        handleError(error);
    }
};

// Get all created short URLs
export const getAllUserUrls = async () => {
    try {
        const response = await axiosInstance.get("/codes");
        return response.data;
    } catch (error) {
        handleError(error);
    }
};

// Delete a short URL
export const deleteUrl = async (id: string) => {
    try {
        const response = await axiosInstance.delete(`/delete/${id}`);
        return response.data;
    } catch (error) {
        handleError(error);
    }
};

// Update a short URL
export const updateUrl = async (id: string, newURL: string) => {
    try {
        const response = await axiosInstance.put(`/update/${id}`, { newURL });
        return response.data;
    } catch (error) {
        handleError(error);
    }
};

// Get analytics for a URL
export const getAnalytics = async (id: string) => {
    try {
        const response = await axiosInstance.get(`/analytics/${id}`);
        return response.data;
    } catch (error) {
        handleError(error);
    }
};

// Generate QR code for a short URL
export const generateQRCode = async (shortCode: string) => {
    try {
        const response = await axiosInstance.get(`/qrcode/${shortCode}`, {
            responseType: "arraybuffer", // important for images
        });
        return response.data;
    } catch (error) {
        handleError(error);
    }
};

// Redirect to target URL (public)
export const redirectToTarget = async (shortCode: string) => {
    try {
        const response = await axiosInstance.get(`/${shortCode}`);
        return response.data;
    } catch (error) {
        handleError(error);
    }
};
