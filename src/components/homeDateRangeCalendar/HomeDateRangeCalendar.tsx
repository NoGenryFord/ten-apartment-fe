import { CloseButton, Group, Paper, Text } from '@mantine/core';
import { DatePicker } from '@mantine/dates';
import '@mantine/dates/styles.css';

import classes from './HomeDateRangeCalendar.module.css';

interface HomeDateRangeCalendarProps {
    value: [string | null, string | null];
    hasSelectedDates: boolean;
    onChange: (nextRange: [string | null, string | null]) => void;
    onClear: () => void;
}

export const HomeDateRangeCalendar = ({
    value,
    hasSelectedDates,
    onChange,
    onClear,
}: HomeDateRangeCalendarProps) => {
    return (
        <Paper withBorder radius="md" p="lg" className={classes.calendarCard}>
            <Group justify="flex-end" mb="xs">
                <CloseButton
                    onClick={onClear}
                    disabled={!hasSelectedDates}
                    aria-label="Clear selected dates"
                    title="Clear selected dates"
                />
            </Group>
            <div className={classes.calendarPickerWrap}>
                <DatePicker
                    type="range"
                    allowSingleDateInRange
                    value={value}
                    onChange={onChange}
                    minDate={new Date()}
                    classNames={{ day: classes.day }}
                />
            </div>
            <Text size="xs" c="dimmed" mt="sm">
                Select check-in and check-out dates to filter apartments.
            </Text>
        </Paper>
    );
};
