import { useLocale, useTranslations } from 'next-intl';
import CvDownloadAction from '@/components/ui/CvDownloadAction';
import { cvFileName } from '@/utils/cv';
import {
    CONTACT_EMAIL,
    CONTACT_PHONE_HREF,
    CONTACT_PHONE_INTL,
    CONTACT_LINKEDIN_URL,
    CONTACT_LINKEDIN_DISPLAY,
} from '@/data/contact';

interface ContactCardItem {
    label: string;
    href: string;
    value: string;
    isExternal: boolean;
}

function ContactCard({ label, href, value, isExternal }: Readonly<ContactCardItem>) {
    return (
        <a
            href={href}
            target={isExternal ? '_blank' : undefined}
            rel={isExternal ? 'noopener noreferrer' : undefined}
            className='panel-card panel-card--lift contact-card'>
            <span className='contact-card__label'>{label}</span>
            <span className='contact-card__value'>{value}</span>
        </a>
    );
}

type TranslateFn = (key: string) => string;

function buildContactCards(t: TranslateFn): ContactCardItem[] {
    return [
        {
            label: t('email_label'),
            href: `mailto:${CONTACT_EMAIL}`,
            value: CONTACT_EMAIL,
            isExternal: false,
        },
        {
            label: t('phone_label'),
            href: CONTACT_PHONE_HREF,
            value: CONTACT_PHONE_INTL,
            isExternal: false,
        },
        {
            label: t('linkedin_label'),
            href: CONTACT_LINKEDIN_URL,
            value: CONTACT_LINKEDIN_DISPLAY,
            isExternal: true,
        },
    ];
}

export default function Contact() {
    const t = useTranslations('contact');
    const cards = buildContactCards(t);

    return (
        <section
            id='contact'
            aria-labelledby='contact-title'
            className='section-band'>
            <div className='contact-section-inner'>
                {/* Contact keeps its own centred header rather than
                    SectionHeader: the closing section runs a wider title and a
                    narrower column to signal an ending. */}
                <p className='section-kicker'>
                    <span className='section-kicker__prompt' aria-hidden='true'>$</span>{' '}
                    mail jefry
                </p>
                <h2 id='contact-title' className='contact-title'>{t('title')}</h2>
                <p className='contact-desc'>{t('description')}</p>
                <div className='contact-grid'>
                    {cards.map((card) => (
                        <ContactCard key={card.href} {...card} />
                    ))}
                </div>
                <ContactCvPanel />
            </div>
        </section>
    );
}

/**
 * The page's closing action. Until this existed the CV lived only in the hero,
 * ~14,000px above the point where a reader actually decides to take it. Built as
 * a panel rather than a bare button so the offer is stated rather than implied.
 *
 * It is deliberately *not* a fourth contact card. It used to open with the same
 * mono-uppercase label the three cards above it use, which made the page's most
 * important click read as a peer of "CALL ME" — and it centred ~500px of content
 * inside a 900px panel, so the one block that should close the page was also the
 * only one that failed to fill its own box. Offer on the left, action on the
 * right, and its own three-rung hierarchy: title, lead, artifact.
 */
function ContactCvPanel() {
    const t = useTranslations('contact');
    const tCv = useTranslations('cv');
    const locale = useLocale();
    return (
        <div className='panel-card contact-cta'>
            <div className='contact-cta__offer'>
                <p className='contact-cta__title'>{t('cv_label')}</p>
                <p className='contact-cta__lead'>{t('cv_lead')}</p>
                {/* What the recruiter is about to receive, named before the
                    click rather than only in the success notice: the exact file
                    that lands in their Downloads folder, from the same function
                    that names it there. Neither string is a claim — one is
                    computed from the locale, the other is the locale. */}
                <p className='contact-cta__meta'>
                    {cvFileName(locale)} · {tCv('language_name')}
                </p>
            </div>
            <CvDownloadAction
                className='cv-action'
                buttonClassName='btn-primary'
            />
        </div>
    );
}
