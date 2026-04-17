import { ContactInquiryCategory } from '@prisma/client';

export const contactInquiryCategoryOptions: Array<{
  value: ContactInquiryCategory;
  label: string;
  description: string;
}> = [
  {
    value: ContactInquiryCategory.GENERAL_SUPPORT,
    label: 'General support',
    description: 'Questions about the platform, account help, or a support issue.',
  },
  {
    value: ContactInquiryCategory.LISTING_CORRECTION,
    label: 'Listing correction',
    description: 'A club page detail, image, or public listing needs an update.',
  },
  {
    value: ContactInquiryCategory.CLUB_OPERATOR,
    label: 'Club operator',
    description: 'An operator wants help with their listing or a club-side workflow.',
  },
  {
    value: ContactInquiryCategory.EDITORIAL,
    label: 'Editorial',
    description: 'A guide, article, or content detail needs clarification or correction.',
  },
  {
    value: ContactInquiryCategory.PARTNERSHIP,
    label: 'Partnership',
    description: 'A collaboration, media, or business development request.',
  },
  {
    value: ContactInquiryCategory.SAFETY_KIT,
    label: 'Safety Kit',
    description: 'A question related to the free Safety Kit or lead capture experience.',
  },
];

export const initialContactInquiryState = {
  status: 'idle',
  message: '',
} as const;

export type ContactInquiryFormState = {
  status: 'idle' | 'success' | 'error';
  message: string;
  inquiryId?: string;
};
