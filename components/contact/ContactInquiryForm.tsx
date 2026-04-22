'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { AlertCircle, CheckCircle2, Mail, ShieldCheck } from '@/lib/icons';
import {
  submitContactInquiryAction,
} from '@/app/actions/contact-inquiries';
import {
  initialContactInquiryState,
  type ContactInquiryFormState,
} from '@/lib/contact-inquiries';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

type ContactInquiryFormProps = {
  lang: string;
  supportEmail: string;
  categoryOptions: Array<{
    value: string;
    label: string;
    description: string;
  }>;
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" size="lg" className="w-full sm:w-auto" disabled={pending}>
      {pending ? 'Sending to operations...' : 'Send to the operations inbox'}
    </Button>
  );
}

function StatusBanner({ state }: { state: ContactInquiryFormState }) {
  if (state.status === 'idle' || !state.message) {
    return null;
  }

  const isSuccess = state.status === 'success';
  const Icon = isSuccess ? CheckCircle2 : AlertCircle;

  return (
    <div
      className={cn(
        'rounded-2xl border px-4 py-3 text-sm',
        isSuccess
          ? 'border-emerald-200 bg-emerald-50 text-emerald-900'
          : 'border-red-200 bg-red-50 text-red-900'
      )}
    >
      <div className="flex items-start gap-3">
        <Icon className="mt-0.5 h-4 w-4 shrink-0" />
        <div>
          <p className="font-medium">{isSuccess ? 'Inquiry captured' : 'Submission issue'}</p>
          <p className="mt-1 text-sm">{state.message}</p>
          {isSuccess && state.inquiryId ? (
            <p className="mt-2 text-xs uppercase tracking-wide text-emerald-700">
              Reference {state.inquiryId}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export function ContactInquiryForm({
  lang,
  supportEmail,
  categoryOptions,
}: ContactInquiryFormProps) {
  const [state, formAction] = useActionState(submitContactInquiryAction, initialContactInquiryState);

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
      <div className="rounded-[2rem] border border-border/70 bg-card/95 p-6 shadow-[0_18px_60px_rgba(0,0,0,0.08)] sm:p-8">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">Operations contact</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Route support, listing fixes, and partnership requests into the admin desk
          </h2>
          <p className="mt-3 text-sm leading-6 text-muted-foreground sm:text-base">
            This form writes directly into the SCM operations inbox. Use it for support, listing corrections,
            Safety Kit questions, editorial issues, or founder-level business requests.
          </p>
        </div>

        <div className="mt-6">
          <StatusBanner state={state} />
        </div>

        <form action={formAction} className="mt-6 space-y-6">
          <input type="hidden" name="locale" value={lang} />
          <input type="hidden" name="source" value="contact_page" />

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="contact-name">Name</Label>
              <Input id="contact-name" name="name" placeholder="Your name" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact-email">Email</Label>
              <Input id="contact-email" name="email" type="email" autoComplete="email" placeholder="you@example.com" required />
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-[240px_minmax(0,1fr)]">
            <div className="space-y-2">
              <Label htmlFor="contact-category">Topic</Label>
              <select
                id="contact-category"
                name="category"
                defaultValue={categoryOptions[0]?.value}
                className="h-11 w-full rounded-xl border border-input bg-background px-3 text-sm shadow-sm"
              >
                {categoryOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact-subject">Subject</Label>
              <Input id="contact-subject" name="subject" placeholder="What do you need help with?" required />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="contact-message">Message</Label>
            <Textarea
              id="contact-message"
              name="message"
              rows={7}
              placeholder="Share the details, what changed, or what outcome you need."
              required
            />
          </div>

          <label className="flex items-start gap-3 rounded-2xl border border-border/70 bg-muted/30 px-4 py-4 text-sm text-muted-foreground">
            <input
              type="checkbox"
              name="subscribeToUpdates"
              value="true"
              className="mt-1 h-4 w-4 rounded border-input"
            />
            <span>
              Also subscribe me to high-signal SCM updates and Safety Kit follow-ups. This keeps the inquiry separate
              from the marketing preference, and you can unsubscribe at any time.
            </span>
          </label>

          <div className="flex flex-col gap-3 border-t border-border/70 pt-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Response path: admin inbox + confirmation email
            </div>
            <SubmitButton />
          </div>
        </form>
      </div>

      <div className="space-y-4">
        <div className="rounded-[1.75rem] border border-border/70 bg-card/95 p-6">
          <div className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
            <ShieldCheck className="h-4 w-4" />
            What this reaches
          </div>
          <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
            {categoryOptions.slice(0, 4).map((option) => (
              <li key={option.value} className="rounded-xl border border-border/60 bg-background/70 px-3 py-3">
                <div className="font-medium text-foreground">{option.label}</div>
                <div className="mt-1 leading-6">{option.description}</div>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-[1.75rem] border border-border/70 bg-card/95 p-6">
          <div className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
            <Mail className="h-4 w-4" />
            Email fallback
          </div>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            If you prefer, you can still email the team directly. The structured form above is better because it lands
            in the tracked operations queue with a reference ID.
          </p>
          <a
            href={`mailto:${supportEmail}`}
            className="mt-4 inline-flex rounded-full border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
          >
            Email {supportEmail}
          </a>
        </div>
      </div>
    </div>
  );
}
