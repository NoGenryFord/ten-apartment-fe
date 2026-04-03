import {useQuery} from "@tanstack/react-query";

// import mantine
import {Container, SimpleGrid, Title} from '@mantine/core';
// import page style
import classes from './Home.module.css';

// import components
import {HeroText} from '../components/herotext/HeroText';
import {HeaderSimple} from "../components/headersimple/HeaderSimple.tsx";
import {ApartmentCard} from "../components/apartmentCard/ApartmentCard.tsx";
import {getApartments} from "../features/apartments/api.ts";

export const Home = () => {

    const {data: apartments, isLoading, isError, error} = useQuery({
        queryKey:['apartments'],
        queryFn: getApartments
    });

    if (isLoading) return <Container className={classes.wrapper}>Loading...</Container>;
    if (isError) return <Container className={classes.wrapper}>Error: {(error as Error).message}</Container>;

    return (
        <Container size={"xl"} className={classes.wrapper} py={"xl"}>
            <HeaderSimple/>
            <HeroText></HeroText>

            <Title order={2} mt={"xl"} mb={"lg"}>Our Apartments</Title>

            <SimpleGrid cols={{base: 1, sm: 2, lg: 3}} spacing={"lg"}>
                {apartments?.map((apartment) => (
                    <ApartmentCard key={apartment.id} apartment={apartment} />
                ))}
            </SimpleGrid>


        </Container>
    )
}