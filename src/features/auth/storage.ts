export interface AuthUser {
    id: number;
    email: string;
    first_name?: string;
    last_name?: string;
}

export interface AuthSession {
    access: string;
    refresh: string;
    user: AuthUser;
}

const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';
const AUTH_USER_KEY = 'authUser';

export const saveAuthSession = (session: AuthSession): void => {
    localStorage.setItem(ACCESS_TOKEN_KEY, session.access);
    localStorage.setItem(REFRESH_TOKEN_KEY, session.refresh);
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(session.user));
};

export const clearAuthSession = (): void => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(AUTH_USER_KEY);
};

export const getAuthUser = (): AuthUser | null => {
    const raw = localStorage.getItem(AUTH_USER_KEY);
    if (!raw) return null;

    try {
        return JSON.parse(raw) as AuthUser;
    } catch {
        clearAuthSession();
        return null;
    }
};

export const isAuthenticated = (): boolean => Boolean(localStorage.getItem(ACCESS_TOKEN_KEY));
