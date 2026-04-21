import {useMemo, useRef, useState} from "react";
import {useQuery} from "@tanstack/react-query";

// import mantine
import {Container, Image, Paper, SimpleGrid, Text, Title} from '@mantine/core';
import {Carousel} from '@mantine/carousel';
import {DatePicker} from "@mantine/dates";
import '@mantine/dates/styles.css';
import '@mantine/carousel/styles.css';

// import page style
import classes from './Home.module.css';

// import components
import {HeroText} from '../components/herotext/HeroText';
import {HeaderSimple} from "../components/headersimple/HeaderSimple.tsx";
import {ApartmentCard} from "../components/apartmentCard/ApartmentCard.tsx";
import {getApartments, searchApartments} from "../features/apartments/api.ts";
import {ActiveBookingNotice} from "../components/activeBooking/ActiveBookingNotice.tsx";
import {getActiveBookingDraft} from "../features/booking/storage.ts";

export const Home = () => {

    const [dateRange, setDateRange] = useState<[string | null, string | null]>([null, null]);
    const [activeBooking, setActiveBooking] = useState(getActiveBookingDraft());
    const calendarRef = useRef<HTMLDivElement | null>(null);
    const hasFullRange = Boolean(dateRange[0] && dateRange[1]);

    // Keep query key stable on first click (only start date selected),
    // so React Query does not spin a new request and UI does not look like a page refresh.
    const searchStart = hasFullRange ? dateRange[0] : null;
    const searchEnd = hasFullRange ? dateRange[1] : null;

    const {data: apartments, isLoading, isError, error} = useQuery({
        queryKey:['apartments', searchStart, searchEnd],
        queryFn: () => {
            if (searchStart && searchEnd){
                return searchApartments(searchStart, searchEnd)
            }
        //     Есди даты не выбраны
            return getApartments();
        }
    });

    const galleryImages = useMemo(() => {
        return (apartments ?? [])
            .flatMap((apartment) => apartment.photos.slice(0, 1).map((photo) => ({
                id: `${apartment.id}-${photo.id}`,
                name: apartment.name,
                src: photo.photo,
            })))
            .slice(0, 8);
    }, [apartments]);

    if (isLoading) return <Container className={classes.wrapper}>Loading...</Container>;
    if (isError) return <Container className={classes.wrapper}>Error: {(error as Error).message}</Container>;

    return (
        <Container size={"xl"} className={classes.wrapper} py={"xl"}>
            <HeaderSimple/>
            <HeroText
                onReservationClick={() => calendarRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
            />

            {activeBooking && (
                <ActiveBookingNotice
                    booking={activeBooking}
                    onCleared={() => setActiveBooking(null)}
                />
            )}

            <section className={classes.section}>
                <Title order={2} mb="lg">Gallery</Title>

                {galleryImages.length > 0 ? (
                    <Carousel
                        withIndicators
                        withControls
                        emblaOptions={{ loop: true }}
                        className={classes.galleryCarousel}
                    >
                        {galleryImages.map((item) => (
                            <Carousel.Slide key={item.id}>
                                <Paper withBorder radius="md" className={classes.gallerySlide}>
                                    <Image src={item.src} alt={item.name} className={classes.galleryImage} />
                                    <Text p="sm" size="sm" c="dimmed" lineClamp={1}>{item.name}</Text>
                                </Paper>
                            </Carousel.Slide>
                        ))}
                    </Carousel>
                ) : (
                    <Text c="dimmed">Gallery will appear after apartments with photos are loaded.</Text>
                )}
            </section>

            <section className={classes.section} ref={calendarRef}>
                <Title order={2} mb="lg">Calendar</Title>
                <Paper withBorder radius="md" p="lg" className={classes.calendarCard}>
                    <DatePicker
                        type="range"
                        allowSingleDateInRange
                        value={dateRange}
                        onChange={setDateRange}
                        minDate={new Date()}
                        classNames={{ day: classes.day }}
                    />
                    <Text size="xs" c="dimmed" mt="sm">
                        Select check-in and check-out dates to filter apartments.
                    </Text>
                </Paper>
            </section>

            <section className={classes.section} id="apartments-grid">
                <Title order={2} mb={"lg"}>Grid with Apartments</Title>

                <SimpleGrid cols={{base: 1, sm: 2, md: 3, lg: 4}} spacing={"lg"}>
                    {apartments?.map((apartment) => (
                        <ApartmentCard key={apartment.id} apartment={apartment} />
                    ))}
                </SimpleGrid>
            </section>


        </Container>
    )
}