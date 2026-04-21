import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import dayjs from 'dayjs';

import { Button, Group, Paper, Stack, Text, Title } from '@mantine/core';

import { cancelBookingPayment } from '../../features/apartments/api';
import {
    type ActiveBookingDraft,
    buildBookingResumePath,
    clearActiveBookingDraft,
} from '../../features/booking/storage';
import classes from './ActiveBookingNotice.module.css';

interface ActiveBookingNoticeProps {
    booking: ActiveBookingDraft;
    onCleared: () => void;
}

export const ActiveBookingNotice = ({ booking, onCleared }: ActiveBookingNoticeProps) => {
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const cancelMutation = useMutation({
        mutationFn: () => cancelBookingPayment(booking.bookingId),
        onSuccess: () => {
            clearActiveBookingDraft();
            setErrorMessage(null);
            onCleared();
        },
        onError: () => {
            setErrorMessage('Could not cancel booking now. Please try again.');
        },
    });

    return (
        <Paper withBorder radius="md" p="lg" className={classes.notice}>
            <Stack gap="sm">
                <Title order={4}>You have an active booking</Title>
                <Text size="sm" c="dimmed">
                    {booking.apartmentName} • {dayjs(booking.startDate).format('DD MMM')} - {dayjs(booking.endDate).format('DD MMM')}
                </Text>
                {booking.reservedUntil && (
                    <Text size="sm" c="dimmed">
                        Reserved until: {dayjs(booking.reservedUntil).format('DD MMM YYYY HH:mm')}
                    </Text>
                )}

                {errorMessage && (
                    <Text size="sm" c="red">{errorMessage}</Text>
                )}

                <Group>
                    <Button component={Link} to={buildBookingResumePath(booking)}>
                        Return to booking
                    </Button>
                    <Button
                        variant="light"
                        color="red"
                        loading={cancelMutation.isPending}
                        onClick={() => cancelMutation.mutate()}
                    >
                        Cancel booking
                    </Button>
                </Group>
            </Stack>
        </Paper>
    );
};
