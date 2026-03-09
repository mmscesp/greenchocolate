'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { useLanguage } from '@/hooks/useLanguage';

export function FaqAccordion() {
  const { t } = useLanguage();
  const faqItems = [
    {
      id: '1',
      title: t('faq.1.title'),
      content: t('faq.1.content'),
    },
    {
      id: '2',
      title: t('faq.2.title'),
      content: t('faq.2.content'),
    },
    {
      id: '3',
      title: t('faq.3.title'),
      content: t('faq.3.content'),
    },
    {
      id: '4',
      title: t('faq.4.title'),
      content: t('faq.4.content'),
    },
    {
      id: '5',
      title: t('faq.5.title'),
      content: t('faq.5.content'),
    },
    {
      id: '6',
      title: t('faq.6.title'),
      content: t('faq.6.content'),
    },
    {
      id: '7',
      title: t('faq.7.title'),
      content: t('faq.7.content'),
    },
    {
      id: '8',
      title: t('faq.8.title'),
      content: t('faq.8.content'),
    },
  ];

  return (
    <div className='w-full max-w-4xl mx-auto px-4 sm:px-6'>
      <Accordion type='single' collapsible className='w-full'>
        {faqItems.map((item) => (
          <AccordionItem value={item.id} key={item.id} className='border-b border-gray-200'>
            <AccordionTrigger className='text-left px-4 py-4 hover:no-underline cursor-pointer text-gray-900'>
              <div className='flex items-start gap-4 text-left'>
                <p className='text-xs font-bold text-green-600 uppercase tracking-widest shrink-0 mt-1'>
                  {item.id}
                </p>
                <h3 className='text-base md:text-lg font-semibold text-gray-900 text-left'>
                  {item.title}
                </h3>
              </div>
            </AccordionTrigger>

            <AccordionContent className='px-4 pb-4 ml-auto w-full'>
              <p className='text-gray-600 leading-relaxed pl-9'>
                {item.content}
              </p>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
