import { Link } from 'react-router-dom';
import type { Apartment } from '../../types';
import {Card, CardSection, Image, Title, Text, Group} from '@mantine/core';

import classes from './ApartmentCard.module.css';

interface Props {
    apartment: Apartment;
}

export const ApartmentCard = ({ apartment }: Props) => {
    const coverImage = apartment.photos && apartment.photos.length > 0
        ? apartment.photos[0].photo
        : 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'; // ЗАГЛУШКА ВРЕМЕННО

    return (
        <Card className={classes.card} shadow={"sm"} padding="lg" radius="md" withBorder orientation={"vertical"} w={240}>
            {/* Фото */}
            <CardSection>
                <Image
                    src={coverImage}
                    height={220}
                    w={200}
                    alt='Apartment'
                />
            </CardSection>

            {/* Контент */}
                <Title size={"xl"} className="mb-2">
                    {apartment.name}
                </Title>

                <Text>
                    {apartment.description}
                </Text>

                {/* Если поиск был по датам, BE вернет total_price */}
                {apartment.total_price && (
                    <Group className="mb-4">
                        <Text>For choose date: </Text>
                        <Text>{apartment.total_price} ₽</Text>
                    </Group>
                )}

                <Link
                    to={`/apartment/${apartment.id}`}
                >
                    Details
                </Link>
        </Card>
    );
};

