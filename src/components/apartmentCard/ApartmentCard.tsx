import { Link } from 'react-router-dom';
import type { Apartment } from '../../types';
import {Card, CardSection, Image, Title, Text, Group, Button, Badge} from '@mantine/core';

import classes from './ApartmentCard.module.css';

interface Props {
    apartment: Apartment;
}

export const ApartmentCard = ({ apartment }: Props) => {
    const coverImage = apartment.photos && apartment.photos.length > 0
        ? apartment.photos[0].photo
        : 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'; // ЗАГЛУШКА ВРЕМЕННО

    return (
        <Card className={classes.card} shadow={"sm"} padding="lg" radius="md" withBorder display="flex" style={{ flexDirection: 'column'}} h="100%">
            {/* Фото */}
            <CardSection>
                <Image
                    src={coverImage}
                    height={220}
                    alt='Apartment'
                />
            </CardSection>

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <Group justify="space-between" mt="md" mb="xs">
                    <Title order={3} size="h4" fw={600}>{apartment.name}</Title>
                    <Badge color="blue" variant="light">{apartment.type?.name || 'Apartment'}</Badge>
                </Group>

                <Text size="sm" c="dimmed" lineClamp={3} mb="md" style={{ flex: 1 }}>
                    {apartment.description}
                </Text>

                {apartment.total_price && (
                    <Group justify="space-between" mb="md">
                        <Text size="sm" fw={500}>For choose dates:</Text>
                        <Text size="lg" fw={700} c="blue">{apartment.total_price} ₽</Text>
                    </Group>
                )}

                <Button
                    component={Link}
                    to={`/apartment/${apartment.id}`}
                    variant="light"
                    color="blue"
                    fullWidth
                    mt="auto"
                    radius="md"
                >
                    Details
                </Button>
            </div>
        </Card>
    );
};

