type ResendRecipient = {
  email: string;
  name?: string | null;
};

type ResendReplyTo = {
  email: string;
  name?: string | null;
};

export type ResendEmailInput = {
  to: ResendRecipient[];
  subject: string;
  htmlContent: string;
  textContent?: string;
  replyTo?: ResendReplyTo | null;
  headers?: Record<string, string>;
  tags?: Array<{
    name: string;
    value: string;
  }>;
  idempotencyKey?: string;
};

export type ResendSendResult = {
  success: boolean;
  provider: 'RESEND';
  skipped?: boolean;
  error?: string;
  messageId?: string;
};

function formatMailbox(input: { email: string; name?: string | null }) {
  return input.name ? `${input.name} <${input.email}>` : input.email;
}

export async function sendResendEmail(input: ResendEmailInput): Promise<ResendSendResult> {
  const { getServerEnv } = await import('@/lib/env');
  const env = getServerEnv();

  if (!env.RESEND_API_KEY || !env.RESEND_SENDER_EMAIL) {
    return {
      success: false,
      provider: 'RESEND',
      skipped: true,
      error: 'Resend is not configured.',
    };
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
      ...(input.idempotencyKey ? { 'Idempotency-Key': input.idempotencyKey } : {}),
    },
    body: JSON.stringify({
      from: formatMailbox({
        email: env.RESEND_SENDER_EMAIL,
        name: env.RESEND_SENDER_NAME || 'SocialClubsMaps',
      }),
      to: input.to.map((recipient) => formatMailbox(recipient)),
      subject: input.subject,
      html: input.htmlContent,
      ...(input.textContent ? { text: input.textContent } : {}),
      ...(input.replyTo
        ? { reply_to: formatMailbox(input.replyTo) }
        : env.RESEND_REPLY_TO_EMAIL
          ? {
              reply_to: formatMailbox({
                email: env.RESEND_REPLY_TO_EMAIL,
                name: env.RESEND_REPLY_TO_NAME || null,
              }),
            }
          : {}),
      ...(input.headers && Object.keys(input.headers).length > 0 ? { headers: input.headers } : {}),
      ...(input.tags && input.tags.length > 0 ? { tags: input.tags } : {}),
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    return {
      success: false,
      provider: 'RESEND',
      error: `Resend error ${response.status}: ${errorText}`,
    };
  }

  const payload = (await response.json().catch(() => null)) as { id?: string } | null;

  return {
    success: true,
    provider: 'RESEND',
    messageId: payload?.id,
  };
}
