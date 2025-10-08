import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    signup,
    login,
    logout,
    getUserInfo,
    changeName,
    changePassword,
    sendVerificationCode,
    verifyVerificationCode,
    sendForgotPasswordCode,
    verifyForgotPasswordCode,
} from "@/lib/user.api";
import type {
    SignupData,
    LoginData,
    ChangeNameData,
    ChangePasswordData,
    VerificationCodeData,
    ForgotPasswordData,
} from "../types/types";
import { toast } from "react-hot-toast";

// -------------------- Get User Info --------------------
export const useUserInfo = () => {
    return useQuery({
        queryKey: ["userInfo"],
        queryFn: getUserInfo,
        staleTime: 1000 * 60 * 5, // 5 min
    });
};

// -------------------- Signup/Login/Logout --------------------
export const useSignup = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: SignupData) => signup(data),
        onSuccess: () => {
            toast.success("Account created successfully!");
            queryClient.invalidateQueries({ queryKey: ["userInfo"] });
        },
        onError: (err: any) => {
            const message =
                err?.response?.data?.message ||
                err?.message ||
                "Signup failed. Please try again.";
            toast.error(message);
        },
    });
};

export const useLogin = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: LoginData) => login(data),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["userInfo"] }),
    });
};

export const useLogout = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: logout,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["userInfo"] }),
    });
};

// -------------------- Change Info --------------------
export const useChangeName = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: ChangeNameData) => changeName(data),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["userInfo"] }),
    });
};

export const useChangePassword = () => {
    return useMutation({
        mutationFn: (data: ChangePasswordData) => changePassword(data),
    });
};

// -------------------- Verification Code --------------------
export const useSendVerificationCode = () => {
    return useMutation({
        mutationFn: (email: string) => sendVerificationCode(email),
    });
};

export const useVerifyVerificationCode = () => {
    return useMutation({
        mutationFn: (data: VerificationCodeData) => verifyVerificationCode(data),
    });
};

// -------------------- Forgot Password --------------------
export const useSendForgotPasswordCode = () => {
    return useMutation({
        mutationFn: (email: string) => sendForgotPasswordCode(email),
    });
};

export const useVerifyForgotPasswordCode = () => {
    return useMutation({
        mutationFn: (data: ForgotPasswordData) => verifyForgotPasswordCode(data),
    });
};
