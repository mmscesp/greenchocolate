type BrevoRecipient = {
  email: string;
  name?: string | null;
};

type BrevoReplyTo = {
  email: string;
  name?: string | null;
};

type BrevoEmailBaseInput = {
  to: BrevoRecipient[];
  replyTo?: BrevoReplyTo | null;
  tags?: string[];
  headers?: Record<string, string>;
};

type BrevoContentEmailInput = BrevoEmailBaseInput & {
  subject: string;
  htmlContent: string;
  textContent?: string;
};

type BrevoTemplateEmailInput = BrevoEmailBaseInput & {
  templateId: number;
  params?: Record<string, unknown>;
  subject?: string;
  htmlContent?: string;
  textContent?: string;
};

export type BrevoEmailInput = BrevoContentEmailInput | BrevoTemplateEmailInput;

export type BrevoSendResult = {
  success: boolean;
  provider: 'BREVO';
  skipped?: boolean;
  error?: string;
  messageId?: string;
};

export async function sendBrevoEmail(input: BrevoEmailInput): Promise<BrevoSendResult> {
  const { getServerEnv } = await import('@/lib/env');
  const env = getServerEnv();

  if (!env.BREVO_API_KEY || !env.BREVO_SENDER_EMAIL) {
    return {
      success: false,
      provider: 'BREVO',
      skipped: true,
      error: 'Brevo is not configured.',
    };
  }

  const response = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'api-key': env.BREVO_API_KEY,
    },
    body: JSON.stringify({
      sender: {
        email: env.BREVO_SENDER_EMAIL,
        name: env.BREVO_SENDER_NAME || 'SocialClubsMaps',
      },
      ...(input.replyTo
        ? {
            replyTo: {
              email: input.replyTo.email,
              ...(input.replyTo.name ? { name: input.replyTo.name } : {}),
            },
          }
        : env.BREVO_REPLY_TO_EMAIL
          ? {
              replyTo: {
                email: env.BREVO_REPLY_TO_EMAIL,
                ...(env.BREVO_REPLY_TO_NAME ? { name: env.BREVO_REPLY_TO_NAME } : {}),
              },
            }
          : {}),
      to: input.to.map((recipient) => ({
        email: recipient.email,
        ...(recipient.name ? { name: recipient.name } : {}),
      })),
      ...('templateId' in input ? { templateId: input.templateId } : {}),
      ...('params' in input && input.params ? { params: input.params } : {}),
      ...('subject' in input && input.subject ? { subject: input.subject } : {}),
      ...('htmlContent' in input && input.htmlContent ? { htmlContent: input.htmlContent } : {}),
      ...('textContent' in input && input.textContent ? { textContent: input.textContent } : {}),
      ...(input.tags && input.tags.length > 0 ? { tags: input.tags } : {}),
      ...(input.headers && Object.keys(input.headers).length > 0 ? { headers: input.headers } : {}),
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    return {
      success: false,
      provider: 'BREVO',
      error: `Brevo error ${response.status}: ${errorText}`,
    };
  }

  const payload = (await response.json().catch(() => null)) as { messageId?: string } | null;

  return {
    success: true,
    provider: 'BREVO',
    messageId: payload?.messageId,
  };
}
