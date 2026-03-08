import { sendBrevoEmail } from '@/lib/email/brevo';

type MembershipEmailContext = {
  applicantEmail: string;
  applicantName?: string | null;
  clubName: string;
  requestId: string;
  notes?: string | null;
};

function wrapHtml(title: string, body: string, requestId: string): string {
  return `
    <div style="font-family:Arial,sans-serif;line-height:1.6;color:#111827;max-width:640px;margin:0 auto;padding:24px;">
      <div style="margin-bottom:24px;">
        <div style="font-size:12px;letter-spacing:0.12em;text-transform:uppercase;color:#6b7280;">SocialClubsMaps</div>
        <h1 style="margin:8px 0 0;font-size:28px;">${title}</h1>
      </div>
      ${body}
      <p style="margin-top:32px;color:#4b5563;">Request reference: <strong>${requestId}</strong></p>
    </div>
  `;
}

function notesBlock(notes?: string | null): string {
  if (!notes) {
    return '';
  }

  return `<p><strong>Notes from our team:</strong><br/>${notes.replace(/\n/g, '<br/>')}</p>`;
}

async function sendMembershipEmail(
  context: MembershipEmailContext,
  title: string,
  subject: string,
  body: string
) {
  return sendBrevoEmail({
    to: [
      {
        email: context.applicantEmail,
        name: context.applicantName || undefined,
      },
    ],
    subject,
    htmlContent: wrapHtml(title, body, context.requestId),
    textContent: `${title}\n\n${body.replace(/<br\/>/g, '\n').replace(/<[^>]+>/g, '')}\n\nRequest reference: ${context.requestId}`,
  });
}

export async function sendMembershipSubmissionEmail(context: MembershipEmailContext) {
  return sendMembershipEmail(
    context,
    'Application received',
    `We received your membership request for ${context.clubName}`,
    `<p>We received your request for <strong>${context.clubName}</strong>. Our team will review it and contact you with the outcome.</p>
     <p>You can also track the current status from your profile requests area.</p>`
  );
}

export async function sendMembershipStageUpdateEmail(
  context: MembershipEmailContext,
  stageLabel: string
) {
  return sendMembershipEmail(
    context,
    'Application update',
    `Your membership request for ${context.clubName} moved to ${stageLabel}`,
    `<p>Your request for <strong>${context.clubName}</strong> is now in the <strong>${stageLabel}</strong> stage.</p>
     ${notesBlock(context.notes)}
     <p>We will email you again when a final decision is made.</p>`
  );
}

export async function sendMembershipApprovalEmail(context: MembershipEmailContext) {
  return sendMembershipEmail(
    context,
    'Application approved',
    `Your membership request for ${context.clubName} was approved`,
    `<p>Your request for <strong>${context.clubName}</strong> has been approved by our team.</p>
     ${notesBlock(context.notes)}
     <p>We will now handle the manual handoff with the club and follow up with next steps separately if needed.</p>`
  );
}

export async function sendMembershipRejectionEmail(context: MembershipEmailContext) {
  return sendMembershipEmail(
    context,
    'Application update',
    `Your membership request for ${context.clubName} was not approved`,
    `<p>After review, we could not approve your request for <strong>${context.clubName}</strong> at this time.</p>
     ${notesBlock(context.notes)}
     <p>If you believe this was a mistake, reply to the original contact channel or reach out to support.</p>`
  );
}
