import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    createShortUrl,
    getAllUserUrls,
    deleteUrl,
    updateUrl,
    getAnalytics,
    generateQRCode,
} from "@/lib/url.api";
import type { ShortenData } from "@/types/types";

// get all urls
export const useUserUrls = () => {
    return useQuery({
        queryKey: ["urls"],
        queryFn: getAllUserUrls,
    });
};

// create short url
export const useCreateShortUrl = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: ShortenData) => createShortUrl(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["urls"] });
        },
    });
};

// delete short url
export const useDeleteUrl = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => deleteUrl(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["urls"] });
        },
    });
};

// update url
export const useUpdateUrl = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, newURL }: { id: string; newURL: string }) => updateUrl(id, newURL),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["urls"] });
        },
    });
};

// get analytics
export const useAnalytics = (id: string) => {
    return useQuery({
        queryKey: ["analytics", id],
        queryFn: () => getAnalytics(id),
        enabled: !!id,
    });
};

// generate QR
export const useQRCode = (shortCode: string) => {
    return useQuery({
        queryKey: ["qrcode", shortCode],
        queryFn: () => generateQRCode(shortCode),
        enabled: !!shortCode,
    });
};
