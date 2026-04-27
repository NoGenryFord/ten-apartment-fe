import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import {
    Alert,
    Anchor,
    Badge,
    Button,
    Container,
    Group,
    Loader,
    Paper,
    Stack,
    Table,
    Tabs,
    Text,
    Title,
} from '@mantine/core';

import { HeaderSimple } from '../components/headersimple/HeaderSimple';
import { getMyBookings, getMyProfile } from '../features/account/api';
import { clearAuthSession, getAuthUser, isAuthenticated } from '../features/auth/storage';
import { ActiveBookingNotice } from '../components/activeBooking/ActiveBookingNotice';
import { getActiveBookingDraft } from '../features/booking/storage';

const statusColorMap: Record<string, string> = {
    pending: 'yellow',
    confirmed: 'teal',
    canceled: 'red',
    expired: 'gray',
};

export const Account = () => {
    const localUser = useMemo(() => getAuthUser(), []);
    const loggedIn = isAuthenticated();
    const [activeBooking, setActiveBooking] = useState(getActiveBookingDraft());

    const profileQuery = useQuery({
        queryKey: ['account-profile'],
        queryFn: getMyProfile,
        enabled: loggedIn,
        retry: false,
    });

    const bookingsQuery = useQuery({
        queryKey: ['account-bookings'],
        queryFn: getMyBookings,
        enabled: loggedIn,
        retry: false,
    });

    if (!loggedIn) {
        return (
            <Container size="xl" py="xl">
                <HeaderSimple />
                <Paper withBorder p="xl" radius="md">
                    <Title order={2} mb="sm">User account</Title>
                    <Text c="dimmed" mb="lg">
                        You are not logged in yet. Create a reservation to auto-login and open your account.
                    </Text>
                    <Button component={Link} to="/" variant="light">Back to apartments</Button>
                </Paper>
            </Container>
        );
    }

    if (profileQuery.isLoading || bookingsQuery.isLoading) {
        return (
            <Container size="xl" py="xl">
                <HeaderSimple />
                <Paper withBorder p="xl" radius="md">
                    <Group justify="center"><Loader /></Group>
                </Paper>
            </Container>
        );
    }

    const hasError = profileQuery.isError || bookingsQuery.isError;

    return (
        <Container size="xl" py="xl">
            <HeaderSimple />

            <Anchor component={Link} to="/" c="dimmed" size="sm" mb="md" display="block">
                ← Back to apartments
            </Anchor>

            <Paper withBorder p="xl" radius="md" mb="xl">
                <Group justify="space-between" align="flex-start">
                    <div>
                        <Title order={2}>My account</Title>
                        <Text c="dimmed" mt={4}>
                            {profileQuery.data?.email ?? localUser?.email}
                        </Text>
                    </div>
                    <Button
                        variant="light"
                        color="red"
                        onClick={() => {
                            clearAuthSession();
                            window.location.href = '/';
                        }}
                    >
                        Logout
                    </Button>
                </Group>
            </Paper>

            {hasError && (
                <Alert color="red" title="Could not load account data" mb="md">
                    Please try again a bit later.
                </Alert>
            )}

            {activeBooking && (
                <ActiveBookingNotice
                    booking={activeBooking}
                    onCleared={() => setActiveBooking(null)}
                />
            )}

            <Tabs defaultValue="history">
                <Tabs.List>
                    <Tabs.Tab value="history">Booking history</Tabs.Tab>
                    <Tabs.Tab value="settings">Settings</Tabs.Tab>
                </Tabs.List>

                <Tabs.Panel value="history" pt="md">
                    <Paper withBorder p="lg" radius="md">
                        <Title order={4} mb="md">My reservations</Title>

                        {!bookingsQuery.data || bookingsQuery.data.length === 0 ? (
                            <Text c="dimmed">You do not have any bookings yet.</Text>
                        ) : (
                            <Table striped highlightOnHover withTableBorder>
                                <Table.Thead>
                                    <Table.Tr>
                                        <Table.Th>Apartment</Table.Th>
                                        <Table.Th>Dates</Table.Th>
                                        <Table.Th>Total</Table.Th>
                                        <Table.Th>Status</Table.Th>
                                        <Table.Th></Table.Th>
                                    </Table.Tr>
                                </Table.Thead>
                                <Table.Tbody>
                                    {bookingsQuery.data.map((booking) => (
                                        <Table.Tr key={booking.id}>
                                            <Table.Td>
                                                {booking.apartment_id && booking.apartment_name ? (
                                                    <Anchor component={Link} to={`/apartment/${booking.apartment_id}`}>
                                                        {booking.apartment_name}
                                                    </Anchor>
                                                ) : 'Unknown apartment'}
                                            </Table.Td>
                                            <Table.Td>
                                                {booking.check_in && booking.check_out
                                                    ? `${dayjs(booking.check_in).format('DD MMM YYYY')} - ${dayjs(booking.check_out).format('DD MMM YYYY')}`
                                                    : 'Dates unavailable'}
                                            </Table.Td>
                                            <Table.Td>{booking.total_price} Kč</Table.Td>
                                            <Table.Td>
                                                <Badge color={statusColorMap[booking.status] ?? 'gray'} variant="light">
                                                    {booking.status}
                                                </Badge>
                                            </Table.Td>
                                            <Table.Td>
                                                {booking.status === 'pending' && booking.apartment_id && booking.check_in && booking.check_out && (
                                                    <Button
                                                        component={Link}
                                                        to={`/booking?apartmentId=${booking.apartment_id}&start=${booking.check_in}&end=${booking.check_out}`}
                                                        size="xs"
                                                        variant="light"
                                                    >
                                                        Resume
                                                    </Button>
                                                )}
                                            </Table.Td>
                                        </Table.Tr>
                                    ))}
                                </Table.Tbody>
                            </Table>
                        )}
                    </Paper>
                </Tabs.Panel>

                <Tabs.Panel value="settings" pt="md">
                    <Paper withBorder p="lg" radius="md">
                        <Title order={4} mb="sm">Settings</Title>
                        <Stack gap="xs">
                            <Text c="dimmed">This section is prepared for future profile settings.</Text>
                            <Text size="sm" c="dimmed">
                                We will add personal data editing, notifications and password management here later.
                            </Text>
                        </Stack>
                    </Paper>
                </Tabs.Panel>
            </Tabs>
        </Container>
    );
};
