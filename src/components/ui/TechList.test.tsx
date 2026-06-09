import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { TechList } from './TechList';

describe('TechList', () => {
    it('joins items into a middot-separated line', () => {
        const { container } = render(<TechList items={['C#', '.NET', 'Redis']} />);
        expect(container.textContent).toBe('C# · .NET · Redis');
    });

    it('applies an extra className when provided', () => {
        const { container } = render(<TechList items={['Go']} className='sgds:mt-component-xs' />);
        expect(container.querySelector('p')?.className).toContain('sgds:mt-component-xs');
    });

    it('renders nothing for an empty list', () => {
        const { container } = render(<TechList items={[]} />);
        expect(container.firstChild).toBeNull();
    });
});
