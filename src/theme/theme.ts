import { createTheme } from '@mantine/core';

export const theme = createTheme({
    primaryColor: 'blue',
    fontFamily: 'Outfit, var(--mantine-font-family)',
    defaultRadius: 'md',

    headings: {
        fontFamily: 'Outfit, var(--mantine-font-family)',
        sizes: {
            h1: { fontSize: '40px', lineHeight: '1.1' },
        },
    },

    components: {
        Container: {
            defaultProps: {
                size: 'lg',
            },
        },
        Button: {
            defaultProps: {
                radius: 'md',
            },
        },
    },
});
