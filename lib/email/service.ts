import { sendBrevoEmail, type BrevoEmailInput, type BrevoSendResult } from '@/lib/email/brevo';
import { sendResendEmail, type ResendEmailInput, type ResendSendResult } from '@/lib/email/resend';

export type TransactionalEmailInput = ResendEmailInput;
export type TransactionalEmailSendResult = ResendSendResult;
export type MarketingEmailInput = BrevoEmailInput;
export type MarketingEmailSendResult = BrevoSendResult;

export async function sendTransactionalEmail(
  input: TransactionalEmailInput
): Promise<TransactionalEmailSendResult> {
  return sendResendEmail(input);
}

export async function sendMarketingEmail(input: MarketingEmailInput): Promise<MarketingEmailSendResult> {
  return sendBrevoEmail(input);
}
