import {Button, Container, Text, Title} from '@mantine/core';
import type {CSSProperties} from 'react';

import classes from './HeroText.module.css';
import heroPhoto from '../../assets/hero-photo-2.png';

interface HeroTextProps {
    onReservationClick?: () => void;
}

export function HeroText({onReservationClick}:HeroTextProps) {
    const wrapperStyle = {
        '--hero-bg-image': `url(${heroPhoto})`,
    } as CSSProperties;

    return (
        <Container className={classes.wrapper} size={1400} style={wrapperStyle}>
            <div className={classes.inner}>
                <div className={classes.content}>
                    <div className={classes.left}>
                        <Title className={classes.title}>
                            Find your{' '}
                            <span className={classes.highlight}>
                                perfect apartment
                            </span>{' '}
                            in Prague
                        </Title>

                        <Text size="lg" c="dimmed" className={classes.description}>
                            Explore handpicked stays in the best neighborhoods, compare options quickly, and book with confidence.
                        </Text>

                        <Button size="lg" radius="xl" onClick={onReservationClick} className={classes.reserveBtn}>
                            Choose dates
                        </Button>
                    </div>
                </div>
            </div>
        </Container>
    );
}