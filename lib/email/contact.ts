import { CommunicationAudience, EmailProviderRoute } from '@prisma/client';
import { enqueueAndProcessEmailOutbox } from '@/lib/communications/outbox';
import type { TransactionalEmailSendResult } from '@/lib/email/service';
import { publicEnv } from '@/lib/env';
import { isLocale, type Locale } from '@/lib/i18n-config';

type ContactInquiryEmailContext = {
  inquiryId: string;
  email: string;
  name: string;
  locale?: string | null;
  categoryLabel: string;
};

const inquiryCopy: Record<
  Locale,
  {
    subject: string;
    title: string;
    intro: string;
    outro: string;
    followUpLabel: string;
  }
> = {
  en: {
    subject: 'We received your SocialClubsMaps message',
    title: 'Message received',
    intro: 'We have your message and will review it from the admin desk as soon as possible.',
    outro: 'If your note is time-sensitive, keep the request reference below handy when you follow up.',
    followUpLabel: 'Open the contact page',
  },
  es: {
    subject: 'Hemos recibido tu mensaje en SocialClubsMaps',
    title: 'Mensaje recibido',
    intro: 'Ya tenemos tu mensaje y lo revisaremos desde el panel operativo lo antes posible.',
    outro: 'Si es urgente, conserva la referencia de solicitud de abajo cuando vuelvas a escribir.',
    followUpLabel: 'Abrir la pagina de contacto',
  },
  fr: {
    subject: 'Nous avons bien recu votre message SocialClubsMaps',
    title: 'Message recu',
    intro: 'Nous avons bien recu votre message et notre equipe l examinera depuis le centre operationnel des que possible.',
    outro: 'Si votre demande est urgente, gardez la reference ci-dessous pour tout suivi.',
    followUpLabel: 'Ouvrir la page contact',
  },
  de: {
    subject: 'Deine Nachricht an SocialClubsMaps ist eingegangen',
    title: 'Nachricht eingegangen',
    intro: 'Wir haben deine Nachricht erhalten und prufen sie so schnell wie moglich im Operations-Center.',
    outro: 'Wenn dein Anliegen dringend ist, halte die unten stehende Referenz fur Ruckfragen bereit.',
    followUpLabel: 'Kontaktseite offnen',
  },
};

function resolveLocale(locale?: string | null): Locale {
  return locale && isLocale(locale) ? locale : 'en';
}

function getContactUrl(locale: Locale) {
  const path = `/${locale}/contact`;
  const appUrl = publicEnv.NEXT_PUBLIC_APP_URL?.replace(/\/$/, '');
  return appUrl ? `${appUrl}${path}` : path;
}

export async function sendContactInquiryReceivedEmail(
  context: ContactInquiryEmailContext
): Promise<TransactionalEmailSendResult> {
  const locale = resolveLocale(context.locale);
  const copy = inquiryCopy[locale];
  const contactUrl = getContactUrl(locale);

  try {
    const result = await enqueueAndProcessEmailOutbox({
      type: 'CONTACT_INQUIRY_RECEIVED_EMAIL',
      audience: CommunicationAudience.TRANSACTIONAL,
      route: EmailProviderRoute.TRANSACTIONAL,
      relatedRequestId: context.inquiryId,
      recipientEmail: context.email,
      locale,
      subject: copy.subject,
      idempotencyKey: `contact-inquiry:${context.inquiryId}`,
      payload: {
        route: EmailProviderRoute.TRANSACTIONAL,
        input: {
          to: [{ email: context.email, name: context.name || undefined }],
          subject: copy.subject,
          htmlContent: `
            <div style="font-family:Arial,sans-serif;line-height:1.6;color:#111827;max-width:640px;margin:0 auto;padding:24px;">
              <div style="margin-bottom:24px;">
                <div style="font-size:12px;letter-spacing:0.12em;text-transform:uppercase;color:#6b7280;">SocialClubsMaps</div>
                <h1 style="margin:8px 0 0;font-size:28px;">${copy.title}</h1>
              </div>
              <p>Hello ${context.name},</p>
              <p>${copy.intro}</p>
              <p><strong>Topic:</strong> ${context.categoryLabel}</p>
              <p><a href="${contactUrl}">${copy.followUpLabel}</a></p>
              <p>${copy.outro}</p>
              <p style="margin-top:32px;color:#4b5563;">Request reference: <strong>${context.inquiryId}</strong></p>
            </div>
          `,
          textContent: [
            copy.title,
            '',
            `Hello ${context.name},`,
            copy.intro,
            '',
            `Topic: ${context.categoryLabel}`,
            contactUrl,
            '',
            copy.outro,
            '',
            `Request reference: ${context.inquiryId}`,
          ].join('\n'),
          idempotencyKey: `contact-inquiry:${context.inquiryId}`,
          tags: [{ name: 'category', value: 'contact_inquiry' }],
        },
      },
    });

    if (result.provider === 'BREVO') {
      return {
        success: false,
        provider: 'RESEND',
        error: 'Unexpected provider response for transactional contact inquiry email.',
      };
    }

    return result;
  } catch (error) {
    return {
      success: false,
      provider: 'RESEND',
      error: error instanceof Error ? error.message : 'Unknown email error',
    };
  }
}
