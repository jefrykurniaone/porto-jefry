import { useLocale, useTranslations } from 'next-intl';
import SectionHeader from '@/components/ui/SectionHeader';
import Reveal from '@/components/ui/Reveal';
import CvDownloadAction from '@/components/ui/CvDownloadAction';
import { cvFileName } from '@/utils/cv';
import {
    CONTACT_EMAIL,
    CONTACT_PHONE_HREF,
    CONTACT_PHONE_INTL,
    CONTACT_LINKEDIN_URL,
    CONTACT_LINKEDIN_DISPLAY,
} from '@/data/contact';

interface ContactRowItem {
    label: string;
    href: string;
    value: string;
    isExternal: boolean;
}

/** One ruled row: the entry's Label in the left column, its live link on the
 * right — the same shape `.exp-row` and `.skill-row` use elsewhere. */
function ContactRow({ label, href, value, isExternal }: Readonly<ContactRowItem>) {
    return (
        <div className='contact-row'>
            <p className='contact-row__label'>{label}</p>
            <a
                href={href}
                target={isExternal ? '_blank' : undefined}
                rel={isExternal ? 'noopener noreferrer' : undefined}
                className='contact-row__value'>
                {value}
            </a>
        </div>
    );
}

type TranslateFn = (key: string) => string;

function buildContactRows(t: TranslateFn): ContactRowItem[] {
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

/**
 * The page's closing action: the offer on the left, the CV download on the
 * right, ruled off from the entries above by a hairline rather than a panel.
 * `CvDownloadAction` owns the busy/success/error states; this only frames it.
 */
function ContactCvPanel() {
    const t = useTranslations('contact');
    const tCv = useTranslations('cv');
    const locale = useLocale();
    return (
        <Reveal className='contact-cta'>
            <div className='contact-cta__offer'>
                <p className='contact-cta__title'>{t('cv_label')}</p>
                <p className='contact-cta__lead'>{t('cv_lead')}</p>
                {/* The exact file the download hands the visitor, named before
                    the click, from the same function that names it there. */}
                <p className='contact-cta__meta'>
                    {cvFileName(locale)} · {tCv('language_name')}
                </p>
            </div>
            <CvDownloadAction
                className='cv-action'
                buttonClassName='btn-primary'
            />
        </Reveal>
    );
}

export default function Contact() {
    const t = useTranslations('contact');
    const rows = buildContactRows(t);

    return (
        <section
            id='contact'
            aria-labelledby='contact-title'
            className='section-band'>
            <div className='container-page section-inner'>
                <SectionHeader title={t('title')} titleId='contact-title' />
                <p className='contact-desc'>{t('description')}</p>
                <Reveal className='contact-rows'>
                    {rows.map((row) => (
                        <ContactRow key={row.href} {...row} />
                    ))}
                </Reveal>
                <ContactCvPanel />
            </div>
        </section>
    );
}
