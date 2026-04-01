import {useQuery} from "@tanstack/react-query";

// import mantine
import {Container} from '@mantine/core';
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
        <Container className={classes.wrapper}>
            <HeaderSimple/>
            <HeroText></HeroText>

            {apartments?.map((apartment) => (
                <ApartmentCard key={apartment.id} apartment={apartment} />
            ))}
        </Container>
    )
}