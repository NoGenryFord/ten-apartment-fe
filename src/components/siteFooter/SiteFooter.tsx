import { Anchor, Container, Group, Text } from '@mantine/core';
import { Link } from 'react-router-dom';

export const SiteFooter = () => {
    return (
        <footer>
            <Container size="xl" py="lg">
                <Group justify="space-between" wrap="wrap" gap="xs">
                    <Text size="sm" c="dimmed">© {new Date().getFullYear()} 10 Apartments</Text>
                    <Group gap="md">
                        <Anchor component={Link} to="/contacts#contact-form" size="sm">
                            Contact form
                        </Anchor>
                    </Group>
                </Group>
            </Container>
        </footer>
    );
};
