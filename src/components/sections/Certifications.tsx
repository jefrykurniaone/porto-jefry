import { useTranslations } from 'next-intl';
import { certifications } from '@/data/certifications';

export default function Certifications() {
    const t = useTranslations('certifications');

    return (
        <section id='certifications' className='sgds:py-layout-lg sgds:bg-alternate'>
            <div className='sgds-container'>
                <h2 className='sgds:text-heading-lg sgds:font-semibold sgds:text-heading-default sgds:mb-layout-md sgds:text-center'>
                    {t('title')}
                </h2>
                <div className='sgds:max-w-md sgds:mx-auto sgds:flex sgds:flex-col sgds:gap-layout-sm'>
                    {certifications.map((cert) => (
                        <div key={cert.id}>
                            <sgds-card suppressHydrationWarning>
                                <span slot='title' className='sgds:text-heading-sm sgds:font-semibold sgds:text-heading-default sgds:flex sgds:items-center sgds:gap-component-xs'>
                                    <sgds-icon name='shield-tick' aria-hidden='true' suppressHydrationWarning />
                                    <span>{t(`${cert.id}.name`)}</span>
                                </span>
                                <span slot='description'>
                                    <p className='sgds:text-label-sm sgds:text-primary sgds:font-semibold sgds:mb-component-xs'>
                                        {t(`${cert.id}.issuer`)}
                                    </p>
                                    <p className='sgds:text-label-sm sgds:text-muted sgds:mb-component-xs'>
                                        {t(`${cert.id}.period`)}
                                    </p>
                                    <p className='sgds:text-body-md sgds:text-body-default sgds:leading-xs'>
                                        {t(`${cert.id}.description`)}
                                    </p>
                                </span>
                            </sgds-card>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
