'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { UserProfile, UserProfileBackendStatus } from '@/app/actions/users';
import { useLanguage } from '@/hooks/useLanguage';
import { updateUserProfile } from '@/app/actions/users';
import MemberPassport from '@/components/profile/MemberPassport';
import ApplicationStatusTracker from '@/components/profile/ApplicationStatusTracker';
import TrustBadge from '@/components/trust/TrustBadge';
import { Edit3, 
Save, 
X, 
User, 
Mail, 
Calendar,
Shield,
Camera,
Check,
Star,
MapPin,
Loader2,
Wallet,
FileCheck,
Clock,
ArrowRight,
Heart,
TrendingUp,
CreditCard } from '@/lib/icons';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

interface UserProfilePageContentProps {
  userProfile: UserProfile | null;
  backendStatus: UserProfileBackendStatus | null;
}

const mockStats = {
  clubsViewed: 12,
  favoritesCount: 3,
  reviewsWritten: 2,
  memberSince: '2026'
};

const profileFormSchema = z.object({
  displayName: z.string().min(2, {
    message: 'Username must be at least 2 characters.',
  }),
  bio: z.string().max(160).optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export default function UserProfilePageContent({ userProfile, backendStatus }: UserProfilePageContentProps) {
  const { t } = useLanguage();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'passport' | 'status'>('overview');

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      displayName: userProfile?.displayName || '',
      bio: userProfile?.bio || '',
    },
  });

  const displayName = userProfile?.displayName || userProfile?.email?.split('@')[0] || t('profile.member_fallback');
  const verificationId = backendStatus?.passport.verificationId || `SMC-2026-${userProfile?.id?.slice(0, 8).toUpperCase() || 'UNKNOWN'}`;

  if (!userProfile) {
    return (
      <div className="max-w-4xl mx-auto animate-in fade-in duration-500">
        <Card className="border-destructive/30 bg-destructive/5">
          <CardContent className="flex flex-col items-center justify-center p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
              <User className="h-8 w-8 text-destructive" />
            </div>
            <h2 className="text-xl font-semibold text-destructive mb-2">{t('profile.not_found')}</h2>
            <p className="text-destructive/70">{t('profile.login_required')}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  async function onSubmit(data: ProfileFormValues) {
    setIsSaving(true);
    const formData = new FormData();
    formData.set('displayName', data.displayName);
    if (data.bio) formData.set('bio', data.bio);
    
    try {
      const result = await updateUserProfile(formData);
      if (result.success) {
        setIsEditing(false);
        toast.success(t('profile.update_success'));
      } else {
        toast.error(result.message || t('profile.update_error'));
      }
    } catch (error) {
      toast.error(t('profile.error_generic'));
    } finally {
      setIsSaving(false);
    }
  }

  const handleCancel = () => {
    form.reset({
      displayName: userProfile.displayName || '',
      bio: userProfile.bio || '',
    });
    setIsEditing(false);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 text-white">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t('user.my_profile')}</h1>
          <p className="text-muted-foreground mt-1">
            {t('profile.subtitle')}
          </p>
        </div>
        
        {!isEditing ? (
          <Button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 self-start"
          >
            <Edit3 className="h-4 w-4" />
            {t('profile.edit')}
          </Button>
        ) : (
          <div className="flex gap-2 self-start">
            <Button
              variant="outline"
              onClick={handleCancel}
              className="flex items-center gap-2"
              disabled={isSaving}
            >
              <X className="h-4 w-4" />
              {t('common.cancel')}
            </Button>
            <Button
              onClick={form.handleSubmit(onSubmit)}
              disabled={isSaving}
              className="flex items-center gap-2"
            >
              {isSaving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              {t('common.save_changes')}
            </Button>
          </div>
        )}
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Profile Card */}
          <Card className="overflow-hidden border shadow-lg shadow-primary/5">
            {/* Cover Image */}
            <div className="h-40 bg-gradient-to-r from-primary/90 via-primary to-primary/70 relative">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20"></div>
              {isEditing && (
                <Button
                  size="icon"
                  variant="secondary"
                className="absolute top-4 right-4 rounded-full bg-card/30 backdrop-blur-md hover:bg-card/45 text-white border-0 shadow-lg"
                  type="button"
                >
                  <Camera className="h-4 w-4" />
                </Button>
              )}
            </div>

            {/* Profile Info */}
            <div className="relative px-6 sm:px-8 pb-8">
              {/* Avatar */}
              <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6 -mt-16 mb-6 text-center sm:text-left">
                <div className="relative group">
                  <div className="rounded-full p-1.5 bg-background shadow-2xl">
                    <Avatar className="w-28 h-28 sm:w-32 sm:h-32 border-4 border-background">
                      <AvatarImage src={userProfile.avatarUrl || ''} alt={userProfile.displayName || t('profile.user_fallback')} />
                      <AvatarFallback className="text-3xl sm:text-4xl bg-primary/10 text-primary font-bold">
                        {(userProfile.displayName || t('profile.user_initial_fallback')).charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  {isEditing && (
                    <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-all cursor-pointer backdrop-blur-sm">
                      <Camera className="h-8 w-8 text-white" />
                    </div>
                  )}
                </div>

                <div className="flex-1 pb-2 space-y-2">
                  <div className="flex flex-col sm:flex-row items-center gap-3">
                    {isEditing ? (
                      <FormField
                        control={form.control}
                        name="displayName"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input {...field} className="text-xl font-bold h-auto py-1.5 px-3 w-full sm:w-64" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    ) : (
                      <h2 className="text-2xl font-bold text-foreground">
                        {userProfile.displayName || t('profile.user_fallback')}
                      </h2>
                    )}

                    {userProfile.isVerified && (
                      <Badge variant="secondary" className="bg-blue-500/10 text-blue-600 hover:bg-blue-500/15 border-blue-500/20 gap-1.5 px-2.5 py-0.5">
                        <Shield className="h-3.5 w-3.5 fill-blue-600" />
                        {t('profile.verified')}
                      </Badge>
                    )}
                  </div>

                  <div className="text-muted-foreground max-w-2xl">
                    {isEditing ? (
                      <FormField
                        control={form.control}
                        name="bio"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Textarea
                                {...field}
                                placeholder={t('profile.bio_placeholder')}
                                className="resize-none min-h-[80px] bg-muted/50"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    ) : (
                      <p className="text-base leading-relaxed">{userProfile.bio || t('profile.no_bio')}</p>
                    )}
                  </div>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground pt-2 justify-center sm:justify-start">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-4 w-4 text-primary/70" />
                      <span>{t('user.member_since')} {new Date(userProfile.createdAt).getFullYear()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Personal Information */}
            <Card className="shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg flex items-center gap-2">
                  <User className="h-5 w-5 text-primary/70" />
                  {t('profile.personal_info')}
                </CardTitle>
                <CardDescription>{t('profile.personal_info_desc')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-2 block">
                    {t('form.email')}
                  </label>
                  <div className="flex items-center gap-3 p-3 rounded-lg border bg-muted/30 text-foreground">
                    <div className="h-8 w-8 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
                      <Mail className="h-4 w-4 text-primary" />
                    </div>
                    <span className="font-medium truncate">{userProfile.email}</span>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-2 block">
                    {t('profile.role')}
                  </label>
                  <div className="flex items-center gap-3 p-3 rounded-lg border bg-muted/30 text-foreground">
                    <div className="h-8 w-8 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
                      <Shield className="h-4 w-4 text-primary" />
                    </div>
                    <span className="font-medium capitalize">{userProfile.role.toLowerCase().replace('_', ' ')}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Account Status */}
            <Card className="shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileCheck className="h-5 w-5 text-primary/70" />
                  {t('profile.account_status')}
                </CardTitle>
                <CardDescription>{t('profile.account_status_desc')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between p-4 rounded-xl border bg-card hover:bg-accent/30 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-green-500/10 flex items-center justify-center">
                      <Check className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <div className="font-medium">{t('profile.account_verified')}</div>
                      <div className="text-xs text-muted-foreground">{t('profile.account_verified_desc')}</div>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-green-600 border-green-500/30 bg-green-500/10">{t('profile.verified')}</Badge>
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl border bg-card hover:bg-accent/30 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-brand/10 flex items-center justify-center">
                      <Star className="h-5 w-5 text-brand" />
                    </div>
                    <div>
                      <div className="font-medium">{t('profile.membership_tier')}</div>
                      <div className="text-xs text-muted-foreground">{t('profile.membership_tier_desc')}</div>
                    </div>
                  </div>
                  <Badge variant="secondary" className="capitalize">{userProfile.tier}</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </form>
      </Form>

      {/* Member Passport Section */}
      <div className="pt-8 border-t border-border/50">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <Wallet className="h-6 w-6 text-primary" />
              {t('profile.passport.title')}
            </h3>
            <p className="text-muted-foreground mt-1">{t('profile.passport.subtitle')}</p>
          </div>

          <div className="flex bg-muted rounded-lg p-1 self-start">
            {(['overview', 'passport', 'status'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  activeTab === tab
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {t(`profile.passport.tabs.${tab}`)}
              </button>
            ))}
          </div>
        </div>

        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <p className="text-muted-foreground leading-relaxed">
                {t('profile.passport.overview_description')}
              </p>

              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: MapPin, label: t('profile.passport.stats.clubs_viewed'), value: mockStats.clubsViewed },
                  { icon: Heart, label: t('profile.passport.stats.favorites'), value: mockStats.favoritesCount },
                  { icon: Star, label: t('profile.passport.stats.reviews'), value: mockStats.reviewsWritten },
                  { icon: Calendar, label: t('profile.passport.stats.member_since'), value: mockStats.memberSince },
                ].map((stat, idx) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="p-4 rounded-xl bg-card border shadow-sm text-center hover:shadow-md transition-shadow"
                  >
                    <stat.icon className="h-5 w-5 text-primary mx-auto mb-2" />
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">{stat.label}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            <MemberPassport
              email={userProfile.email}
              verificationId={verificationId}
              verifiedAt={backendStatus?.passport.verifiedAt || new Date(userProfile.createdAt)}
              tier={backendStatus?.passport.tier || (userProfile.tier === 'premium' ? 'premium' : 'standard')}
            />
          </div>
        )}

        {activeTab === 'passport' && (
          <div className="max-w-md mx-auto">
            <MemberPassport
              email={userProfile.email}
              verificationId={verificationId}
              verifiedAt={backendStatus?.passport.verifiedAt || new Date(userProfile.createdAt)}
              tier={backendStatus?.passport.tier || (userProfile.tier === 'premium' ? 'premium' : 'standard')}
            />
          </div>
        )}

        {activeTab === 'status' && (
          <div className="max-w-2xl mx-auto">
            <ApplicationStatusTracker
              status={backendStatus?.application.status || 'draft'}
              submittedAt={backendStatus?.application.submittedAt}
              estimatedCompletion={backendStatus?.application.estimatedCompletion}
            />
          </div>
        )}
      </div>
    </div>
  );
}
