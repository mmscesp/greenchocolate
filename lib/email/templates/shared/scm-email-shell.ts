type CtaLink = {
  label: string;
  href: string;
};

type ShellInput = {
  eyebrow: string;
  heading: string;
  intro: string;
  primaryCta?: CtaLink;
  secondaryCta?: CtaLink;
  supportLinks?: CtaLink[];
  bodyLines?: string[];
  footer: string;
  legalNote?: string;
};

function escapeHtml(input: string) {
  return input
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function lineToParagraph(line: string) {
  return `<p style="margin:0 0 12px;color:#d4d4d8;font-size:15px;line-height:1.7;">${escapeHtml(line)}</p>`;
}

function ctaButton(link: CtaLink, variant: 'primary' | 'secondary') {
  const style =
    variant === 'primary'
      ? 'background:#22d3ee;color:#0f172a;border:1px solid #67e8f9;'
      : 'background:#111827;color:#f9fafb;border:1px solid #374151;';
  return [
    '<table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin:0 0 12px;">',
    '<tr>',
    `<td style="border-radius:12px;${style}">`,
    `<a href="${escapeHtml(link.href)}" style="display:inline-block;padding:13px 20px;font-size:14px;font-weight:700;letter-spacing:0.01em;text-decoration:none;color:inherit;">${escapeHtml(link.label)}</a>`,
    '</td>',
    '</tr>',
    '</table>',
  ].join('');
}

function supportList(links: CtaLink[]) {
  if (links.length === 0) return '';
  const items = links
    .map(
      (link) =>
        `<li style="margin:0 0 10px;"><a href="${escapeHtml(link.href)}" style="color:#67e8f9;text-decoration:none;">${escapeHtml(link.label)}</a></li>`
    )
    .join('');

  return `<ul style="padding-left:18px;margin:16px 0 0;color:#d4d4d8;font-size:14px;line-height:1.6;">${items}</ul>`;
}

export function renderScmEmailShell(input: ShellInput) {
  const bodyLines = input.bodyLines ?? [];
  const legalNote =
    input.legalNote ??
    'SCM provides information, not legal advice. The legal landscape for cannabis social clubs in Spain is complex and evolving. Always verify club status independently and consult local legal resources if in doubt.';

  const html = [
    '<div style="margin:0;padding:0;background:#05070f;">',
    '<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#05070f;padding:24px 12px;">',
    '<tr>',
    '<td align="center">',
    '<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:620px;background:#0b1120;border:1px solid #1f2937;border-radius:18px;overflow:hidden;">',
    '<tr><td style="height:4px;background:linear-gradient(90deg,#22d3ee,#f59e0b);"></td></tr>',
    '<tr><td style="padding:28px 28px 12px;">',
    `<p style="margin:0 0 14px;font-size:11px;text-transform:uppercase;letter-spacing:0.16em;color:#67e8f9;font-weight:700;">${escapeHtml(input.eyebrow)}</p>`,
    `<h1 style="margin:0 0 14px;color:#f9fafb;font-size:30px;line-height:1.2;font-family:Inter,Segoe UI,Arial,sans-serif;">${escapeHtml(input.heading)}</h1>`,
    `<p style="margin:0 0 18px;color:#e5e7eb;font-size:16px;line-height:1.7;">${escapeHtml(input.intro)}</p>`,
    ...bodyLines.map(lineToParagraph),
    input.primaryCta ? ctaButton(input.primaryCta, 'primary') : '',
    input.secondaryCta ? ctaButton(input.secondaryCta, 'secondary') : '',
    supportList(input.supportLinks ?? []),
    '</td></tr>',
    '<tr><td style="padding:0 28px 26px;">',
    `<p style="margin:18px 0 8px;color:#a1a1aa;font-size:13px;line-height:1.6;">${escapeHtml(input.footer)}</p>`,
    `<p style="margin:0;color:#6b7280;font-size:12px;line-height:1.55;">${escapeHtml(legalNote)}</p>`,
    '</td></tr>',
    '</table>',
    '</td>',
    '</tr>',
    '</table>',
    '</div>',
  ].join('');

  return html;
}
