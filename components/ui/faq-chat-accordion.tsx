'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import * as Accordion from '@radix-ui/react-accordion';
import { Minus, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

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

const defaultData: FAQItem[] = [
  {
    answer: 'A Cannabis Social Club (CSC) is a private, non-profit association in Spain where members can consume cannabis together in a social setting. Unlike Amsterdam coffee shops, CSCs are private membership-only establishments with strict protocols.',
    icon: '🌿',
    iconPosition: 'left',
    id: 1,
    question: 'What is a Cannabis Social Club?',
  },
  {
    answer: 'Yes, but with specific constraints. CSCs operate in a legal gray area - they are not explicitly legal or illegal. The Spanish Constitutional Court has ruled that personal consumption and private cultivation are constitutional rights, but public consumption remains prohibited.',
    icon: '⚖️',
    iconPosition: 'left',
    id: 2,
    question: 'Are CSCs Legal in Spain?',
  },
  {
    answer: 'It varies by club. Many Barcelona CSCs require proof of residence (utility bill, rental agreement) alongside ID. Some accept tourists with EU ID or passport. Always bring multiple forms of identification.',
    icon: '🪪',
    iconPosition: 'left',
    id: 3,
    question: 'Can Tourists Join a CSC?',
  },
  {
    answer: 'Public possession can result in fines ranging from €601 to €30,000, depending on the amount and circumstances. Personal use quantities are typically lower fines. Our downloadable Safety Kit covers exact limits and how to handle encounters.',
    icon: '🍪',
    iconPosition: 'left',
    id: 4,
    question: 'What Happens in Public?',
  },
  {
    answer: 'Barcelona has a more established scene with 100+ clubs and clearer local regulations. Madrid scene is newer and more fragmented. Each city has different local ordinances.',
    icon: '🏙️',
    iconPosition: 'left',
    id: 5,
    question: 'Barcelona vs Madrid CSCs?',
  },
  {
    answer: 'Yes. Every club in our directory undergoes a verification process covering legal compliance, safety standards, membership accessibility, and community feedback.',
    icon: '✅',
    iconPosition: 'left',
    id: 6,
    question: 'Does SocialClubsMaps Verify Clubs?',
  },
  {
    answer: 'Membership fees vary significantly - from €20 for basic access to €100+ annually for premium clubs. Many clubs also require a small purchase per visit (typically €10-25) for cannabis products.',
    icon: '💰',
    iconPosition: 'left',
    id: 7,
    question: 'How Much Does Membership Cost?',
  },
  {
    answer: 'Typical requirements include: valid ID/passport, minimum age (18-21 depending on club), potentially proof of address, and a one-time membership fee. Some clubs also require a current member referral.',
    icon: '📋',
    iconPosition: 'left',
    id: 8,
    question: 'What Are the Membership Requirements?',
  },
];

export function FaqAccordion({
  data = defaultData,
  className,
  timestamp = 'Frequently Asked Questions',
  questionClassName,
  answerClassName,
}: FaqAccordionProps) {
  const [openItem, setOpenItem] = React.useState<string | null>(null);

  return (
    <div className={cn('', className)}>
      {timestamp && (
        <div className='mb-6 text-lg text-muted-foreground'>{timestamp}</div>
      )}

      <Accordion.Root
        type='single'
        collapsible
        value={openItem || ''}
        onValueChange={(value: string | null) => setOpenItem(value)}
      >
        {data.map((item) => (
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
