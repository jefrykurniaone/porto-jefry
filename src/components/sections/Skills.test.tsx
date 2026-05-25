import { describe, it } from 'vitest';
import { render } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import messages from '@/i18n/messages/en.json';
import Skills from './Skills';

describe('Skills', () => {
    it('renders without crashing', () => {
        render(
            <NextIntlClientProvider locale="en" messages={messages}>
                <Skills />
            </NextIntlClientProvider>,
        );
    });
});
