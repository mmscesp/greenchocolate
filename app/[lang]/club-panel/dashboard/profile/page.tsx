'use client';

export const dynamic = 'force-dynamic';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { toast } from 'sonner';
import { Upload, Image as ImageIcon, MapPin, Loader2 } from '@/lib/icons';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/hooks/useLanguage';

// Default values for empty form
const defaultValues = {
  name: '',
  description: '',
  neighborhood: '',
  addressDisplay: '',
  contactEmail: '',
  phoneNumber: '',
  capacity: 50,
  foundedYear: new Date().getFullYear(),
};

const createClubProfileSchema = (t: (key: string) => string) =>
  z.object({
    name: z.string().min(2, t('club_panel.profile.validation.name_min')),
    description: z.string().min(20, t('club_panel.profile.validation.description_min')),
    neighborhood: z.string().min(2, t('club_panel.profile.validation.neighborhood_required')),
    addressDisplay: z.string().min(5, t('club_panel.profile.validation.address_required')),
    contactEmail: z.string().email(t('club_panel.profile.validation.invalid_email')),
    phoneNumber: z.string().optional(),
    capacity: z.coerce.number().min(1, t('club_panel.profile.validation.capacity_min')),
    foundedYear: z.coerce.number()
      .min(1900, t('club_panel.profile.validation.year_min'))
      .max(new Date().getFullYear(), t('club_panel.profile.validation.year_max')),
  });

type ClubProfileFormValues = z.infer<ReturnType<typeof createClubProfileSchema>>;

export default function ClubProfilePage() {
  const { t } = useLanguage();
  const [isSaving, setIsSaving] = useState(false);
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const clubProfileSchema = useMemo(() => createClubProfileSchema(t), [t]);

  // Initialize form with default values
  const form = useForm<ClubProfileFormValues>({
    resolver: zodResolver(clubProfileSchema),
    defaultValues: defaultValues,
  });

  async function onSubmit(data: ClubProfileFormValues) {
    setIsSaving(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log('Form data:', data);
    toast.success(t('club_panel.profile.toast.updated'));
    setIsSaving(false);
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverImage(reader.result as string);
        toast.success(t('club_panel.profile.toast.cover_image_updated'));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t('club_panel.profile.title')}</h1>
        <p className="text-muted-foreground">{t('club_panel.profile.subtitle')}</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          
          {/* Media Section */}
          <Card>
            <CardHeader>
              <CardTitle>{t('club_panel.profile.media.title')}</CardTitle>
              <CardDescription>{t('club_panel.profile.media.description')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <FormLabel>{t('club_panel.profile.media.cover_image')}</FormLabel>
                <div className="relative aspect-video w-full overflow-hidden rounded-lg border-2 border-dashed border-muted-foreground/25 bg-muted/50 hover:bg-muted/80 transition-colors group cursor-pointer">
                  {coverImage ? (
                    <>
                      <Image
                        src={coverImage}
                        alt={t('club_panel.profile.media.cover_alt')}
                        fill
                        sizes="100vw"
                        className="object-cover transition-opacity group-hover:opacity-75"
                      />
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="bg-background/80 backdrop-blur-sm p-3 rounded-full shadow-lg">
                          <Upload className="h-6 w-6 text-foreground" />
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                      <ImageIcon className="h-10 w-10 mb-2" />
                      <span>{t('club_panel.profile.media.upload_cover')}</span>
                    </div>
                  )}
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleImageUpload} 
                    className="absolute inset-0 opacity-0 cursor-pointer" 
                  />
                </div>
                <FormDescription>{t('club_panel.profile.media.recommended_size')}</FormDescription>
              </div>
            </CardContent>
          </Card>

          {/* General Information */}
          <Card>
            <CardHeader>
              <CardTitle>{t('club_panel.profile.general.title')}</CardTitle>
              <CardDescription>{t('club_panel.profile.general.description')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('club_panel.profile.general.club_name')}</FormLabel>
                      <FormControl>
                        <Input placeholder={t('club_panel.profile.general.club_name_placeholder')} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="foundedYear"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('club_panel.profile.general.founded_year')}</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('club_panel.profile.general.description_label')}</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder={t('club_panel.profile.general.description_placeholder')}
                        className="min-h-[150px] resize-y" 
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      {t('club_panel.profile.general.description_help')}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="capacity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('club_panel.profile.general.member_capacity')}</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Location & Contact */}
          <Card>
            <CardHeader>
              <CardTitle>{t('club_panel.profile.location.title')}</CardTitle>
              <CardDescription>{t('club_panel.profile.location.description')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="addressDisplay"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('club_panel.profile.location.address')}</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input className="pl-9" placeholder={t('club_panel.profile.location.address_placeholder')} {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="neighborhood"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('club_panel.profile.location.neighborhood')}</FormLabel>
                      <FormControl>
                        <Input placeholder={t('club_panel.profile.location.neighborhood_placeholder')} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="contactEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('club_panel.profile.location.contact_email')}</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder={t('club_panel.profile.location.contact_email_placeholder')} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('club_panel.profile.location.phone_number')}</FormLabel>
                    <FormControl>
                      <Input placeholder={t('club_panel.profile.location.phone_placeholder')} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <div className="flex items-center justify-end gap-4 sticky bottom-6 bg-background/80 backdrop-blur-md p-4 rounded-xl border shadow-lg z-10">
            <Button type="button" variant="ghost" onClick={() => form.reset()}>
              {t('club_panel.profile.discard_changes')}
            </Button>
            <Button type="submit" disabled={isSaving} className="min-w-[150px]">
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t('club_panel.profile.saving')}
                </>
              ) : (
                t('common.save_changes')
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
