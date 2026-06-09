interface TechListProps {
    items: readonly string[];
    className?: string;
}

/**
 * Renders a list of technologies as a single muted, middot-separated line
 * (e.g. "C# · .NET · PostgreSQL") instead of boxed badges — keeps the
 * minimalist/flat look used across Experience, Skills, and Projects.
 */
export function TechList({ items, className = '' }: Readonly<TechListProps>) {
    if (items.length === 0) return null;
    return (
        <p className={`tech-list readable-muted sgds:text-label-sm ${className}`.trim()}>
            {items.join(' · ')}
        </p>
    );
}
