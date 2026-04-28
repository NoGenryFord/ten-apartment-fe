import { useMemo, useState } from 'react';
import { Alert, Button, Group, Paper, Stack, Text, TextInput, Textarea, Title } from '@mantine/core';
import { useMutation } from '@tanstack/react-query';
import { submitInquiry } from '../../features/apartments/api';

type ContactFormProps = {
    id?: string;
    title?: string;
    description?: string;
    submitLabel?: string;
    /** When provided the inquiry is linked to this apartment. */
    apartmentId?: number;
    apartmentName?: string;
};

const EMPTY = { name: '', contact: '', message: '' };

export const ContactForm = ({
    id,
    title = 'Contact us',
    description = 'Leave your question and we will reply shortly.',
    submitLabel = 'Send message',
    apartmentId,
    apartmentName,
}: ContactFormProps) => {
    const [values, setValues] = useState(EMPTY);
    const [validationError, setValidationError] = useState<string | null>(null);

    const placeholderMessage = useMemo(() => {
        if (!apartmentName) return 'I am interested in booking and have a few questions.';
        return `Hello, I am interested in ${apartmentName}. Please contact me.`;
    }, [apartmentName]);

    const mutation = useMutation({
        mutationFn: () =>
            submitInquiry({
                name: values.name.trim(),
                contact: values.contact.trim(),
                message: values.message.trim(),
                apartment: apartmentId ?? null,
            }),
        onSuccess: () => {
            setValues(EMPTY);
            setValidationError(null);
        },
    });

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!values.name.trim() || !values.contact.trim() || !values.message.trim()) {
            setValidationError('Please fill in all fields.');
            return;
        }

        setValidationError(null);
        mutation.mutate();
    };

    return (
        <Paper id={id} withBorder radius="md" p="xl">
            <Stack gap="md">
                <div>
                    <Title order={3} mb={6}>{title}</Title>
                    <Text size="sm" c="dimmed">{description}</Text>
                </div>

                <form onSubmit={handleSubmit}>
                    <Stack gap="sm">
                        <TextInput
                            label="Your name"
                            placeholder="John Doe"
                            value={values.name}
                            onChange={(e) => { const v = e.currentTarget.value; setValues((p) => ({ ...p, name: v })); }}
                            disabled={mutation.isPending}
                            required
                        />
                        <TextInput
                            label="Phone or email"
                            placeholder="+420 ... or name@email.com"
                            value={values.contact}
                            onChange={(e) => { const v = e.currentTarget.value; setValues((p) => ({ ...p, contact: v })); }}
                            disabled={mutation.isPending}
                            required
                        />
                        <Textarea
                            label="Message"
                            minRows={4}
                            placeholder={placeholderMessage}
                            value={values.message}
                            onChange={(e) => { const v = e.currentTarget.value; setValues((p) => ({ ...p, message: v })); }}
                            disabled={mutation.isPending}
                            required
                        />

                        {validationError && <Alert color="red">{validationError}</Alert>}
                        {mutation.isError && (
                            <Alert color="red">
                                Failed to send. Please try again or contact us directly.
                            </Alert>
                        )}
                        {mutation.isSuccess && (
                            <Alert color="green">
                                Your message was sent! We will get back to you shortly.
                            </Alert>
                        )}

                        <Group justify="flex-end">
                            <Button type="submit" loading={mutation.isPending}>
                                {submitLabel}
                            </Button>
                        </Group>
                    </Stack>
                </form>
            </Stack>
        </Paper>
    );
};

