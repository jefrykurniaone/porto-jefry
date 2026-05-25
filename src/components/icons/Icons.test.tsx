import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { GitHubIcon } from './GitHubIcon';
import { LinkedInIcon } from './LinkedInIcon';

describe('GitHubIcon', () => {
    it('renders an SVG element', () => {
        const { container } = render(<GitHubIcon />);
        expect(container.querySelector('svg')).not.toBeNull();
    });

    it('accepts a custom size prop', () => {
        const { container } = render(<GitHubIcon size={32} />);
        const svg = container.querySelector('svg');
        expect(svg?.getAttribute('width')).toBe('32');
    });
});

describe('LinkedInIcon', () => {
    it('renders an SVG element', () => {
        const { container } = render(<LinkedInIcon />);
        expect(container.querySelector('svg')).not.toBeNull();
    });

    it('accepts a custom size prop', () => {
        const { container } = render(<LinkedInIcon size={24} />);
        const svg = container.querySelector('svg');
        expect(svg?.getAttribute('width')).toBe('24');
    });
});
