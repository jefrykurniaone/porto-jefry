'use client';

import { useState } from 'react';

export interface ProjectSummary {
    id: string;
    name: string;
    company: string;
    period: string;
    tech: readonly string[];
}

interface ProjectArchiveProps {
    items: ProjectSummary[];
    heading: string;
    note: string;
    showLabel: string;
    hideLabel: string;
}

function ArchiveRow({ item }: Readonly<{ item: ProjectSummary }>) {
    return (
        <li className='project-archive__row'>
            <div className='project-archive__head'>
                <h4 className='project-archive__name'>{item.name}</h4>
                <p className='card-period'>{item.period}</p>
            </div>
            <p className='card-eyebrow'>{item.company}</p>
            <div className='chip-row project-card__tech'>
                {item.tech.map((tech) => (
                    <span key={tech} className='chip'>{tech}</span>
                ))}
            </div>
        </li>
    );
}

/**
 * The work that cannot be linked — internal bank, insurer and HR systems whose
 * screens are not publishable. Rendered as a dense list behind a disclosure
 * rather than as more full-weight cards: at equal weight these nine diluted the
 * six with live public URLs, which are the only project evidence a stranger can
 * actually verify. Same `aria-expanded` pattern as the experience bullets.
 */
export default function ProjectArchive({
    items,
    heading,
    note,
    showLabel,
    hideLabel,
}: Readonly<ProjectArchiveProps>) {
    const [isOpen, setIsOpen] = useState(false);

    if (items.length === 0) return null;

    return (
        <div className='project-archive'>
            <h3 className='project-group__title'>{heading}</h3>
            <p className='project-group__note'>{note}</p>
            <button
                type='button'
                onClick={() => setIsOpen(!isOpen)}
                aria-expanded={isOpen}
                className='exp-more-btn project-archive__toggle'>
                {isOpen ? hideLabel : showLabel}
            </button>
            {isOpen && (
                <ul className='project-archive__list'>
                    {items.map((item) => (
                        <ArchiveRow key={item.id} item={item} />
                    ))}
                </ul>
            )}
        </div>
    );
}
