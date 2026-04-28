import { Container, Stack, Text, Title } from '@mantine/core';
import { HeaderSimple } from '../components/headersimple/HeaderSimple';
import { ContactForm } from '../components/contactForm/ContactForm';

export const Contacts = () => {
    return (
        <Container size="lg" py="xl">
            <HeaderSimple />

            <Stack gap="md" mt="lg" mb="xl">
                <Title order={1}>Contacts</Title>
                <Text c="dimmed">
                    If you need help with booking, dates, or apartment details, send us a message.
                </Text>
                <Text>Phone: +420 000 000 000</Text>
                <Text>Email: info@10apartments.com</Text>
                <Text>Address: Prague, Czech Republic</Text>
            </Stack>

            <ContactForm
                id="contact-form"
                title="General inquiry"
                description="Write your question and our team will get back to you."
                submitLabel="Send inquiry"
            />
        </Container>
    );
};
