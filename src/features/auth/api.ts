import api from '../../api/api';
import type { AuthSession, AuthUser } from './storage';

interface TokenResponse {
    access: string;
    refresh: string;
}

interface RegisterPayload {
    email: string;
    first_name: string;
    last_name: string;
    password: string;
    password_confirm: string;
}

export const loginWithEmail = async (email: string, password: string): Promise<AuthSession> => {
    const { data: tokenData } = await api.post<TokenResponse>('token/', {
        username: email,
        password,
    });

    const { data: user } = await api.get<AuthUser>('users/me/', {
        headers: {
            Authorization: `Bearer ${tokenData.access}`,
        },
    });

    return {
        access: tokenData.access,
        refresh: tokenData.refresh,
        user,
    };
};

export const registerWithEmail = async (payload: RegisterPayload): Promise<AuthSession> => {
    const { data } = await api.post<AuthSession>('users/register/', payload);
    return data;
};
