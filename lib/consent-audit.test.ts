import { describe, expect, it } from 'vitest';
import { consentAuditPayloadSchema, inferConsentAuditAction } from '@/lib/consent-audit';

describe('consent audit payloads', () => {
  it('classifies all optional categories accepted as accept_all', () => {
    expect(
      inferConsentAuditAction({
        necessary: true,
        functional: true,
        measurement: true,
        marketing: true,
      })
    ).toBe('accept_all');
  });

  it('classifies all optional categories denied as reject_all', () => {
    expect(
      inferConsentAuditAction({
        necessary: true,
        functional: false,
        measurement: false,
        marketing: false,
      })
    ).toBe('reject_all');
  });

  it('accepts the compact audit payload shape', () => {
    expect(() =>
      consentAuditPayloadSchema.parse({
        subjectId: 'subject_123456789',
        action: 'save_preferences',
        policyVersion: '2026-05-12',
        categories: {
          necessary: true,
          functional: true,
          measurement: false,
          marketing: false,
        },
        locale: 'en',
      })
    ).not.toThrow();
  });
});
