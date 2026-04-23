import { useState, useMemo } from 'react';
import { useParams, Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';

import {
    Container, Title, Text, Badge, Group, Stack,
    Grid, Paper, Loader, Center, Anchor, Divider, Button,
} from '@mantine/core';
import { DatePicker } from '@mantine/dates';
import { Carousel } from '@mantine/carousel';
import '@mantine/dates/styles.css';
import '@mantine/carousel/styles.css';

import { HeaderSimple } from '../components/headersimple/HeaderSimple';
import { getApartmentById, getApartmentSchedule } from '../features/apartments/api';
import type { Schedule } from '../types';
import classes from './ApartmentDetail.module.css';

import {ApartmentMap} from "../components/apartamentMap/ApartamentMap";

const parseCoordinate = (value?: number | string): number | null => {
    if (value === undefined || value === null || value === '') return null;
    const parsed = typeof value === 'number' ? value : Number(value);
    return Number.isFinite(parsed) ? parsed : null;
};

export const ApartmentDetail = () => {
    const { id } = useParams<{ id: string }>();
    const apartmentId = Number(id);
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const initialStart = searchParams.get('start');
    const initialEnd = searchParams.get('end');

    const [dateRange, setDateRange] = useState<[string | null, string | null]>([
        initialStart,
        initialEnd,
    ]);

    const { data: apartment, isLoading, isError } = useQuery({
        queryKey: ['apartment', apartmentId],
        queryFn: () => getApartmentById(apartmentId),
        enabled: !!apartmentId,
    });

    const { data: schedules, isLoading: isScheduleLoading } = useQuery({
        queryKey: ['schedule', apartmentId],
        queryFn: () => getApartmentSchedule(apartmentId),
        enabled: !!apartmentId,
    });

    // date string → schedule entry for O(1) lookup
    const scheduleMap = useMemo(() => {
        if (!schedules) return {} as Record<string, Schedule>;
        return Object.fromEntries(schedules.map(s => [s.date, s]));
    }, [schedules]);

    // Total price + nights count for selected range
    const { totalPrice, nights } = useMemo(() => {
        if (!dateRange[0] || !dateRange[1]) return { totalPrice: null, nights: 0 };
        let total = 0;
        let count = 0;
        let current = dayjs(dateRange[0]);
        const end = dayjs(dateRange[1]);
        // checkout day is not charged → iterate while current < end
        while (current.isBefore(end)) {
            const entry = scheduleMap[current.format('YYYY-MM-DD')];
            if (entry?.price_value) total += parseFloat(entry.price_value);
            count++;
            current = current.add(1, 'day');
        }
        return { totalPrice: total, nights: count };
    }, [dateRange, scheduleMap]);

    // ─── Loading / Error states ───────────────────────────────────
    if (isLoading) return <Center h="100vh"><Loader /></Center>;
    if (isError || !apartment) return (
        <Container py="xl">
            <Text c="red">
                Failed to load apartment.{' '}
                <Anchor component={Link} to="/">← Back to apartments</Anchor>
            </Text>
        </Container>
    );

    // Merge photos + videos into one list for the carousel
    const media = [
        ...apartment.photos.map(p => ({ type: 'photo' as const, url: p.photo, key: `p-${p.id}` })),
        ...apartment.videos.map(v => ({ type: 'video' as const, url: v.video, key: `v-${v.id}` })),
    ];

    const latitude = parseCoordinate(apartment.latitude);
    const longitude = parseCoordinate(apartment.longitude);
    const hasCoordinates = latitude !== null && longitude !== null;

    return (
        <Container size="xl" py="xl">
            <HeaderSimple />

            <Anchor component={Link} to="/" c="dimmed" size="sm" my="md" display="block">
                ← Back to apartments
            </Anchor>

            {/* ── Title row ── */}
            <Group mb="xl" align="flex-start">
                <Stack gap={6} style={{ flex: 1 }}>
                    <Group align="center" gap="sm" wrap="wrap">
                        <Title order={1} size="h2">{apartment.name}</Title>
                        <Badge color="blue" variant="light" size="lg">
                            {apartment.type?.name}
                        </Badge>
                    </Group>
                    {apartment.address && (
                        <Text c="dimmed" size="sm">📍 {apartment.address}</Text>
                    )}
                </Stack>
            </Group>

            <Grid gutter="xl">

                {/* ════════ LEFT: media + description ════════ */}
                <Grid.Col span={{ base: 12, md: 7 }}>

                    {/* Photo / Video carousel */}
                    {media.length > 0 ? (
                        <Carousel
                            withIndicators
                            withControls
                            emblaOptions={{ loop: true }}
                            classNames={{
                                root: classes.carousel,
                                control: classes.carouselControl,
                                indicator: classes.carouselIndicator,
                            }}
                            mb="xl"
                        >
                            {media.map(item => (
                                <Carousel.Slide key={item.key}>
                                    {item.type === 'photo' ? (
                                        <img
                                            src={item.url}
                                            alt={apartment.name}
                                            className={classes.mediaItem}
                                        />
                                    ) : (
                                        <video
                                            src={item.url}
                                            controls
                                            className={classes.mediaItem}
                                        />
                                    )}
                                </Carousel.Slide>
                            ))}
                        </Carousel>
                    ) : (
                        <div className={classes.noMedia}>
                            <Text c="dimmed">No photos yet</Text>
                        </div>
                    )}

                    {/* Description */}
                    <Paper p="xl" radius="md" withBorder>
                        <Title order={3} mb="md">About this apartment</Title>
                        <Text c="dimmed" style={{ lineHeight: 1.8, whiteSpace: 'pre-line' }}>
                            {apartment.description}
                        </Text>

                        {/* max_guests / address — visible when backend serializer returns them */}
                        {(apartment.max_guests || apartment.address) && (
                            <>
                                <Divider my="lg" />
                                <Stack gap="xs">
                                    {apartment.max_guests && (
                                        <Group gap="xs">
                                            <Text size="sm" fw={600}>👥 Max guests:</Text>
                                            <Text size="sm" c="dimmed">{apartment.max_guests}</Text>
                                        </Group>
                                    )}
                                    {apartment.address && (
                                        <Group gap="xs">
                                            <Text size="sm" fw={600}>📍 Address:</Text>
                                            <Text size="sm" c="dimmed">{apartment.address}</Text>
                                        </Group>
                                    )}
                                </Stack>
                            </>
                        )}
                    </Paper>

                    <Paper p="xl" radius="md" withBorder mt="xl">
                        <Title order={3} mb="md">Location</Title>
                        {hasCoordinates ? (
                            <ApartmentMap
                                latitude={latitude}
                                longitude={longitude}
                                name={apartment.name}
                                address={apartment.address}
                            />
                        ) : (
                            <Text c="dimmed">Location is not available yet.</Text>
                        )}
                    </Paper>

                </Grid.Col>

                {/* ════════ RIGHT: booking panel ════════ */}
                <Grid.Col span={{ base: 12, md: 5 }}>
                    <Paper p="xl" radius="md" withBorder className={classes.bookingPanel}>
                        <Title order={4} mb="md">Choose dates</Title>

                        {/* Legend */}
                        <Group gap="xl" mb="md" wrap="nowrap">
                            <Group gap={8} align="center">
                                <div className={classes.legendDay} data-variant="normal">15</div>
                                <Text size="xs" c="dimmed">Available</Text>
                            </Group>
                            <Group gap={8} align="center">
                                <div className={classes.legendDay} data-variant="unavailable">15</div>
                                <Text size="xs" c="dimmed">Unavailable</Text>
                            </Group>
                            <Group gap={8} align="center">
                                <div className={classes.legendDay} data-variant="selected">15</div>
                                <Text size="xs" c="dimmed">Selected</Text>
                            </Group>
                        </Group>

                        {isScheduleLoading ? (
                            <Center h={280}><Loader size="sm" /></Center>
                        ) : (
                            <DatePicker
                                type="range"
                                value={dateRange}
                                onChange={setDateRange}
                                minDate={new Date()}
                                getDayProps={(date) => {
                                    const dateStr = dayjs(date).format('YYYY-MM-DD');
                                    const entry = scheduleMap[dateStr];
                                    const isAvailable = entry?.status === 'available';

                                    if (!isAvailable) {
                                        return {
                                            disabled: true,
                                            style: {
                                                opacity: 0.3,
                                                textDecoration: 'line-through',
                                                cursor: 'not-allowed',
                                            },
                                        };
                                    }
                                    return {};
                                }}
                                classNames={{ day: classes.day }}
                            />
                        )}

                        {/* Price summary */}
                        {dateRange[0] && dateRange[1] ? (
                            <>
                                <Divider my="lg" />
                                <Stack gap="sm">
                                    <Group justify="space-between">
                                        <Text size="sm" c="dimmed">Check-in</Text>
                                        <Text size="sm" fw={500}>
                                            {dayjs(dateRange[0]).format('DD MMM YYYY')}
                                        </Text>
                                    </Group>
                                    <Group justify="space-between">
                                        <Text size="sm" c="dimmed">Check-out</Text>
                                        <Text size="sm" fw={500}>
                                            {dayjs(dateRange[1]).format('DD MMM YYYY')}
                                        </Text>
                                    </Group>
                                    <Group justify="space-between">
                                        <Text size="sm" c="dimmed">Nights</Text>
                                        <Text size="sm" fw={500}>{nights}</Text>
                                    </Group>
                                    <Divider />
                                    <Group justify="space-between" align="baseline">
                                        <Text fw={700}>Total</Text>
                                        <Text fw={800} size="xl" c="blue">
                                            {totalPrice?.toFixed(2)} Kč
                                        </Text>
                                    </Group>
                                </Stack>
                                <Button
                                    fullWidth
                                    size="md"
                                    mt="lg"
                                    onClick={() => navigate(
                                        `/booking?apartmentId=${apartmentId}` +
                                        `&start=${dayjs(dateRange[0]).format('YYYY-MM-DD')}` +
                                        `&end=${dayjs(dateRange[1]).format('YYYY-MM-DD')}`
                                    )}
                                >
                                    Book now →
                                </Button>
                            </>
                        ) : (
                            <Text size="xs" c="dimmed" mt="md" ta="center">
                                Select check-in and check-out dates to see the price
                            </Text>
                        )}
                    </Paper>
                </Grid.Col>
            </Grid>
        </Container>
    );
};
