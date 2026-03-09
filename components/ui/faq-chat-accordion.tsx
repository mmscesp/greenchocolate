'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import * as Accordion from '@radix-ui/react-accordion';
import { Minus, Plus } from '@/lib/icons';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/hooks/useLanguage';

interface FAQItem {
  id: number;
  question: string;
  answer: string;
  icon?: string;
  iconPosition?: 'left' | 'right';
}

interface FaqAccordionProps {
  data?: FAQItem[];
  className?: string;
  timestamp?: string;
  questionClassName?: string;
  answerClassName?: string;
}

export function FaqAccordion({
  data,
  className,
  timestamp,
  questionClassName,
  answerClassName,
}: FaqAccordionProps) {
  const { t } = useLanguage();
  const [openItem, setOpenItem] = React.useState<string | null>(null);
  const resolvedData = data ?? [
    { id: 1, question: t('faq.1.title'), answer: t('faq.1.content'), icon: '🌿', iconPosition: 'left' as const },
    { id: 2, question: t('faq.2.title'), answer: t('faq.2.content'), icon: '⚖️', iconPosition: 'left' as const },
    { id: 3, question: t('faq.3.title'), answer: t('faq.3.content'), icon: '🪪', iconPosition: 'left' as const },
    { id: 4, question: t('faq.6.title'), answer: t('faq.6.content'), icon: '🍪', iconPosition: 'left' as const },
    { id: 5, question: t('faq.7.title'), answer: t('faq.7.content'), icon: '🏙️', iconPosition: 'left' as const },
    { id: 6, question: t('faq.8.title'), answer: t('faq.8.content'), icon: '✅', iconPosition: 'left' as const },
    { id: 7, question: t('faq.5.title'), answer: t('faq.5.content'), icon: '💰', iconPosition: 'left' as const },
    { id: 8, question: t('faq.4.title'), answer: t('faq.4.content'), icon: '📋', iconPosition: 'left' as const },
  ];
  const resolvedTimestamp = timestamp ?? t('faq.timestamp');

  return (
    <div className={cn('', className)}>
      {resolvedTimestamp && (
        <div className='mb-6 text-lg text-muted-foreground'>{resolvedTimestamp}</div>
      )}

      <Accordion.Root
        type='single'
        collapsible
        value={openItem || ''}
        onValueChange={(value: string | null) => setOpenItem(value)}
      >
        {resolvedData.map((item) => (
          <Accordion.Item value={item.id.toString()} key={item.id} className='mb-4'>
            <Accordion.Header>
              <Accordion.Trigger className='flex w-full items-center justify-start gap-x-4'>
                <div
                  className={cn(
                    'relative flex items-center gap-3 rounded-2xl p-4 transition-colors w-full text-left',
                    openItem === item.id.toString()
                      ? 'bg-primary/10 text-primary'
                      : 'bg-muted hover:bg-primary/5',
                    questionClassName
                  )}
                >
                  {item.icon && (
                    <span
                      className='text-2xl'
                      style={{
                        transform: item.iconPosition === 'right'
                          ? 'rotate(7deg)'
                          : 'rotate(-4deg)',
                      }}
                    >
                      {item.icon}
                    </span>
                  )}

                  <span className='font-semibold text-lg'>{item.question}</span>

                  <span
                    className={cn(
                      'ml-auto shrink-0',
                      openItem === item.id.toString() && 'text-primary'
                    )}
                  >
                    {openItem === item.id.toString() ? (
                      <Minus className='h-5 w-5' />
                    ) : (
                      <Plus className='h-5 w-5' />
                    )}
                  </span>
                </div>
              </Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Content asChild forceMount>
              <motion.div
                initial='collapsed'
                animate={openItem === item.id.toString() ? 'open' : 'collapsed'}
                variants={{
                  open: { opacity: 1, height: 'auto' },
                  collapsed: { opacity: 0, height: 0 },
                }}
                transition={{ duration: 0.3 }}
                className='overflow-hidden'
              >
                <div className='mt-2 ml-4'>
                  <div
                    className={cn(
                      'relative rounded-2xl bg-muted/50 px-6 py-4 text-base leading-relaxed',
                      answerClassName
                    )}
                  >
                    {item.answer}
                  </div>
                </div>
              </motion.div>
            </Accordion.Content>
          </Accordion.Item>
        ))}
      </Accordion.Root>
    </div>
  );
}
