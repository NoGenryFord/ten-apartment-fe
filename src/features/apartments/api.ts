import api from '../../api/api';
import type { Apartment, Schedule } from '../../types';

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
        params: { apartment: id }
    });
    return data;
};

export const searchApartments = async (start: string, end: string): Promise<Apartment[]> => {
    const { data } = await api.get<Apartment[]>(`apartments/search/`, {
        params: { start_date: start, end_date: end }
    });
    return data;
};