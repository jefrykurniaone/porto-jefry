import { useTranslations } from 'next-intl';
import SectionHeader from '@/components/ui/SectionHeader';
import {
    CONTACT_EMAIL,
    CONTACT_PHONE_HREF,
    CONTACT_PHONE_INTL,
    CONTACT_LINKEDIN_URL,
    CONTACT_LINKEDIN_HANDLE,
    CONTACT_GITHUB_URL,
    CONTACT_GITHUB_HANDLE,
} from '@/data/contact';

interface ContactChip {
    href: string;
    icon: React.ReactNode;
    text: string;
    label: string;
    isExternal: boolean;
}

/**
 * Mail and phone are drawn, not typed. The glyphs they replaced (`✉`, `✆`) fall
 * back to whatever font has them: U+2706 renders on Windows as a circle with a
 * diagonal slash, which reads as "do not call" next to a phone number. LinkedIn
 * and GitHub keep their `in` / `gh` mono wordmarks — those are lettering, not
 * icons, and the mono face is exactly right for them.
 *
 * 1.4px strokes on a 16px box, inheriting currentColor, so they sit at the same
 * weight as every other hairline in the system.
 */
function IconStroke({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <svg
            viewBox='0 0 16 16'
            width='14'
            height='14'
            fill='none'
            stroke='currentColor'
            strokeWidth='1.4'
            strokeLinecap='round'
            strokeLinejoin='round'
            aria-hidden='true'
            focusable='false'>
            {children}
        </svg>
    );
}

const MailIcon = (
    <IconStroke>
        <rect x='1.4' y='3.2' width='13.2' height='9.6' rx='1.6' />
        <path d='M1.9 4.4 8 8.9l6.1-4.5' />
    </IconStroke>
);

const PhoneIcon = (
    <IconStroke>
        <path d='M5.2 1.9 6.9 5 5.5 6.5a8.4 8.4 0 0 0 4 4L11 9.1l3.1 1.7v2.2c0 .6-.5 1.1-1.1 1A11.6 11.6 0 0 1 2 3.1c0-.6.4-1.1 1-1.1h2.2Z' />
    </IconStroke>
);

function AboutContactChips({ chips }: Readonly<{ chips: ContactChip[] }>) {
    return (
        <div className='contact-chips'>
            {chips.map((chip) => (
                <a
                    key={chip.href}
                    href={chip.href}
                    aria-label={chip.label}
                    target={chip.isExternal ? '_blank' : undefined}
                    rel={chip.isExternal ? 'noopener noreferrer' : undefined}
                    className='contact-chip'>
                    <span className='contact-chip__icon' aria-hidden='true'>{chip.icon}</span>
                    {chip.text}
                </a>
            ))}
        </div>
    );
}

interface TerminalLines {
    whoami: string;
    stack: string;
    ai: string;
    status: string;
}

/**
 * One `$ command` / output pair. Commands stay English — they are code. So does
 * the `status` output: it reads as a machine-printed availability string, not as
 * a sentence addressed to the visitor, and half-translating it produced the
 * mixed-language line ("remote penuh waktu & relokasi · freelance welcome") that
 * shipped before.
 */
function TerminalLine({ cmd, out }: Readonly<{ cmd: string; out: React.ReactNode }>) {
    return (
        <>
            <div><span className='terminal__prompt'>$</span> <span className='terminal__cmd'>{cmd}</span></div>
            <div className='terminal__out'>{out}</div>
        </>
    );
}

function TerminalCard({ lines }: Readonly<{ lines: TerminalLines }>) {
    return (
        <div className='terminal'>
            <div className='terminal__bar'>
                <span className='terminal__dot' />
                <span className='terminal__dot' />
                <span className='terminal__dot terminal__dot--accent' />
                <span className='terminal__title'>jefry-kurniawan</span>
            </div>
            <div className='terminal__body'>
                <TerminalLine cmd='whoami' out={lines.whoami} />
                <TerminalLine cmd='stack --primary' out={lines.stack} />
                <TerminalLine cmd='ai --workflow' out={lines.ai} />
                <TerminalLine
                    cmd='status'
                    out={<><span className='terminal__ok'>●</span> {lines.status}</>}
                />
                <div><span className='terminal__cursor' aria-hidden='true'>▌</span></div>
            </div>
        </div>
    );
}

function useAboutChips(): ContactChip[] {
    const t = useTranslations('about');
    return [
        { href: `mailto:${CONTACT_EMAIL}`, icon: MailIcon, text: CONTACT_EMAIL, label: t('contact_email'), isExternal: false },
        { href: CONTACT_PHONE_HREF, icon: PhoneIcon, text: CONTACT_PHONE_INTL, label: t('contact_phone'), isExternal: false },
        { href: CONTACT_LINKEDIN_URL, icon: 'in', text: `linkedin/${CONTACT_LINKEDIN_HANDLE}`, label: t('contact_linkedin'), isExternal: true },
        { href: CONTACT_GITHUB_URL, icon: 'gh', text: `github/${CONTACT_GITHUB_HANDLE}`, label: t('contact_github'), isExternal: true },
    ];
}

export default function About() {
    const t = useTranslations('about');
    const chips = useAboutChips();

    return (
        <section
            id='about'
            aria-labelledby='about-title'
            className='section-band section-band--alt'>
            <div className='container-page section-inner'>
                {/* No output line here — the terminal card below is the output. */}
                <SectionHeader
                    command='cat about.md'
                    title={t('title')}
                    titleId='about-title'
                />
                <div className='about-grid'>
                    {/* Paragraphs, not one block. The bio ran ~230 words as a
                        single 26-line wall on a 390px screen, which is where a
                        phone reader gave up. Same words, three entry points. */}
                    <div className='about-prose'>
                        {(t.raw('description') as string[]).map((paragraph) => (
                            <p key={paragraph} className='about-desc'>{paragraph}</p>
                        ))}
                    </div>
                    <TerminalCard
                        lines={{
                            whoami: t('term_whoami'),
                            stack: t('term_stack'),
                            ai: t('term_ai'),
                            status: t('term_status'),
                        }}
                    />
                </div>
                <AboutContactChips chips={chips} />
            </div>
        </section>
    );
}
