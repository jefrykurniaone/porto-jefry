import { BASE_URL } from '@/utils/constants';
import { experiences } from '@/data/experience';
import { education } from '@/data/education';
import { skillCategories } from '@/data/skills';
import {
    CONTACT_EMAIL,
    CONTACT_PHONE_INTL,
    CONTACT_LINKEDIN_URL,
    CONTACT_GITHUB_URL,
} from '@/data/contact';

const FULL_NAME = 'Jefry Kurniawan';

/** Universities only — secondary school adds noise without adding signal. */
const alumniOf = education
    .filter((item) => item.type === 'formal' && item.major)
    .map((item) => ({ '@type': 'CollegeOrUniversity', name: item.institution }));

/** Derived from the skills data so the schema can't drift from the site. */
const knowsAbout = skillCategories.flatMap((category) => category.skills);

interface PersonJsonLdProps {
    locale: string;
    jobTitle: string;
    description: string;
}

function buildPersonSchema({ locale, jobTitle, description }: PersonJsonLdProps) {
    return {
        '@context': 'https://schema.org',
        '@type': 'Person',
        name: FULL_NAME,
        jobTitle,
        description,
        url: `${BASE_URL}/${locale}`,
        image: `${BASE_URL}/cv-photo.webp`,
        email: `mailto:${CONTACT_EMAIL}`,
        telephone: CONTACT_PHONE_INTL,
        address: {
            '@type': 'PostalAddress',
            addressCountry: 'ID',
        },
        nationality: { '@type': 'Country', name: 'Indonesia' },
        worksFor: { '@type': 'Organization', name: experiences[0].company },
        knowsLanguage: [
            { '@type': 'Language', name: 'Indonesian', alternateName: 'id' },
            { '@type': 'Language', name: 'English', alternateName: 'en' },
        ],
        alumniOf,
        knowsAbout,
        sameAs: [CONTACT_LINKEDIN_URL, CONTACT_GITHUB_URL],
    };
}

/**
 * schema.org Person graph — makes the profile machine-readable for search
 * engines and LLM-based sourcing tools.
 *
 * CSP note: this is safe without a nonce. `application/ld+json` is a data
 * block, and HTML's "prepare the script element" algorithm aborts on an
 * unrecognised type *before* reaching the CSP check, so `script-src` never
 * applies. Do NOT add a nonce here — `x-nonce` is null at runtime on Vercel
 * (see the comment in src/proxy.ts) and would break the tag.
 */
export default function PersonJsonLd(props: Readonly<PersonJsonLdProps>) {
    return (
        <script
            type='application/ld+json'
            dangerouslySetInnerHTML={{
                __html: JSON.stringify(buildPersonSchema(props)),
            }}
        />
    );
}
