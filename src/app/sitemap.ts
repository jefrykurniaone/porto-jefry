import { MetadataRoute } from 'next';

const BASE_URL = 'https://porto-jefry.vercel.app';

export default function sitemap(): MetadataRoute.Sitemap {
    return [
        {
            url: `${BASE_URL}/en`,
            lastModified: new Date(),
            alternates: { languages: { id: `${BASE_URL}/id`, 'x-default': `${BASE_URL}/en` } },
        },
        {
            url: `${BASE_URL}/id`,
            lastModified: new Date(),
            alternates: { languages: { en: `${BASE_URL}/en`, 'x-default': `${BASE_URL}/en` } },
        },
    ];
}
