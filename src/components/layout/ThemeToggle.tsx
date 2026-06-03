import ThemeToggleClient from './ThemeToggle.client';

export default function ThemeToggle() {
    return (
        <div className="relative w-9 h-9">
            {/* Server-side stable placeholder to reserve space and avoid CLS */}
            <span
                data-testid="theme-toggle-placeholder"
                aria-hidden="true"
                className="w-9 h-9 inline-block absolute inset-0"
                style={{ pointerEvents: 'none' }}
            >
                <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="block"
                >
                    <circle cx="12" cy="12" r="6" fill="currentColor" />
                </svg>
            </span>
            {/* Client component will render on top of placeholder */}
            <ThemeToggleClient />
        </div>
    );
}
