import {Button, Container, Text, Title} from '@mantine/core';

import classes from './HeroText.module.css';

interface HeroTextProps {
    onReservationClick?: () => void;
}

export function HeroText({onReservationClick}:HeroTextProps) {
    return (
        <Container className={classes.wrapper} size={1400}>
            <div className={classes.inner}>
                <div className={classes.content}>
                    <div className={classes.left}>
                        <Title className={classes.title}>
                            Find{' '}
                            <span className={classes.highlight}>
                                best apartment
                            </span>{' '}
                            in all Prague
                        </Title>

                        <Text size="lg" c="dimmed" className={classes.description}>
                            Discover the finest apartments in Prague. Rent directly from owners and save on commissions.
                        </Text>

                        <Button size="lg" radius="xl" onClick={onReservationClick} className={classes.reserveBtn}>
                            Reservation
                        </Button>
                    </div>
                </div>
            </div>
        </Container>
    );
}