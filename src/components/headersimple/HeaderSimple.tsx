import { useState } from 'react';
import { Burger, Container, Divider, Drawer, Group, ScrollArea } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import classes from './HeaderSimple.module.css';

const links = [
    { link: '/about', label: 'Features' },
    { link: '/pricing', label: 'Pricing' },
    { link: '/learn', label: 'Learn' },
    { link: '/community', label: 'Community' },
];

export function HeaderSimple() {
    const [opened, { toggle, close }] = useDisclosure(false);
    const [active, setActive] = useState(links[0].link);

    // Logo
    const logoUrl: string = '/fin-logo.png'

    const items = links.map((link) => (
        <a
            key={link.label}
            href={link.link}
            className={classes.link}
            data-active={active === link.link || undefined}
            onClick={(event) => {
                event.preventDefault();
                setActive(link.link);
            }}
        >
            {link.label}
        </a>
    ));

    return (
        <header className={classes.header}>
            <Container className={classes.inner}>
                <img src={logoUrl ? logoUrl : logoUrl} alt="logo" className={classes.logo}/>
                <Group gap={5} visibleFrom="xs">
                    {items}
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
                <ScrollArea h="calc(100vh - 80px" mx="-md">
                    <Divider my="sm" />
                    {items}
                </ScrollArea>
            </Drawer>
        </header>
    );
}