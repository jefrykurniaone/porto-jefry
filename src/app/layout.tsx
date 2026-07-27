/**
 * Bare passthrough. `[locale]/layout.tsx` owns <html> and <body> because both
 * need the resolved locale. Rendering them here too nests <html> inside
 * <body>, which React 19 reports as a hydration error.
 *
 * The theme script cannot live here either: React 19 refuses to render a
 * <script> outside the main document unless it is async with a non-empty src,
 * which an inline script is not.
 */
export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return children;
}
