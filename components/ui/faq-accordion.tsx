'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { PlusIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

const faqItems = [
  {
    id: '1',
    title: 'What is a Cannabis Social Club?',
    content:
      'A Cannabis Social Club (CSC) is a private, non-profit association in Spain where members can consume cannabis together in a social setting. Unlike Amsterdam coffee shops, CSCs are private会员-only establishments with strict protocols.',
  },
  {
    id: '2',
    title: 'Are CSCs Legal in Spain?',
    content:
      'Yes, but with specific constraints. CSCs operate in a legal gray area—they\'re not explicitly legal or illegal. The Spanish Constitutional Court has ruled that personal consumption and private cultivation are constitutional rights, but public consumption remains prohibited.',
  },
  {
    id: '3',
    title: 'Can Tourists Join a CSC?',
    content:
      'It varies by club. Many Barcelona CSCs require proof of residence (utility bill, rental agreement) alongside ID. Some accept tourists with EU ID or passport. Always bring multiple forms of identification and be prepared for application processes.',
  },
  {
    id: '4',
    title: 'What Are the Membership Requirements?',
    content:
      'Typical requirements include: valid ID/passport, minimum age (18-21 depending on club), potentially proof of address, and a one-time membership fee. Some clubs also require a current member referral.',
  },
  {
    id: '5',
    title: 'How Much Does Membership Cost?',
    content:
      'Membership fees vary significantly—from €20 for basic access to €100+ annually for premium clubs. Many clubs also require a small purchase per visit (typically €10-25) for cannabis products.',
  },
  {
    id: '6',
    title: 'What Happens in Public?',
    content:
      'Public possession can result in fines ranging from €601 to €30,000, depending on the amount and circumstances. Personal use quantities are typically lower fines. Our downloadable Safety Kit covers exact limits and how to handle encounters.',
  },
  {
    id: '7',
    title: 'Barcelona vs Madrid CSCs?',
    content:
      'Barcelona has a more established scene with 100+ clubs and clearer local regulations. Madrid\'s scene is newer and more fragmented. Each city has different local ordinances—always check our city-specific guides before visiting.',
  },
  {
    id: '8',
    title: 'Does SocialClubsMaps Verify Clubs?',
    content:
      'Yes. Every club in our directory undergoes a verification process covering legal compliance, safety standards, membership accessibility, and community feedback. Look for our verified badge when browsing.',
  },
];

export function FaqAccordion() {
  return (
    <div className='w-full max-w-4xl mx-auto px-4 sm:px-6'>
      <Accordion type='single' defaultValue='5' collapsible className='w-full'>
        {faqItems.map((item) => (
          <AccordionItem value={item.id} key={item.id} className='last:border-b'>
            <AccordionTrigger className='text-left px-4 md:px-8 overflow-hidden text-foreground/60 duration-200 hover:no-underline cursor-pointer data-[state=open]:text-green-600 [&>svg]:hidden'>
              <div className='flex items-start gap-3 md:gap-4 text-left'>
                <p className='text-xs font-bold text-green-600 uppercase tracking-widest shrink-0 mt-1'>
                  {item.id}
                </p>
                <h1
                  className={`uppercase relative text-xl md:text-3xl font-bold text-zinc-900 text-left leading-tight`}
                >
                  {item.title}
                </h1>
              </div>
            </AccordionTrigger>

            <AccordionContent className='text-zinc-600 pb-6 px-4 md:px-12 ml-auto w-full max-w-[calc(100%-2rem)] md:max-w-[calc(100%-5rem)]'>
              {item.content}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
