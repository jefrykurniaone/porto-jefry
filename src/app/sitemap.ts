import { MetadataRoute } from 'next';
import { BASE_URL, LAST_MODIFIED_DATE } from '@/utils/constants';

export default function sitemap(): MetadataRoute.Sitemap {
    return [
        {
            url: `${BASE_URL}/en`,
            lastModified: new Date(LAST_MODIFIED_DATE),
            alternates: { languages: { id: `${BASE_URL}/id`, 'x-default': `${BASE_URL}/en` } },
        },
        {
            url: `${BASE_URL}/id`,
            lastModified: new Date(LAST_MODIFIED_DATE),
            alternates: { languages: { en: `${BASE_URL}/en`, 'x-default': `${BASE_URL}/en` } },
        },
    ];
}
