import { c15tInstance, policyBuilder } from '@c15t/backend';
import { prismaAdapter } from '@c15t/backend/db/adapters/prisma';
import { prisma } from '@/lib/prisma';
import { getBaseUrl } from '@/lib/seo';

function getTrustedOrigins(): string[] {
  const configured = process.env.C15T_TRUSTED_ORIGINS?.split(',')
    .map((origin) => origin.trim())
    .filter(Boolean) ?? [];

  return Array.from(new Set([getBaseUrl(), ...configured]));
}

export const c15t = c15tInstance({
  appName: 'SocialClubsMaps',
  basePath: '/api/c15t',
  adapter: prismaAdapter({
    provider: 'postgresql',
    prisma,
  }),
  tablePrefix: 'c15t_',
  trustedOrigins: getTrustedOrigins(),
  disableGeoLocation: true,
  branding: 'none',
  ipAddress: {
    tracking: true,
    masking: true,
  },
  policyPacks: [
    policyBuilder.create({
      id: 'scm-default-cookie-consent',
      isDefault: true,
      model: 'opt-in',
      categories: ['necessary', 'functional', 'measurement', 'marketing'],
      uiMode: 'banner',
      expiryDays: 730,
      proof: {
        storeIp: true,
        storeUserAgent: true,
        storeLanguage: true,
      },
    }),
  ],
});
