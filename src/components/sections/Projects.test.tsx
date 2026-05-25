import { describe, it } from 'vitest';
import { render } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import messages from '@/i18n/messages/en.json';
import Projects from './Projects';

describe('Projects', () => {
    it('renders without crashing', () => {
        render(
            <NextIntlClientProvider locale="en" messages={messages}>
                <Projects />
            </NextIntlClientProvider>,
        );
    });
});
