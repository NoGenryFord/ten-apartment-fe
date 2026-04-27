import api from '../../api/api';
import type { AuthUser } from '../auth/storage';

export interface BookingHistoryItem {
    id: number;
    status: 'pending' | 'confirmed' | 'canceled' | 'expired';
    total_price: string;
    paid: boolean;
    created_at: string;
    apartment_id: number | null;
    apartment_name: string | null;
    check_in: string | null;
    check_out: string | null;
}

export const getMyProfile = async (): Promise<AuthUser> => {
    const { data } = await api.get<AuthUser>('users/me/');
    return data;
};

export const getMyBookings = async (): Promise<BookingHistoryItem[]> => {
    const { data } = await api.get<BookingHistoryItem[]>('users/my_bookings/');
    return data;
};
