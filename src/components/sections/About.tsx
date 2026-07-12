import { useTranslations } from 'next-intl';
import {
    CONTACT_EMAIL,
    CONTACT_PHONE_HREF,
    CONTACT_PHONE_DISPLAY,
    CONTACT_LINKEDIN_URL,
    CONTACT_LINKEDIN_HANDLE,
    CONTACT_GITHUB_URL,
    CONTACT_GITHUB_HANDLE,
} from '@/data/contact';

interface ContactChip {
    href: string;
    icon: string;
    text: string;
    label: string;
    isExternal: boolean;
}

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

function TerminalCard({ statusLine }: Readonly<{ statusLine: string }>) {
    return (
        <div className='terminal'>
            <div className='terminal__bar'>
                <span className='terminal__dot' />
                <span className='terminal__dot' />
                <span className='terminal__dot terminal__dot--accent' />
                <span className='terminal__title'>jefry-kurniawan</span>
            </div>
            <div className='terminal__body'>
                <div><span className='terminal__prompt'>$</span> <span className='terminal__cmd'>whoami</span></div>
                <div className='terminal__out'>jefry.kurniawan · backend developer</div>
                <div><span className='terminal__prompt'>$</span> <span className='terminal__cmd'>stack --primary</span></div>
                <div className='terminal__out'>.NET · C# · SQL Server · REST APIs</div>
                <div><span className='terminal__prompt'>$</span> <span className='terminal__cmd'>ai --workflow</span></div>
                <div className='terminal__out'>Claude · GitHub Copilot · OpenCode</div>
                <div><span className='terminal__prompt'>$</span> <span className='terminal__cmd'>status</span></div>
                <div className='terminal__out'><span className='terminal__ok'>●</span> {statusLine}</div>
                <div><span className='terminal__cursor' aria-hidden='true'>▌</span></div>
            </div>
        </div>
    );
}

export default function About() {
    const t = useTranslations('about');
    const nav = useTranslations('nav');
    const chips: ContactChip[] = [
        { href: `mailto:${CONTACT_EMAIL}`, icon: '✉', text: CONTACT_EMAIL, label: t('contact_email'), isExternal: false },
        { href: CONTACT_PHONE_HREF, icon: '✆', text: CONTACT_PHONE_DISPLAY, label: t('contact_phone'), isExternal: false },
        { href: CONTACT_LINKEDIN_URL, icon: 'in', text: `linkedin/${CONTACT_LINKEDIN_HANDLE}`, label: t('contact_linkedin'), isExternal: true },
        { href: CONTACT_GITHUB_URL, icon: 'gh', text: `github/${CONTACT_GITHUB_HANDLE}`, label: t('contact_github'), isExternal: true },
    ];

    return (
        <section id='about' className='section-band section-band--alt'>
            <div className='container-page section-inner'>
                <p className='section-kicker'>01 / {nav('about')}</p>
                <h2 className='section-title'>{t('title')}</h2>
                <div className='about-grid'>
                    <div>
                        <p className='about-desc'>{t('description')}</p>
                        <AboutContactChips chips={chips} />
                    </div>
                    <TerminalCard statusLine={t('term_status')} />
                </div>
            </div>
        </section>
    );
}
