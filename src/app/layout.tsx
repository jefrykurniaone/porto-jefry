import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'Jefry Kurniawan – Software Developer',
    description:
        'Portfolio of Jefry Kurniawan, a Software Developer specializing in .NET (C#, VB.NET) and SQL Server with 4+ years of experience.',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang='en' suppressHydrationWarning>
            <body className={inter.className}>{children}</body>
        </html>
    );
}
