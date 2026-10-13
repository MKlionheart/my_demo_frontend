
import { api } from '../lib/axios';

export interface RegisterPayload {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

export interface LoginPayload {
    email: string;
    password: string;
}

export interface AuthUser {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    role: {
        id: number;
        name: string;
    };
}

export interface LoginResponse {
    accessToken: string;
    tokenType: string;
    expiresIn: number;
    user: AuthUser;
}

export interface ProfileResponse {
    userId: number;
    email: string;
    roleId: number;
}

export interface AdminUser {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    role: {
        id: number;
        name: string;
    };
    isActive: boolean;
    createdAt: string;
}

export async function registerUser(payload: RegisterPayload) {
    const response = await api.post('/auth/register', payload);
    return response.data;
}

export async function loginUser(
    payload: LoginPayload,
): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>(
        '/auth/login',
        payload,
    );

    return response.data;
}

export async function getProfile(): Promise<ProfileResponse> {
    const response = await api.get<ProfileResponse>('/auth/profile');
    return response.data;
}

export async function getAllUsers(): Promise<AdminUser[]> {
    const response = await api.get<AdminUser[]>('/auth/users');
    return response.data;
}


