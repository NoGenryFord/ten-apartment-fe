import api from '../../api/api';
import type { Apartment, Schedule } from '../../types';
import type { AuthSession } from '../auth/storage';

interface CreateBookingPayload {
    apartment_id: number;
    start_date: string;
    end_date: string;
}

interface CreateBookingResponse {
    message: string;
    booking_id: number;
    total_price: string;
    reserved_until: string;
    status: string;
}

interface StartPaymentPayload {
    email?: string;
    first_name?: string;
    last_name?: string;
    password?: string;
}

interface StartPaymentResponse {
    message: string;
    payment_url: string;
    booking_id: number;
    status: string;
    reserved_until: string | null;
    auth?: AuthSession;
}

interface CancelBookingResponse {
    message: string;
    booking_id: number;
    status: string;
}

interface PaymentResultResponse {
    message: string;
    booking_id: number;
    status: string;
}

export const getApartments = async (): Promise<Apartment[]> => {
    const { data } = await api.get<Apartment[]>('apartments/');
    return data;
};

export const getApartmentById = async (id: number): Promise<Apartment> => {
    const { data } = await api.get<Apartment>(`apartments/${id}/`);
    return data;
};

export const getApartmentSchedule = async (id: number): Promise<Schedule[]> => {
    const { data } = await api.get<Schedule[]>('schedules/', {
        params: { apartment_id: id }
    });
    return data;
};

export const searchApartments = async (start: string, end: string): Promise<Apartment[]> => {
    const { data } = await api.get<Apartment[]>(`apartments/search/`, {
        params: { start_date: start, end_date: end }
    });
    return data;
};

export const createBooking = async (payload: CreateBookingPayload): Promise<CreateBookingResponse> => {
    const { data } = await api.post<CreateBookingResponse>('bookings/', payload);
    return data;
};

export const startBookingPayment = async (
    bookingId: number,
    payload: StartPaymentPayload,
): Promise<StartPaymentResponse> => {
    const { data } = await api.post<StartPaymentResponse>(`bookings/${bookingId}/start_payment/`, payload);
    return data;
};

export const cancelBookingPayment = async (bookingId: number): Promise<CancelBookingResponse> => {
    const { data } = await api.post<CancelBookingResponse>(`bookings/${bookingId}/cancel_payment/`);
    return data;
};

export const submitBookingPaymentResult = async (
    bookingId: number,
    result: 'success' | 'failed',
): Promise<PaymentResultResponse> => {
    const { data } = await api.post<PaymentResultResponse>(`bookings/${bookingId}/payment_result/`, { result });
    return data;
};

export interface InquiryPayload {
    name: string;
    contact: string;
    message: string;
    apartment?: number | null;
}

export const submitInquiry = async (payload: InquiryPayload): Promise<{ id: number }> => {
    const { data } = await api.post<{ id: number }>('inquiries/', payload);
    return data;
};