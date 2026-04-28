import { Link } from 'react-router-dom';
import type { Apartment } from '../../types';
import {Card, Image, Title, Text, Group, Badge} from '@mantine/core';

import classes from './ApartmentCard.module.css';

interface Props {
    apartment: Apartment;
    dateRange?: [string | null, string | null];
}

const formatPriceCzk = (value?: string): string | null => {
    if (!value) return null;

    const numeric = Number(value);
    if (!Number.isFinite(numeric)) {
        return `${value} CZK`;
    }

    return `${new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(numeric)} CZK`;
};

export const ApartmentCard = ({ apartment, dateRange }: Props) => {
    const coverImage = apartment.photos && apartment.photos.length > 0
        ? apartment.photos[0].photo
        : 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'; // ЗАГЛУШКА ВРЕМЕННО
    const hasSelectedDates = Boolean(dateRange?.[0] && dateRange?.[1]);
    const priceSource = hasSelectedDates ? apartment.total_price : apartment.today_price ?? undefined;
    const formattedPrice = formatPriceCzk(priceSource);

    const buildPath = () => {
        let path = `/apartment/${apartment.id}`;
        if (dateRange?.[0] && dateRange?.[1]) {
            path += `?start=${dateRange[0]}&end=${dateRange[1]}`;
        }
        return path;
    };

    return (
        <Card
            component={Link}
            to={buildPath()}
            className={classes.card}
            padding={0}
            radius="md"
            style={{ textDecoration: 'none', backgroundColor: 'transparent' }}
        >
            {/* Контейнер для фото с бейджиком */}
            <div style={{ position: 'relative' }}>
                <Image
                    src={coverImage}
                    height={280}
                    radius="md"
                    alt={apartment.name}
                />

                <Badge
                    style={{ position: 'absolute', top: 12, left: 12 }}
                    color="white"
                    variant="filled"
                    c="dark"
                    size="sm"
                >
                    {apartment.type?.name || 'Апартамент'}
                </Badge>
            </div>


            <div style={{ marginTop: '12px' }}>
                <Group justify="space-between" align="flex-start" gap="xs" mb={2}>
                    <Title order={3} size="h5" fw={600} lineClamp={1} style={{ flex: 1 }} c="dark">
                        {apartment.name}
                    </Title>
                </Group>

                <Text size="sm" c="dimmed" lineClamp={1} mb={6}>
                    {apartment.description}
                </Text>

                {apartment.tags.length > 0 && (
                    <Group gap={8} mb={6}>
                        {apartment.tags.slice(0, 3).map((tag) => (
                            <Badge key={tag.id} variant="light" color="gray" size="sm">
                                {tag.name}
                            </Badge>
                        ))}
                        {apartment.tags.length > 3 && (
                            <Badge variant="outline" color="gray" size="sm">
                                +{apartment.tags.length - 3}
                            </Badge>
                        )}

                                    {(apartment.area || apartment.max_guests) && (
                                        <Group gap={6} mb={6}>
                                            {apartment.area && (
                                                <Badge variant="dot" color="blue" size="sm">
                                                    {Number(apartment.area).toFixed(0)} m²
                                                </Badge>
                                            )}
                                            {apartment.max_guests ? (
                                                <Badge variant="dot" color="teal" size="sm">
                                                    👥 {apartment.max_guests}
                                                </Badge>
                                            ) : null}
                                        </Group>
                                    )}
                    </Group>
                )}

                <Group gap={6} align="baseline">
                    <Text fw={700} c="dark">
                        {formattedPrice ?? 'Price on request'}
                    </Text>
                    <Text size="sm" c="dimmed">
                        {formattedPrice ? (hasSelectedDates ? 'for selected dates' : 'today') : ''}
                    </Text>
                </Group>
            </div>
        </Card>
    );
};

