import {useState} from "react";
import {useQuery} from "@tanstack/react-query";

// import mantine
import {Container, SimpleGrid, Title} from '@mantine/core';

// import page style
import classes from './Home.module.css';

// import components
import {HeroText} from '../components/herotext/HeroText';
import {HeaderSimple} from "../components/headersimple/HeaderSimple.tsx";
import {ApartmentCard} from "../components/apartmentCard/ApartmentCard.tsx";
import {getApartments, searchApartments} from "../features/apartments/api.ts";

export const Home = () => {

    const [dateRange, setDateRange] = useState<[string | null, string | null]>([null, null]);

    const {data: apartments, isLoading, isError, error} = useQuery({
        queryKey:['apartments', dateRange],
        queryFn: () => {
        //     Если даты выбраны
            if (dateRange[0]){
                const start = dateRange[0];
                const end = dateRange[1] ?? start;
                return searchApartments(start, end)
            }
        //     Есди даты не выбраны
            return getApartments();
        }
    });

    if (isLoading) return <Container className={classes.wrapper}>Loading...</Container>;
    if (isError) return <Container className={classes.wrapper}>Error: {(error as Error).message}</Container>;

    return (
        <Container size={"xl"} className={classes.wrapper} py={"xl"}>
            <HeaderSimple/>
            <HeroText dateRange={dateRange} setDateRange={setDateRange} ></HeroText>

            <Title order={2} mt={"xl"} mb={"lg"}>Our Apartments</Title>

            <SimpleGrid cols={{base: 1, sm: 2, md: 3, lg: 4}} spacing={"lg"}>
                {apartments?.map((apartment) => (
                    <ApartmentCard key={apartment.id} apartment={apartment} />
                ))}
            </SimpleGrid>


        </Container>
    )
}