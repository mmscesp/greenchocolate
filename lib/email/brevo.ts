type BrevoRecipient = {
  email: string;
  name?: string | null;
};

export type BrevoEmailInput = {
  to: BrevoRecipient[];
  subject: string;
  htmlContent: string;
  textContent?: string;
};

export type BrevoSendResult = {
  success: boolean;
  skipped?: boolean;
  error?: string;
};

export async function sendBrevoEmail(input: BrevoEmailInput): Promise<BrevoSendResult> {
  const { getServerEnv } = await import('@/lib/env');
  const env = getServerEnv();

  if (!env.BREVO_API_KEY || !env.BREVO_SENDER_EMAIL) {
    return {
      success: false,
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
      to: input.to.map((recipient) => ({
        email: recipient.email,
        ...(recipient.name ? { name: recipient.name } : {}),
      })),
      subject: input.subject,
      htmlContent: input.htmlContent,
      ...(input.textContent ? { textContent: input.textContent } : {}),
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    return {
      success: false,
      error: `Brevo error ${response.status}: ${errorText}`,
    };
  }

  return { success: true };
}
