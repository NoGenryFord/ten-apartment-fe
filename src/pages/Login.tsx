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
import { loginWithEmail } from '../features/auth/api';
import { isAuthenticated, saveAuthSession } from '../features/auth/storage';

export const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const loggedIn = isAuthenticated();

    const loginMutation = useMutation({
        mutationFn: () => loginWithEmail(email, password),
        onSuccess: (session) => {
            saveAuthSession(session);
            setErrorMessage(null);
            navigate('/account');
        },
        onError: () => {
            setErrorMessage('Invalid email or password. Please try again.');
        },
    });

    if (loggedIn) {
        return <Navigate to="/account" replace />;
    }

    return (
        <Container size="sm" py="xl">
            <HeaderSimple />

            <Paper withBorder p="xl" radius="md" mt="xl">
                <Title order={2} mb="sm">Login</Title>
                <Text c="dimmed" mb="lg">Access your account and booking history.</Text>

                <Stack>
                    <TextInput
                        label="Email"
                        placeholder="john@example.com"
                        value={email}
                        onChange={(event) => setEmail(event.currentTarget.value)}
                        required
                    />
                    <PasswordInput
                        label="Password"
                        placeholder="Your password"
                        value={password}
                        onChange={(event) => setPassword(event.currentTarget.value)}
                        required
                    />

                    {errorMessage && (
                        <Alert color="red" title="Login failed">
                            {errorMessage}
                        </Alert>
                    )}

                    <Button
                        loading={loginMutation.isPending}
                        disabled={!email.trim() || !password.trim()}
                        onClick={() => loginMutation.mutate()}
                    >
                        Login
                    </Button>

                    <Anchor component={Link} to="/register" size="sm">
                        Create account
                    </Anchor>
                    <Anchor component={Link} to="/" size="sm">Back to apartments</Anchor>
                </Stack>
            </Paper>
        </Container>
    );
};
