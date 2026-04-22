import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { AdminActionNotice } from '@/components/admin/AdminActionNotice';
import type {
  AdminClubAssignmentCandidate,
  AdminClubEditorOption,
  AdminClubFormValues,
} from '@/app/actions/admin-clubs';
import {
  Building2,
  CheckCircle2,
  ClipboardList,
  ExternalLink,
  Map,
  Mail,
  Save,
  Sparkles,
  Users,
} from '@/lib/icons';

type ClubMutationAction = (formData: FormData) => Promise<void>;

type ClubEditorMetrics = {
  admins?: number;
  requests?: number;
  events?: number;
  reviews?: number;
};

type ClubEditorMeta = {
  id?: string;
  slug?: string;
  citySlug?: string;
  updatedAt?: string;
  metrics?: ClubEditorMetrics;
};

interface AdminClubEditorFormProps {
  action: ClubMutationAction;
  adminCandidates: AdminClubAssignmentCandidate[];
  cities: AdminClubEditorOption[];
  lang: string;
  message?: string;
  mode: 'create' | 'edit';
  status?: string;
  values: AdminClubFormValues;
  meta?: ClubEditorMeta;
}

const dayFields = [
  { key: 'monday', label: 'Monday' },
  { key: 'tuesday', label: 'Tuesday' },
  { key: 'wednesday', label: 'Wednesday' },
  { key: 'thursday', label: 'Thursday' },
  { key: 'friday', label: 'Friday' },
  { key: 'saturday', label: 'Saturday' },
  { key: 'sunday', label: 'Sunday' },
] as const;

function formatTimestamp(value?: string): string {
  if (!value) {
    return 'Not available yet';
  }

  try {
    return new Intl.DateTimeFormat('en-GB', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(new Date(value));
  } catch {
    return value;
  }
}

function buildPublicPath(lang: string, slug?: string): string | null {
  if (!slug) {
    return null;
  }

  return `/${lang}/clubs/${slug}`;
}

function buildCityClubPath(lang: string, citySlug?: string, slug?: string): string | null {
  if (!citySlug || !slug) {
    return null;
  }

  return `/${lang}/spain/${citySlug}/clubs/${slug}`;
}

function buildAdminCandidateLabel(candidate: AdminClubAssignmentCandidate): string {
  const roleLabel = candidate.role === 'ADMIN' ? 'Platform admin' : 'Club admin';
  if (candidate.displayName) {
    return `${candidate.displayName} · ${roleLabel}`;
  }

  return `${candidate.email} · ${roleLabel}`;
}

export function AdminClubEditorForm({
  action,
  adminCandidates,
  cities,
  lang,
  message,
  mode,
  status,
  values,
  meta,
}: AdminClubEditorFormProps) {
  const title = mode === 'create' ? 'Create club profile' : 'Edit club profile';
  const subtitle =
    mode === 'create'
      ? 'Add a new club using the same operational model the public product expects.'
      : 'Maintain the live club record, publication state, ownership, and operational metadata from one place.';
  const returnPath =
    mode === 'edit' && meta?.id ? `/${lang}/admin/clubs/${meta.id}/edit` : `/${lang}/admin/clubs`;
  const publicPath = buildPublicPath(lang, meta?.slug ?? values.slug);
  const cityClubPath = buildCityClubPath(lang, meta?.citySlug, meta?.slug ?? values.slug);
  const selectedAdminIds = new Set(values.assignedAdminIds);

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-[2rem] border border-border/70 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 p-6 text-slate-50 shadow-[0_24px_80px_-28px_rgba(15,23,42,0.75)] sm:p-8">
        <div className="absolute inset-y-0 right-0 hidden w-1/2 bg-[radial-gradient(circle_at_top_right,rgba(34,197,94,0.18),transparent_52%)] lg:block" />
        <div className="relative flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-200">
              <Sparkles className="h-4 w-4" />
              Admin Clubs CMS
            </div>
            <div className="space-y-3">
              <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h1>
              <p className="max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">{subtitle}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge className="border-emerald-400/30 bg-emerald-500/15 text-emerald-100 hover:bg-emerald-500/15">
                {values.isActive ? 'Publicly active' : 'Hidden from public discovery'}
              </Badge>
              <Badge className="border-sky-400/30 bg-sky-500/15 text-sky-100 hover:bg-sky-500/15">
                {values.isVerified ? 'Verified directory listing' : 'Needs verification before trust badge'}
              </Badge>
              <Badge className="border-white/15 bg-white/10 text-white hover:bg-white/10">
                {values.allowsPreRegistration ? 'Applications open' : 'Applications paused'}
              </Badge>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:min-w-[360px]">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="text-xs uppercase tracking-[0.16em] text-slate-400">Last updated</div>
              <div className="mt-2 text-sm font-medium text-white">{formatTimestamp(meta?.updatedAt)}</div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="text-xs uppercase tracking-[0.16em] text-slate-400">Assigned operators</div>
              <div className="mt-2 text-sm font-medium text-white">
                {meta?.metrics?.admins ?? values.assignedAdminIds.length}
              </div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="text-xs uppercase tracking-[0.16em] text-slate-400">Membership requests</div>
              <div className="mt-2 text-sm font-medium text-white">{meta?.metrics?.requests ?? 0}</div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="text-xs uppercase tracking-[0.16em] text-slate-400">Events / reviews</div>
              <div className="mt-2 text-sm font-medium text-white">
                {(meta?.metrics?.events ?? 0)} / {(meta?.metrics?.reviews ?? 0)}
              </div>
            </div>
          </div>
        </div>
      </div>

      <AdminActionNotice status={status} message={message} />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <form action={action} className="space-y-6">
          <input type="hidden" name="returnPath" value={returnPath} />
          {mode === 'edit' && values.clubId ? <input type="hidden" name="clubId" value={values.clubId} /> : null}

          <Card className="border-border/80 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-brand" />
                Identity and discovery
              </CardTitle>
              <CardDescription>
                These fields control how the club is identified across admin, editorial pages, and the public directory.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-5 md:grid-cols-2">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="name">Club name</Label>
                <Input id="name" name="name" defaultValue={values.name} placeholder="Club 311 Barcelona" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">Slug</Label>
                <Input id="slug" name="slug" defaultValue={values.slug} placeholder="club-311-barcelona" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cityId">City</Label>
                <select
                  id="cityId"
                  name="cityId"
                  defaultValue={values.cityId}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  required
                >
                  <option value="" disabled>
                    Select a city
                  </option>
                  {cities.map((city) => (
                    <option key={city.id} value={city.id}>
                      {city.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="neighborhood">Neighborhood</Label>
                <Input id="neighborhood" name="neighborhood" defaultValue={values.neighborhood} placeholder="Sant Antoni" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="addressDisplay">Address display</Label>
                <Input id="addressDisplay" name="addressDisplay" defaultValue={values.addressDisplay} placeholder="Carrer example, Barcelona" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="latitude">Latitude</Label>
                <Input id="latitude" name="latitude" type="number" step="0.000001" defaultValue={values.latitude} placeholder="41.3851" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="longitude">Longitude</Label>
                <Input id="longitude" name="longitude" type="number" step="0.000001" defaultValue={values.longitude} placeholder="2.1734" required />
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/80 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-brand" />
                Contact and social channels
              </CardTitle>
              <CardDescription>
                Keep operator contact details, website links, and public social handles aligned with the club listing.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-5 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="contactEmail">Contact email</Label>
                <Input id="contactEmail" name="contactEmail" type="email" defaultValue={values.contactEmail} placeholder="contact@club.com" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone number</Label>
                <Input id="phoneNumber" name="phoneNumber" defaultValue={values.phoneNumber} placeholder="+34 600 000 000" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input id="website" name="website" defaultValue={values.website} placeholder="https://club311.example" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="instagram">Instagram</Label>
                <Input id="instagram" name="instagram" defaultValue={values.instagram} placeholder="@club311barcelona" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="whatsapp">WhatsApp</Label>
                <Input id="whatsapp" name="whatsapp" defaultValue={values.whatsapp} placeholder="+34600111222" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="facebook">Facebook</Label>
                <Input id="facebook" name="facebook" defaultValue={values.facebook} placeholder="https://facebook.com/club311" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="x">X / Twitter</Label>
                <Input id="x" name="x" defaultValue={values.x} placeholder="https://x.com/club311" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/80 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-brand" />
                Editorial, tags, and SEO
              </CardTitle>
              <CardDescription>
                This is the narrative layer used by the directory, city landing pages, and metadata generation.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="description">Long description</Label>
                <Textarea
                  id="description"
                  name="description"
                  defaultValue={values.description}
                  className="min-h-[180px]"
                  placeholder="Describe the club atmosphere, access model, amenities, and what makes it distinctive."
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="shortDescription">Short description</Label>
                <Textarea
                  id="shortDescription"
                  name="shortDescription"
                  defaultValue={values.shortDescription}
                  className="min-h-[90px]"
                  placeholder="One concise summary used in listings and previews."
                />
              </div>
              <div className="grid gap-5 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="amenitiesInput">Amenities</Label>
                  <Textarea
                    id="amenitiesInput"
                    name="amenitiesInput"
                    defaultValue={values.amenitiesInput}
                    className="min-h-[130px]"
                    placeholder={'Wifi\nCoffee\nLounge'}
                  />
                  <p className="text-xs text-muted-foreground">One item per line or comma-separated.</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="vibeTagsInput">Vibe tags</Label>
                  <Textarea
                    id="vibeTagsInput"
                    name="vibeTagsInput"
                    defaultValue={values.vibeTagsInput}
                    className="min-h-[130px]"
                    placeholder={'Relaxed\nCommunity\nMusic'}
                  />
                  <p className="text-xs text-muted-foreground">One item per line or comma-separated.</p>
                </div>
              </div>
              <div className="grid gap-5 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="metaTitle">SEO title</Label>
                  <Input id="metaTitle" name="metaTitle" defaultValue={values.metaTitle} placeholder="Club 311 Barcelona | SocialClubsMaps" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="metaDescription">SEO description</Label>
                  <Textarea
                    id="metaDescription"
                    name="metaDescription"
                    defaultValue={values.metaDescription}
                    className="min-h-[90px]"
                    placeholder="Concise metadata summary for search previews."
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/80 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Map className="h-5 w-5 text-brand" />
                Media and operations
              </CardTitle>
              <CardDescription>
                Control publication status, directory trust state, pricing signal, media coverage, and operational availability.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="priceRange">Price range</Label>
                  <select
                    id="priceRange"
                    name="priceRange"
                    defaultValue={values.priceRange}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  >
                    <option value="$">$</option>
                    <option value="$$">$$</option>
                    <option value="$$$">$$$</option>
                    <option value="$$$$">$$$$</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="capacity">Capacity</Label>
                  <Input id="capacity" name="capacity" type="number" min="1" defaultValue={values.capacity} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="foundedYear">Founded year</Label>
                  <Input id="foundedYear" name="foundedYear" type="number" min="1900" defaultValue={values.foundedYear} required />
                </div>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="logoUrl">Logo URL or static path</Label>
                  <Input id="logoUrl" name="logoUrl" defaultValue={values.logoUrl} placeholder="/images/clubs/club-311/logo.webp" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="coverImageUrl">Cover image URL or static path</Label>
                  <Input id="coverImageUrl" name="coverImageUrl" defaultValue={values.coverImageUrl} placeholder="/images/clubs/club-311/hero.webp" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="imagesInput">Gallery images</Label>
                <Textarea
                  id="imagesInput"
                  name="imagesInput"
                  defaultValue={values.imagesInput}
                  className="min-h-[130px]"
                  placeholder={'/images/clubs/club-311/gallery-1.webp\nhttps://cdn.example.com/club-311/gallery-2.webp'}
                />
                <p className="text-xs text-muted-foreground">Use one URL or path per line. Club-specific media can still layer on top through `lib/club-media.ts`.</p>
              </div>

              <Separator />

              <div className="grid gap-5 md:grid-cols-3">
                <div className="rounded-2xl border border-border/70 bg-muted/30 p-4">
                  <input type="hidden" name="isActive" value="false" />
                  <Label className="flex cursor-pointer items-start gap-3">
                    <input
                      type="checkbox"
                      name="isActive"
                      value="true"
                      defaultChecked={values.isActive}
                      className="mt-1 h-4 w-4 rounded border-input text-brand focus:ring-brand"
                    />
                    <span className="space-y-1">
                      <span className="block text-sm font-medium">Publicly active</span>
                      <span className="block text-xs text-muted-foreground">
                        Controls whether the club appears in live public discovery surfaces.
                      </span>
                    </span>
                  </Label>
                </div>
                <div className="rounded-2xl border border-border/70 bg-muted/30 p-4">
                  <input type="hidden" name="isVerified" value="false" />
                  <Label className="flex cursor-pointer items-start gap-3">
                    <input
                      type="checkbox"
                      name="isVerified"
                      value="true"
                      defaultChecked={values.isVerified}
                      className="mt-1 h-4 w-4 rounded border-input text-brand focus:ring-brand"
                    />
                    <span className="space-y-1">
                      <span className="block text-sm font-medium">Verified listing</span>
                      <span className="block text-xs text-muted-foreground">
                        Required for trust badges and standard public listing visibility.
                      </span>
                    </span>
                  </Label>
                </div>
                <div className="rounded-2xl border border-border/70 bg-muted/30 p-4">
                  <input type="hidden" name="allowsPreRegistration" value="false" />
                  <Label className="flex cursor-pointer items-start gap-3">
                    <input
                      type="checkbox"
                      name="allowsPreRegistration"
                      value="true"
                      defaultChecked={values.allowsPreRegistration}
                      className="mt-1 h-4 w-4 rounded border-input text-brand focus:ring-brand"
                    />
                    <span className="space-y-1">
                      <span className="block text-sm font-medium">Accept applications</span>
                      <span className="block text-xs text-muted-foreground">
                        Allows the public application CTA to stay open for this club.
                      </span>
                    </span>
                  </Label>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/80 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-brand" />
                Ownership and opening hours
              </CardTitle>
              <CardDescription>
                Assign operating owners and keep weekly hours aligned with what members see in the profile.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label>Assigned admins</Label>
                <div className="grid gap-3 lg:grid-cols-2">
                  {adminCandidates.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-border p-4 text-sm text-muted-foreground">
                      No admin or club-admin profiles are currently available for assignment.
                    </div>
                  ) : (
                    adminCandidates.map((candidate) => {
                      const isAssignedToAnotherClub =
                        Boolean(candidate.managedClubId) && !selectedAdminIds.has(candidate.id);

                      return (
                        <label
                          key={candidate.id}
                          className="flex items-start gap-3 rounded-2xl border border-border/70 bg-background p-4 transition-colors hover:border-brand/40 hover:bg-muted/30"
                        >
                          <input
                            type="checkbox"
                            name="assignedAdminIds"
                            value={candidate.id}
                            defaultChecked={selectedAdminIds.has(candidate.id)}
                            disabled={isAssignedToAnotherClub}
                            className="mt-1 h-4 w-4 rounded border-input text-brand focus:ring-brand disabled:cursor-not-allowed"
                          />
                          <span className="min-w-0 space-y-1">
                            <span className="block text-sm font-medium text-foreground">
                              {buildAdminCandidateLabel(candidate)}
                            </span>
                            <span className="block truncate text-xs text-muted-foreground">{candidate.email}</span>
                            {candidate.managedClubName ? (
                              <span className="inline-flex rounded-full bg-muted px-2 py-0.5 text-[11px] text-muted-foreground">
                                {selectedAdminIds.has(candidate.id)
                                  ? `Currently assigned here`
                                  : `Already assigned to ${candidate.managedClubName}`}
                              </span>
                            ) : (
                              <span className="inline-flex rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] text-emerald-700 dark:text-emerald-300">
                                Available for assignment
                              </span>
                            )}
                          </span>
                        </label>
                      );
                    })
                  )}
                </div>
              </div>

              <Separator />

              <div className="grid gap-4 md:grid-cols-2">
                {dayFields.map((day) => (
                  <div key={day.key} className="space-y-2">
                    <Label htmlFor={`${day.key}Hours`}>{day.label}</Label>
                    <Input
                      id={`${day.key}Hours`}
                      name={`${day.key}Hours`}
                      defaultValue={values.openingHours[day.key]}
                      placeholder="15:00 - 22:00 or Closed"
                      required
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-col gap-3 rounded-[1.5rem] border border-border/80 bg-card p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="text-sm font-medium text-foreground">Ship a stable club record</div>
              <p className="text-sm text-muted-foreground">
                This save updates the admin CMS, public directory state, assigned operators, and relevant revalidation paths.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button asChild variant="secondary">
                <Link href={`/${lang}/admin/clubs`}>Back to clubs</Link>
              </Button>
              <Button type="submit" leftIcon={<Save className="h-4 w-4" />}>
                {mode === 'create' ? 'Create club' : 'Save club changes'}
              </Button>
            </div>
          </div>
        </form>

        <div className="space-y-6">
          <Card className="border-border/80 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-brand" />
                Publication contract
              </CardTitle>
              <CardDescription>
                The club will only appear in the public directory when both operational gates are true.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="rounded-2xl border border-border/70 bg-muted/30 p-4">
                <div className="font-medium text-foreground">Required for public listing</div>
                <div className="mt-2 text-muted-foreground">
                  `isActive = true` and `isVerified = true`
                </div>
              </div>
              <div className="space-y-2 text-muted-foreground">
                <p>
                  This keeps admin-created clubs aligned with the live public query contract instead of relying on hardcoded slug allowlists.
                </p>
                <p>
                  If a club is active but not verified, it stays operationally saved in admin while remaining hidden from the public directory.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/80 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Map className="h-5 w-5 text-brand" />
                Route and visibility
              </CardTitle>
              <CardDescription>
                Quick links for the admin operator to inspect the exact pages this record controls.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {publicPath ? (
                <Button asChild variant="secondary" fullWidth>
                  <Link href={publicPath}>
                    Open public profile
                    <ExternalLink className="h-4 w-4" />
                  </Link>
                </Button>
              ) : null}
              {cityClubPath ? (
                <Button asChild variant="secondary" fullWidth>
                  <Link href={cityClubPath}>
                    Open city landing path
                    <ExternalLink className="h-4 w-4" />
                  </Link>
                </Button>
              ) : null}
              {mode === 'edit' && meta?.id ? (
                <Button asChild variant="secondary" fullWidth>
                  <Link href={`/${lang}/admin/clubs/${meta.id}`}>
                    Open detail view
                    <ExternalLink className="h-4 w-4" />
                  </Link>
                </Button>
              ) : null}
              <Button asChild variant="secondary" fullWidth>
                <Link href={`/${lang}/admin/clubs/verification`}>
                  Review verification queue
                  <ExternalLink className="h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="border-border/80 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ClipboardList className="h-5 w-5 text-brand" />
                Operator checklist
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>1. Lock the slug and city before publishing to avoid broken route churn.</p>
              <p>2. Keep at least one assigned operator if the club will receive applications.</p>
              <p>3. Add real gallery paths so non-311 clubs don’t fall back to generic imagery.</p>
              <p>4. Verify narrative fields and SEO metadata before toggling public visibility.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
