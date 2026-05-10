import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { ThemeProvider } from 'next-themes';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import type { Metadata } from 'next';

export function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }));
}

export const metadata: Metadata = {
    title: 'Jefry Kurniawan – Backend Developer & .NET Specialist',
    description:
        'Portfolio of Jefry Kurniawan, a Backend Developer specializing in .NET (C#, VB.NET), SQL Server, and AI-powered application development with 5+ years of enterprise experience.',
};

export default async function LocaleLayout({
    children,
    params,
}: Readonly<{
    children: React.ReactNode;
    params: { locale: string };
}>) {
    const { locale } = params;

    if (!routing.locales.includes(locale as 'en' | 'id')) {
        notFound();
    }

    const messages = await getMessages();

    return (
        <NextIntlClientProvider messages={messages}>
            <ThemeProvider attribute='class' defaultTheme='system' enableSystem>
                <Navbar />
                <main>{children}</main>
                <Footer />
            </ThemeProvider>
        </NextIntlClientProvider>
    );
}
