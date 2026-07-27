/**
 * Bare passthrough. `[locale]/layout.tsx` owns <html> and <body> because both
 * need the resolved locale (lang attribute, font classes, theme script).
 * Rendering them here too nests <html> inside <body>, which React 19 rejects
 * as a hydration error.
 */
export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return children;
}
