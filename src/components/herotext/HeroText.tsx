import { Container, Text, Title } from '@mantine/core';
import classes from './HeroText.module.css';

import {Calendar} from "@mantine/dates";


export function HeroText() {
    return (
        <Container className={classes.wrapper} size={1400}>
            <div className={classes.inner}>
                <Title className={classes.title}>
                    Find{' '}
                    <span className={classes.highlight}>
                        best apartment
                    </span>{' '}
                    in all Prague
                </Title>

                <Container p={0} size={600}>
                    <Text size="lg" c="dimmed" className={classes.description}>
                        Discover the finest apartments in Prague. Rent directly from owners and save on commissions.
                    </Text>
                </Container>

                <Calendar className={classes.calendar}
                classNames={{
                    day: classes.calendarDay,
                    weekday: classes.calendarWeekday,
                    month: classes.calendarMonth,
                    calendarHeader: classes.calendarHeader,
                }}/>
            </div>
        </Container>
    );
}