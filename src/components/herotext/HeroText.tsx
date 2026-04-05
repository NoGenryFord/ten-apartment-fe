import type {Dispatch, SetStateAction} from 'react';

import {Container, Text, Title} from '@mantine/core';
import {DatePickerInput} from "@mantine/dates";

import classes from './HeroText.module.css';
import '@mantine/dates/styles.css';

type DateRange = [string | null, string | null];

interface HeroTextProps {
    dateRange: DateRange;
    setDateRange: Dispatch<SetStateAction<DateRange>>;
}

export function HeroText({dateRange, setDateRange}:HeroTextProps) {
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

                {/*Выбор дат аренды*/}
                <div style={{ maxWidth: 400, margin: '2rem 0'}}>
                    <DatePickerInput
                        type="range"
                        label="Dates of stay"
                        placeholder="Check-in - Check-out"
                        value={dateRange}
                        onChange={setDateRange}
                        clearable
                        minDate={new Date()}
                        classNames={{
                            day: classes.day,
                        }}
                    />
                </div>
            </div>
        </Container>
    );
}