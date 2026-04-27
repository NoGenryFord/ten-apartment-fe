import { Burger, Button, Container, Divider, Drawer, Group, ScrollArea } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Link } from 'react-router-dom';
import classes from './HeaderSimple.module.css';
import { clearAuthSession, getAuthUser, isAuthenticated } from '../../features/auth/storage';

export function HeaderSimple() {
    const [opened, { toggle, close }] = useDisclosure(false);
    const user = getAuthUser();
    const loggedIn = isAuthenticated();

    // Logo
    const logoUrl: string = '/fin-logo.png'

    return (
        <header className={classes.header}>
            <Container className={classes.inner}>
                <Link to="/" aria-label="Go to home page">
                    <img src={logoUrl ? logoUrl : logoUrl} alt="logo" className={classes.logo}/>
                </Link>

                <Group gap={8} visibleFrom="xs">
                    <Button component={Link} to="/" variant="subtle" color="dark" className={classes.linkButton}>
                        Home
                    </Button>
                    <Button component={Link} to="/account" variant="light" color="blue">
                        {loggedIn ? 'My account' : 'Login'}
                    </Button>
                    {loggedIn && (
                        <Button
                            variant="subtle"
                            color="red"
                            onClick={() => {
                                clearAuthSession();
                                window.location.href = '/';
                            }}
                        >
                            Logout
                        </Button>
                    )}
                </Group>

                <Burger
                    opened={opened}
                    onClick={toggle}
                    hiddenFrom="xs"
                    size="sm"
                    aria-label="Toggle navigation"
                />
            </Container>

            <Drawer
                opened={opened}
                onClose={close}
                size="100%"
                padding="md"
                title="Navigation"
                hiddenFrom="xs"
                zIndex={1000000}
            >
                <ScrollArea h="calc(100vh - 80px)" mx="-md">
                    <Divider my="sm" />
                    <Link to="/" className={classes.link} onClick={close}>Home</Link>
                    <Link to="/account" className={classes.link} onClick={close}>
                        {loggedIn ? 'My account' : 'Login'}
                    </Link>
                    {loggedIn && (
                        <button
                            type="button"
                            className={classes.linkAsButton}
                            onClick={() => {
                                clearAuthSession();
                                window.location.href = '/';
                            }}
                        >
                            Logout {user?.email ? `(${user.email})` : ''}
                        </button>
                    )}
                </ScrollArea>
            </Drawer>
        </header>
    );
}