import api from '../../api/api';
import type { Apartment } from '../../types';

export const getApartments = async (): Promise<Apartment[]> => {
    const { data } = await api.get<Apartment[]>('apartments/');
    return data;
};

export const searchApartments = async (start: string, end: string): Promise<Apartment[]> => {
    const { data } = await api.get<Apartment[]>(`apartments/search/`, {
        params: { start_date: start, end_date: end }
    });
    return data;
};