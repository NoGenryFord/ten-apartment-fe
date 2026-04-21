export interface ActiveBookingDraft {
    bookingId: number;
    apartmentId: number;
    apartmentName: string;
    startDate: string;
    endDate: string;
    reservedUntil: string | null;
    status: string;
}

const STORAGE_KEY = 'activeBookingDraft';

export const saveActiveBookingDraft = (draft: ActiveBookingDraft): void => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
};

export const clearActiveBookingDraft = (): void => {
    localStorage.removeItem(STORAGE_KEY);
};

export const getActiveBookingDraft = (): ActiveBookingDraft | null => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    try {
        const parsed = JSON.parse(raw) as ActiveBookingDraft;
        if (!parsed.bookingId || !parsed.apartmentId || !parsed.startDate || !parsed.endDate) {
            clearActiveBookingDraft();
            return null;
        }

        // If reserved time is already in the past, the local draft is stale.
        if (parsed.reservedUntil && Date.parse(parsed.reservedUntil) < Date.now()) {
            clearActiveBookingDraft();
            return null;
        }

        return parsed;
    } catch {
        clearActiveBookingDraft();
        return null;
    }
};

export const buildBookingResumePath = (draft: ActiveBookingDraft): string => {
    const params = new URLSearchParams({
        apartmentId: String(draft.apartmentId),
        start: draft.startDate,
        end: draft.endDate,
    });

    return `/booking?${params.toString()}`;
};
