import { describe, it } from 'vitest';
import { render } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import messages from '@/i18n/messages/en.json';
import Certifications from './Certifications';

describe('Certifications', () => {
    it('renders without crashing', () => {
        render(
            <NextIntlClientProvider locale="en" messages={messages}>
                <Certifications />
            </NextIntlClientProvider>,
        );
    });
});
