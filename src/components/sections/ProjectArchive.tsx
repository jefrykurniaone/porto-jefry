'use client';

import { useState } from 'react';
import Reveal from '@/components/ui/Reveal';

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

/**
 * The row style: a Label rail (period) on the left, name/company/stack on the
 * right — the same shape as `.exp-row`, minus the meta-column hover the live
 * cards get, since archive items have nothing to link to.
 */
function ArchiveRow({ item }: Readonly<{ item: ProjectSummary }>) {
    return (
        <li className='project-archive__row'>
            <p className='project-archive__period'>{item.period}</p>
            <div>
                <h4 className='project-archive__name'>{item.name}</h4>
                <p className='project-archive__company'>{item.company}</p>
                {item.tech.length > 0 && (
                    <ul className='chip-row project-archive__tech'>
                        {item.tech.map((tech) => (
                            <li key={tech} className='chip'>{tech}</li>
                        ))}
                    </ul>
                )}
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
 *
 * The list mounts only while open, so `Reveal` collects its rows fresh each
 * time it opens rather than depending on a scroll trigger armed before the
 * archive existed in the DOM; its CSS resting state is fully visible either
 * way, so opening it never depends on the reveal having run.
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
                <Reveal as='ul' className='project-archive__list'>
                    {items.map((item) => (
                        <ArchiveRow key={item.id} item={item} />
                    ))}
                </Reveal>
            )}
        </div>
    );
}
