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
import type { UserProfile } from '@/app/actions/users';
import { useLanguage } from '@/hooks/useLanguage';
import { updateUserProfile } from '@/app/actions/users';
import MemberPassport from '@/components/profile/MemberPassport';
import ApplicationStatusTracker from '@/components/profile/ApplicationStatusTracker';
import TrustBadge from '@/components/trust/TrustBadge';
import { 
  Edit3, 
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
  CreditCard
} from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

interface UserProfilePageContentProps {
  userProfile: UserProfile | null;
}

// Mock data - replace with real data from your backend
const mockApplicationStatus = {
  status: 'reviewing' as const,
  submittedAt: new Date('2026-02-10'),
  estimatedCompletion: new Date('2026-02-20')
};

const mockStats = {
  clubsViewed: 12,
  favoritesCount: 3,
  reviewsWritten: 2,
  memberSince: '2026'
};

const profileFormSchema = z.object({
  displayName: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  bio: z.string().max(160).optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export default function UserProfilePageContent({ userProfile }: UserProfilePageContentProps) {
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

  const displayName = userProfile?.displayName || userProfile?.email?.split('@')[0] || 'Member';
  const verificationId = `SMC-2026-${userProfile?.id?.slice(0, 8).toUpperCase() || 'UNKNOWN'}`;

  if (!userProfile) {
    return (
      <div className="max-w-4xl mx-auto animate-in fade-in duration-500">
        <Card className="border-destructive/50 bg-destructive/10">
          <CardContent className="flex flex-col items-center justify-center p-6 text-center">
            <h2 className="text-xl font-semibold text-destructive mb-2">{t('profile.not_found')}</h2>
            <p className="text-destructive/80">{t('profile.login_required')}</p>
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
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t('user.my_profile')}</h1>
          <p className="text-muted-foreground mt-2">
            {t('profile.subtitle')}
          </p>
        </div>
        
        {!isEditing ? (
          <Button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2"
          >
            <Edit3 className="h-4 w-4" />
            {t('profile.edit')}
          </Button>
        ) : (
          <div className="flex gap-2">
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
          <Card className="overflow-hidden border-0 shadow-lg">
            {/* Cover Image */}
            <div className="h-32 bg-gradient-to-r from-primary/80 via-primary to-primary/60 relative">
              <div className="absolute inset-0 bg-black/10"></div>
              {isEditing && (
                <Button 
                  size="icon" 
                  variant="secondary" 
                  className="absolute top-4 right-4 rounded-full bg-background/20 backdrop-blur-sm hover:bg-background/40 text-white border-0"
                  type="button"
                >
                  <Camera className="h-4 w-4" />
                </Button>
              )}
            </div>

            {/* Profile Info */}
            <div className="relative px-8 pb-8">
              {/* Avatar */}
              <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6 -mt-16 mb-6 text-center sm:text-left">
                <div className="relative group">
                  <div className="rounded-full p-1.5 bg-background shadow-xl">
                    <Avatar className="w-32 h-32 border-4 border-background">
                      <AvatarImage src={userProfile.avatarUrl || ''} alt={userProfile.displayName || 'User'} />
                      <AvatarFallback className="text-4xl bg-primary/10 text-primary">
                        {(userProfile.displayName || 'U').charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  {isEditing && (
                    <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
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
                              <Input {...field} className="text-xl font-bold h-auto py-1 px-3 w-full sm:w-64" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    ) : (
                      <h2 className="text-2xl font-bold text-foreground">
                        {userProfile.displayName || 'User'}
                      </h2>
                    )}
                    
                    {userProfile.isVerified && (
                      <Badge variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-blue-200 gap-1">
                        <Shield className="h-3 w-3 fill-blue-700" />
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
                                className="resize-none min-h-[80px]" 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    ) : (
                      <p>{userProfile.bio || t('profile.no_bio')}</p>
                    )}
                  </div>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground pt-2 justify-center sm:justify-start">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>{t('user.member_since')} {new Date(userProfile.createdAt).getFullYear()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <div className="grid grid-cols-1 gap-6">
            {/* Personal Information */}
            <Card>
              <CardHeader>
                <CardTitle>{t('profile.personal_info')}</CardTitle>
                <CardDescription>{t('profile.personal_info_desc')}</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 mb-2 block">
                    {t('form.email')}
                  </label>
                  <div className="flex items-center gap-2 p-3 rounded-md border bg-muted/50 text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    <span>{userProfile.email}</span>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 mb-2 block">
                    {t('profile.role')}
                  </label>
                  <div className="flex items-center gap-2 p-3 rounded-md border bg-muted/50 text-muted-foreground capitalize">
                    <User className="h-4 w-4" />
                    <span>{userProfile.role.toLowerCase().replace('_', ' ')}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Account Status */}
            <Card>
              <CardHeader>
                <CardTitle>{t('profile.account_status')}</CardTitle>
                <CardDescription>{t('profile.account_status_desc')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                      <Check className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <div className="font-medium">{t('profile.account_verified')}</div>
                      <div className="text-sm text-muted-foreground">{t('profile.account_verified_desc')}</div>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50 dark:bg-green-900/10 dark:border-green-800">{t('profile.verified')}</Badge>
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
                      <Star className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                    </div>
                    <div>
                      <div className="font-medium">{t('profile.membership_tier')}</div>
                      <div className="text-sm text-muted-foreground">{t('profile.membership_tier_desc')}</div>
                    </div>
                  </div>
                  <Badge variant="secondary" className="capitalize">{userProfile.tier}</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </form>
      </Form>

      {/* Member Passport Section - New Feature */}
      <div className="mt-12 pt-12 border-t border-border">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-2xl font-serif text-foreground flex items-center gap-3">
              <Wallet className="h-6 w-6 text-primary" />
              Member Passport
            </h3>
            <p className="text-muted-foreground mt-1">Your digital membership credentials</p>
          </div>
          
          <div className="flex bg-muted rounded-lg p-1">
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
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <p className="text-muted-foreground">
                Your Member Passport is your digital credential for accessing verified clubs in Barcelona. 
                Keep your profile information up to date to ensure smooth entry.
              </p>
              
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: MapPin, label: 'Clubs Viewed', value: mockStats.clubsViewed },
                  { icon: Heart, label: 'Favorites', value: mockStats.favoritesCount },
                  { icon: Star, label: 'Reviews', value: mockStats.reviewsWritten },
                  { icon: Calendar, label: 'Member Since', value: mockStats.memberSince },
                ].map((stat, idx) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="p-4 rounded-xl bg-muted border text-center"
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
              verifiedAt={new Date(userProfile.createdAt)}
              tier={userProfile.tier === 'premium' ? 'premium' : 'standard'}
            />
          </div>
        )}

        {activeTab === 'passport' && (
          <div className="max-w-md mx-auto">
            <MemberPassport 
              email={userProfile.email}
              verificationId={verificationId}
              verifiedAt={new Date(userProfile.createdAt)}
              tier={userProfile.tier === 'premium' ? 'premium' : 'standard'}
            />
          </div>
        )}

        {activeTab === 'status' && (
          <div className="max-w-2xl mx-auto">
            <ApplicationStatusTracker 
              status={mockApplicationStatus.status}
              submittedAt={mockApplicationStatus.submittedAt}
              estimatedCompletion={mockApplicationStatus.estimatedCompletion}
            />
          </div>
        )}
      </div>
    </div>
  );
}
