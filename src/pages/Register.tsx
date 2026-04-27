import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import {
    Alert,
    Anchor,
    Button,
    Container,
    Paper,
    PasswordInput,
    Stack,
    Text,
    TextInput,
    Title,
} from '@mantine/core';

import { HeaderSimple } from '../components/headersimple/HeaderSimple';
import { registerWithEmail } from '../features/auth/api';
import { isAuthenticated, saveAuthSession } from '../features/auth/storage';

export const Register = () => {
    const navigate = useNavigate();
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const loggedIn = isAuthenticated();

    const registerMutation = useMutation({
        mutationFn: () => registerWithEmail({
            email,
            first_name: firstName,
            last_name: lastName,
            password,
            password_confirm: passwordConfirm,
        }),
        onSuccess: (session) => {
            saveAuthSession(session);
            setErrorMessage(null);
            navigate('/account');
        },
        onError: () => {
            setErrorMessage('Could not create account. Check data and try again.');
        },
    });

    if (loggedIn) {
        return <Navigate to="/account" replace />;
    }

    const passwordsMatch = password === passwordConfirm;

    return (
        <Container size="sm" py="xl">
            <HeaderSimple />

            <Paper withBorder p="xl" radius="md" mt="xl">
                <Title order={2} mb="sm">Create account</Title>
                <Text c="dimmed" mb="lg">Register once and use your account for bookings and history.</Text>

                <Stack>
                    <TextInput
                        label="First name"
                        placeholder="John"
                        value={firstName}
                        onChange={(event) => setFirstName(event.currentTarget.value)}
                        required
                    />
                    <TextInput
                        label="Last name"
                        placeholder="Doe"
                        value={lastName}
                        onChange={(event) => setLastName(event.currentTarget.value)}
                        required
                    />
                    <TextInput
                        label="Email"
                        placeholder="john@example.com"
                        value={email}
                        onChange={(event) => setEmail(event.currentTarget.value)}
                        required
                    />
                    <PasswordInput
                        label="Password"
                        placeholder="At least 8 characters"
                        value={password}
                        onChange={(event) => setPassword(event.currentTarget.value)}
                        required
                    />
                    <PasswordInput
                        label="Confirm password"
                        placeholder="Repeat password"
                        value={passwordConfirm}
                        onChange={(event) => setPasswordConfirm(event.currentTarget.value)}
                        required
                    />

                    {!passwordsMatch && passwordConfirm.trim().length > 0 && (
                        <Alert color="red" title="Password mismatch">
                            Password and confirmation must match.
                        </Alert>
                    )}

                    {errorMessage && (
                        <Alert color="red" title="Registration failed">
                            {errorMessage}
                        </Alert>
                    )}

                    <Button
                        loading={registerMutation.isPending}
                        disabled={
                            !firstName.trim()
                            || !lastName.trim()
                            || !email.trim()
                            || password.trim().length < 8
                            || !passwordsMatch
                        }
                        onClick={() => registerMutation.mutate()}
                    >
                        Create account
                    </Button>

                    <Anchor component={Link} to="/login" size="sm">
                        Already have an account? Login
                    </Anchor>
                    <Anchor component={Link} to="/" size="sm">Back to apartments</Anchor>
                </Stack>
            </Paper>
        </Container>
    );
};
