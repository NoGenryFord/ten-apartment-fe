import { Anchor, Box, Container, Group, Text } from '@mantine/core';
import { Link } from 'react-router-dom';

export const SiteFooter = () => {
    return (
        <footer>
            <Container size="xl" py="lg" pb={72}>
                <Box
                    style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr auto 1fr',
                        alignItems: 'center',
                        gap: 12,
                    }}
                >
                    <Text size="sm" c="dimmed">© {new Date().getFullYear()} 10 Apartments</Text>

                    <Group gap="md" justify="center" wrap="nowrap">
                        <Anchor component={Link} to="/contacts#contact-form" size="sm">
                            Contact form
                        </Anchor>
                        <Anchor component={Link} to="/about" size="sm">
                            About us
                        </Anchor>
                    </Group>

                    <Box />
                </Box>
            </Container>
        </footer>
    );
};
