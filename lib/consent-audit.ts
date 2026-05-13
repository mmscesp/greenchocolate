import { z } from 'zod';
import type { ConsentCategoryState } from '@/lib/consent';

export const consentAuditActionSchema = z.enum([
  'accept_all',
  'reject_all',
  'save_preferences',
  'withdraw',
]);

export const consentAuditPayloadSchema = z.object({
  subjectId: z.string().min(12).max(128),
  action: consentAuditActionSchema,
  policyVersion: z.string().min(4).max(32),
  categories: z.object({
    necessary: z.literal(true),
    functional: z.boolean(),
    measurement: z.boolean(),
    marketing: z.boolean(),
  }),
  locale: z.string().min(2).max(5).optional(),
  countryCode: z.string().min(2).max(2).optional(),
});

export type ConsentAuditAction = z.infer<typeof consentAuditActionSchema>;
export type ConsentAuditPayload = z.infer<typeof consentAuditPayloadSchema>;

export function inferConsentAuditAction(
  categories: ConsentCategoryState,
  explicitAction?: ConsentAuditAction
): ConsentAuditAction {
  if (explicitAction) return explicitAction;

  const optionalValues = [categories.functional, categories.measurement, categories.marketing];
  if (optionalValues.every(Boolean)) return 'accept_all';
  if (optionalValues.every((value) => !value)) return 'reject_all';
  return 'save_preferences';
}
