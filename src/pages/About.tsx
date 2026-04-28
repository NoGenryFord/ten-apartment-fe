import { Anchor, Badge, Button, Container, Group, List, Paper, Stack, Text, ThemeIcon, Title } from '@mantine/core';
import { Link } from 'react-router-dom';
import { HeaderSimple } from '../components/headersimple/HeaderSimple';

export const About = () => {
    return (
        <Container size="lg" py="xl">
            <HeaderSimple />

            <Stack gap="xl" mt="lg">
                <Stack gap="sm" align="flex-start">
                    <Badge color="blue" variant="light">10 Apartments</Badge>
                    <Title order={1}>About Us</Title>
                    <Text c="dimmed" maw={760}>
                        We help guests find stylish short-term stays in Prague without stress, hidden fees,
                        or endless messaging. You choose dates, see clear prices, and book in a few minutes.
                    </Text>
                </Stack>

                <Paper withBorder p="xl" radius="md">
                    <Stack gap="sm">
                        <Title order={3}>Why Guests Choose Us</Title>
                        <List
                            spacing="sm"
                            icon={
                                <ThemeIcon size={20} radius="xl" color="teal" variant="light">
                                    <Text fw={700} size="xs">✓</Text>
                                </ThemeIcon>
                            }
                        >
                            <List.Item>Only verified apartments in central and well-connected areas.</List.Item>
                            <List.Item>Transparent pricing with no surprise charges at checkout.</List.Item>
                            <List.Item>Fast support before, during, and after your stay.</List.Item>
                            <List.Item>Comfort-focused spaces for work trips, weekends, and family visits.</List.Item>
                        </List>
                    </Stack>
                </Paper>

                <Paper withBorder p="xl" radius="md">
                    <Stack gap="sm">
                        <Title order={3}>Our Promise</Title>
                        <Text>
                            Every booking should feel easy and safe. That is why we focus on clear communication,
                            predictable quality, and quick help when plans change.
                        </Text>
                        <Text>
                            If you need a recommendation, a custom check-in window, or help choosing the best apartment,
                            send us a message and we will guide you personally.
                        </Text>
                    </Stack>
                </Paper>

                <Group gap="sm" wrap="wrap">
                    <Button component={Link} to="/">Browse apartments</Button>
                    <Button component={Link} to="/contacts#contact-form" variant="light">Contact us</Button>
                    <Anchor component={Link} to="/contacts#contact-form" size="sm">Have a special request?</Anchor>
                </Group>
            </Stack>
        </Container>
    );
};
