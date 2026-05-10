import { useTranslations } from 'next-intl';
import { MailIcon, PhoneIcon } from 'lucide-react';
import { LinkedInIcon } from '@/components/icons/LinkedInIcon';

export default function About() {
    const t = useTranslations('about');

    return (
        <section id='about' className='py-20 px-4'>
            <div className='max-w-4xl mx-auto'>
                <h2 className='text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center'>
                    {t('title')}
                </h2>
                <div className='bg-gray-50 dark:bg-gray-900 rounded-2xl p-8'>
                    <p className='text-gray-600 dark:text-gray-300 text-lg leading-relaxed mb-8'>
                        {t('description')}
                    </p>
                    <div className='flex flex-wrap gap-6'>
                        <a
                            href='mailto:jefrykurniaone@gmail.com'
                            className='inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors'>
                            <MailIcon size={18} />
                            <span>jefrykurniaone@gmail.com</span>
                        </a>
                        <a
                            href='tel:+6282126229978'
                            className='inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors'>
                            <PhoneIcon size={18} />
                            <span>0821 26 229 978</span>
                        </a>
                        <a
                            href='https://www.linkedin.com/in/jefrykurniaone/'
                            target='_blank'
                            rel='noopener noreferrer'
                            className='inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors'>
                            <LinkedInIcon size={18} />
                            <span>jefrykurniaone</span>
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}
