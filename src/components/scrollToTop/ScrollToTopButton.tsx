import { useEffect, useState } from 'react';
import { Affix, Transition } from '@mantine/core';
import classes from './ScrollToTopButton.module.css';

export const ScrollToTopButton = () => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const onScroll = () => {
            setVisible(window.scrollY > 320);
        };

        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const handleScrollTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <Affix position={{ bottom: 24, right: 24 }} zIndex={200}>
            <Transition transition="slide-up" mounted={visible} duration={180}>
                {(transitionStyles) => (
                    <button
                        type="button"
                        style={transitionStyles}
                        className={classes.button}
                        onClick={handleScrollTop}
                        aria-label="Scroll to top"
                        title="Back to top"
                    >
                        <span className={classes.icon} aria-hidden="true">↑</span>
                    </button>
                )}
            </Transition>
        </Affix>
    );
};
