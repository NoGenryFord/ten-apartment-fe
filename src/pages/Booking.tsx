import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';

import {
    Alert,
    Anchor,
    Button,
    Container,
    Grid,
    Group,
    Loader,
    Paper,
    Stack,
    Text,
    TextInput,
    Title,
} from '@mantine/core';

import { HeaderSimple } from '../components/headersimple/HeaderSimple';
import {
    cancelBookingPayment,
    createBooking,
    getApartmentById,
    startBookingPayment,
    submitBookingPaymentResult,
} from '../features/apartments/api';
import {
    clearActiveBookingDraft,
    getActiveBookingDraft,
    saveActiveBookingDraft,
} from '../features/booking/storage';
import classes from './Booking.module.css';

const isValidDate = (value: string | null): value is string => {
    if (!value) return false;
    return dayjs(value, 'YYYY-MM-DD', true).isValid();
};

export const Booking = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const apartmentId = Number(searchParams.get('apartmentId'));
    const startDate = searchParams.get('start');
    const endDate = searchParams.get('end');

    const hasValidQuery = Number.isFinite(apartmentId)
        && apartmentId > 0
        && isValidDate(startDate)
        && isValidDate(endDate)
        && dayjs(startDate).isBefore(dayjs(endDate));

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [activeBookingId, setActiveBookingId] = useState<number | null>(null);
    const [paymentStateMessage, setPaymentStateMessage] = useState<string | null>(null);

    useEffect(() => {
        const savedBooking = getActiveBookingDraft();
        if (!savedBooking) return;

        // Restore booking id only for the same apartment/date selection.
        if (
            savedBooking.apartmentId === apartmentId
            && savedBooking.startDate === startDate
            && savedBooking.endDate === endDate
        ) {
            setActiveBookingId(savedBooking.bookingId);
        }
    }, [apartmentId, endDate, startDate]);

    const { data: apartment, isLoading, isError } = useQuery({
        queryKey: ['booking-apartment', apartmentId],
        queryFn: () => getApartmentById(apartmentId),
        enabled: hasValidQuery,
    });

    const { nights } = useMemo(() => {
        if (!hasValidQuery || !startDate || !endDate) return { nights: 0 };
        return {
            nights: dayjs(endDate).diff(dayjs(startDate), 'day'),
        };
    }, [endDate, hasValidQuery, startDate]);

    const startPaymentMutation = useMutation({
        mutationFn: (bookingId: number) => startBookingPayment(bookingId, {
            email,
            first_name: firstName,
            last_name: lastName,
        }),
        onSuccess: (result) => {
            setActiveBookingId(result.booking_id);
            if (apartment && startDate && endDate) {
                saveActiveBookingDraft({
                    bookingId: result.booking_id,
                    apartmentId,
                    apartmentName: apartment.name,
                    startDate,
                    endDate,
                    reservedUntil: result.reserved_until,
                    status: result.status,
                });
            }
        },
    });

    const cancelBookingMutation = useMutation({
        mutationFn: (bookingId: number) => cancelBookingPayment(bookingId),
        onSuccess: () => {
            clearActiveBookingDraft();
            setActiveBookingId(null);
            setPaymentStateMessage(null);
            startPaymentMutation.reset();
        },
        onError: (error) => {
            const fallback = 'Could not cancel this booking now.';
            const message = error instanceof Error ? error.message : fallback;
            setErrorMessage(message || fallback);
        },
    });

    const completePaymentMutation = useMutation({
        mutationFn: ({
            bookingId,
            result,
        }: {
            bookingId: number;
            result: 'success' | 'failed';
        }) => submitBookingPaymentResult(bookingId, result),
        onSuccess: (result) => {
            clearActiveBookingDraft();
            setActiveBookingId(null);
            setErrorMessage(null);
            setPaymentStateMessage(
                result.status === 'confirmed'
                    ? `Payment successful. Booking #${result.booking_id} is confirmed.`
                    : `Payment failed. Booking #${result.booking_id} was canceled.`,
            );
            startPaymentMutation.reset();
        },
        onError: (error) => {
            const fallback = 'Could not complete payment right now.';
            const message = error instanceof Error ? error.message : fallback;
            setErrorMessage(message || fallback);
        },
    });

    const createBookingMutation = useMutation({
        mutationFn: () => createBooking({
            apartment_id: apartmentId,
            start_date: startDate!,
            end_date: endDate!,
        }),
        onSuccess: async (createdBooking) => {
            try {
                setErrorMessage(null);
                await startPaymentMutation.mutateAsync(createdBooking.booking_id);
            } catch (error) {
                const fallback = 'Booking created, but payment start failed. Please try again.';
                const message = error instanceof Error ? error.message : fallback;
                setErrorMessage(message || fallback);
            }
        },
        onError: (error) => {
            const fallback = 'Could not create booking. Please check selected dates and try again.';
            const message = error instanceof Error ? error.message : fallback;
            setErrorMessage(message || fallback);
        },
    });

    if (!hasValidQuery) {
        const savedBooking = getActiveBookingDraft();

        return (
            <Container size="xl" py="xl">
                <HeaderSimple />
                <Paper withBorder p="xl" radius="md" className={classes.pageCard}>
                    <Title order={2} mb="md">Invalid booking link</Title>
                    <Text c="dimmed" mb="lg">
                        Booking page expects apartment ID, check-in date, and check-out date.
                    </Text>
                    <Group>
                        <Button component={Link} to="/" variant="light">Back to apartments</Button>
                        {savedBooking && (
                            <Button
                                component={Link}
                                to={`/booking?apartmentId=${savedBooking.apartmentId}&start=${savedBooking.startDate}&end=${savedBooking.endDate}`}
                            >
                                Open active booking
                            </Button>
                        )}
                    </Group>
                </Paper>
            </Container>
        );
    }

    if (isLoading) {
        return (
            <Container size="xl" py="xl">
                <HeaderSimple />
                <Paper withBorder p="xl" radius="md" className={classes.pageCard}>
                    <Group justify="center"><Loader /></Group>
                </Paper>
            </Container>
        );
    }

    if (isError || !apartment) {
        return (
            <Container size="xl" py="xl">
                <HeaderSimple />
                <Paper withBorder p="xl" radius="md" className={classes.pageCard}>
                    <Title order={2} mb="md">Apartment not found</Title>
                    <Text c="dimmed" mb="lg">Could not load apartment details for booking.</Text>
                    <Button component={Link} to="/" variant="light">Back to apartments</Button>
                </Paper>
            </Container>
        );
    }

    const isSubmitting = createBookingMutation.isPending || startPaymentMutation.isPending;
    const paymentResult = startPaymentMutation.data;
    const canCancelBookingId = activeBookingId ?? paymentResult?.booking_id;

    return (
        <Container size="xl" py="xl">
            <HeaderSimple />

            <Anchor component={Link} to={`/apartment/${apartmentId}`} c="dimmed" size="sm" mb="md" display="block">
                ← Back to apartment
            </Anchor>

            <Grid gutter="xl">
                <Grid.Col span={{ base: 12, md: 7 }}>
                    <Paper withBorder p="xl" radius="md" className={classes.pageCard}>
                        <Title order={2} mb="sm">Booking details</Title>
                        <Text size="lg" fw={600} mb="lg">{apartment.name}</Text>

                        <Stack gap="sm">
                            <Group justify="space-between">
                                <Text c="dimmed">Check-in</Text>
                                <Text fw={500}>{dayjs(startDate).format('DD MMM YYYY')}</Text>
                            </Group>
                            <Group justify="space-between">
                                <Text c="dimmed">Check-out</Text>
                                <Text fw={500}>{dayjs(endDate).format('DD MMM YYYY')}</Text>
                            </Group>
                            <Group justify="space-between">
                                <Text c="dimmed">Nights</Text>
                                <Text fw={500}>{nights}</Text>
                            </Group>
                            {apartment.total_price && (
                                <Group justify="space-between">
                                    <Text c="dimmed">Estimated total</Text>
                                    <Text fw={700}>{apartment.total_price} Kč</Text>
                                </Group>
                            )}
                        </Stack>
                    </Paper>
                </Grid.Col>

                <Grid.Col span={{ base: 12, md: 5 }}>
                    <Paper withBorder p="xl" radius="md" className={classes.pageCard}>
                        <Title order={3} mb="md">Guest information</Title>

                        <Stack>
                            <TextInput
                                label="First name"
                                placeholder="John"
                                value={firstName}
                                onChange={(event) => setFirstName(event.currentTarget.value)}
                                required
                            />
                            <TextInput
                                label="Last name"
                                placeholder="Doe"
                                value={lastName}
                                onChange={(event) => setLastName(event.currentTarget.value)}
                                required
                            />
                            <TextInput
                                label="Email"
                                placeholder="john@example.com"
                                value={email}
                                onChange={(event) => setEmail(event.currentTarget.value)}
                                required
                            />

                            {errorMessage && (
                                <Alert color="red" title="Booking error">
                                    {errorMessage}
                                </Alert>
                            )}

                            {paymentResult && (
                                <Alert color="green" title="Booking created">
                                    <Stack gap={4}>
                                        <Text size="sm">Booking ID: {paymentResult.booking_id}</Text>
                                        <Text size="sm">Status: {paymentResult.status}</Text>
                                        <Text size="sm">Payment URL: {paymentResult.payment_url}</Text>
                                    </Stack>
                                </Alert>
                            )}

                            {paymentStateMessage && (
                                <Alert color="green" title="Payment result">
                                    {paymentStateMessage}
                                </Alert>
                            )}

                            {!canCancelBookingId && (
                                <Button
                                    fullWidth
                                    size="md"
                                    loading={isSubmitting}
                                    disabled={!firstName.trim() || !lastName.trim() || !email.trim()}
                                    onClick={() => createBookingMutation.mutate()}
                                >
                                    Confirm booking
                                </Button>
                            )}

                            {canCancelBookingId && (
                                <>
                                    <Button
                                        color="teal"
                                        fullWidth
                                        loading={completePaymentMutation.isPending}
                                        onClick={() => completePaymentMutation.mutate({ bookingId: canCancelBookingId, result: 'success' })}
                                    >
                                        Pay now (test success)
                                    </Button>

                                    <Button
                                        variant="light"
                                        color="orange"
                                        fullWidth
                                        loading={completePaymentMutation.isPending}
                                        onClick={() => completePaymentMutation.mutate({ bookingId: canCancelBookingId, result: 'failed' })}
                                    >
                                        Simulate payment fail
                                    </Button>

                                </>
                            )}

                            {canCancelBookingId && (
                                <Button
                                    variant="light"
                                    color="red"
                                    fullWidth
                                    loading={cancelBookingMutation.isPending || completePaymentMutation.isPending}
                                    onClick={() => cancelBookingMutation.mutate(canCancelBookingId)}
                                >
                                    Cancel this booking
                                </Button>
                            )}

                            <Button
                                variant="light"
                                fullWidth
                                onClick={() => navigate(`/apartment/${apartmentId}`)}
                            >
                                Change dates
                            </Button>
                        </Stack>
                    </Paper>
                </Grid.Col>
            </Grid>
        </Container>
    );
};
