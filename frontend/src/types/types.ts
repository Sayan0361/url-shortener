export interface SignupData {
    firstname: string;
    lastname?: string;
    email: string;
    password: string;
}

export interface LoginData {
    email: string;
    password: string;
}

export interface ShortenData {
    url: string;
    code?: string;
}

export interface VerificationCodeData {
    email: string;
    providedCode: number;
}

export interface ChangePasswordData {
    oldPassword: string;
    newPassword: string;
}

export interface ForgotPasswordData {
    email: string;
    providedCode: number;
    newPassword: string;
}

export interface ChangeNameData {
    firstname: string;
    lastname?: string;
}

