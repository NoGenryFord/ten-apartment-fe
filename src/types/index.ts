export interface ApartmentType {
    id: number;
    name: string;
}

export interface ApartmentPhoto {
    id: number;
    photo: string;
}

export interface ApartmentVideo {
    id: number;
    video: string;
}

export interface Apartment {
    id: number;
    name: string;
    type: ApartmentType;
    description: string;
    photos: ApartmentPhoto[];
    videos: ApartmentVideo[];
    url_obj: string;
    total_price?: string;
    // Optional fields — add to Django serializer fields[] to enable
    max_guests?: number;
    address?: string;
    latitude?: number | string;
    longitude?: number | string;
}

export interface Schedule {
    id: number;
    date: string;
    apartment: number;
    price_value: string;
    status: 'available' | 'reserved' | 'booked' | 'maintenance';
}
