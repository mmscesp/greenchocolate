'use client';

export const dynamic = 'force-dynamic';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useLanguage } from '@/hooks/useLanguage';
import { Bell,
Shield,
Eye,
Download,
Check,
X,
Lock,
Trash2 } from '@/lib/icons';
import { toast } from 'sonner';

type NotificationSettings = {
  email: boolean;
  push: boolean;
  sms: boolean;
  marketing: boolean;
  clubUpdates: boolean;
  newReviews: boolean;
  favoriteClubEvents: boolean;
};

type PrivacySettings = {
  profileVisibility: 'public' | 'friends' | 'private';
  showEmail: boolean;
  showPhone: boolean;
  showLocation: boolean;
  allowMessages: boolean;
};

type SecuritySettings = {
  twoFactor: boolean;
  loginAlerts: boolean;
  sessionTimeout: number;
};

type UserSettings = {
  notifications: NotificationSettings;
  privacy: PrivacySettings;
  security: SecuritySettings;
};

export default function SettingsPage() {
  const { t } = useLanguage();
  const [settings, setSettings] = useState<UserSettings>({
    notifications: {
      email: true,
      push: true,
      sms: false,
      marketing: false,
      clubUpdates: true,
      newReviews: true,
      favoriteClubEvents: true
    },
    privacy: {
      profileVisibility: 'public', // public, friends, private
      showEmail: false,
      showPhone: false,
      showLocation: true,
      allowMessages: true
    },
    security: {
      twoFactor: false,
      loginAlerts: true,
      sessionTimeout: 30
    }
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async (): Promise<void> => {
    setIsSaving(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      toast.success(t('settings.save_success'));
    } catch (error) {
      console.error('Failed to save settings:', error);
      toast.error('Failed to save settings. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const updateNotificationSetting = <K extends keyof NotificationSettings>(
    key: K,
    value: NotificationSettings[K]
  ): void => {
    setSettings(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: value
      }
    }));
  };

  const updatePrivacySetting = <K extends keyof PrivacySettings>(
    key: K,
    value: PrivacySettings[K]
  ): void => {
    setSettings(prev => ({
      ...prev,
      privacy: {
        ...prev.privacy,
        [key]: value
      }
    }));
  };

  const updateSecuritySetting = <K extends keyof SecuritySettings>(
    key: K,
    value: SecuritySettings[K]
  ): void => {
    setSettings(prev => ({
      ...prev,
      security: {
        ...prev.security,
        [key]: value
      }
    }));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">{t('user.settings')}</h1>
          <p className="text-muted-foreground mt-1">
            {t('settings.subtitle')}
          </p>
        </div>

        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 self-start"
        >
          {isSaving ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground"></div>
          ) : (
            <Check className="h-4 w-4" />
          )}
          {t('common.save_changes')}
        </Button>
      </div>

      {/* Notifications */}
      <Card className="shadow-sm">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500/10 rounded-full flex items-center justify-center">
              <Bell className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-lg">{t('settings.notifications.title')}</CardTitle>
              <CardDescription>{t('settings.notifications.desc')}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-5">
          {[
            { id: 'email', label: t('settings.notifications.email'), desc: t('settings.notifications.email_desc') },
            { id: 'push', label: t('settings.notifications.push'), desc: t('settings.notifications.push_desc') },
            { id: 'clubUpdates', label: t('settings.notifications.club_updates'), desc: t('settings.notifications.club_updates_desc') },
            { id: 'newReviews', label: t('settings.notifications.new_reviews'), desc: t('settings.notifications.new_reviews_desc') },
            { id: 'marketing', label: t('settings.notifications.marketing'), desc: t('settings.notifications.marketing_desc') },
          ].map((item, index) => (
            <div key={item.id} className={`flex items-center justify-between space-x-2 ${index !== 4 ? 'pb-5 border-b border-border/50' : ''}`}>
              <Label htmlFor={`notifications-${item.id}`} className="flex flex-col space-y-1 cursor-pointer">
                <span className="font-medium">{item.label}</span>
                <span className="font-normal text-sm text-muted-foreground">{item.desc}</span>
              </Label>
              <Switch
                id={`notifications-${item.id}`}
                checked={settings.notifications[item.id as keyof typeof settings.notifications]}
                onCheckedChange={(checked) => updateNotificationSetting(item.id as keyof NotificationSettings, checked)}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Privacy */}
      <Card className="shadow-sm">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-500/10 rounded-full flex items-center justify-center">
              <Eye className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <CardTitle className="text-lg">{t('settings.privacy.title')}</CardTitle>
              <CardDescription>{t('settings.privacy.desc')}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <Label className="text-base font-medium">{t('settings.privacy.visibility')}</Label>
            <RadioGroup
              value={settings.privacy.profileVisibility}
              onValueChange={(value) => updatePrivacySetting('profileVisibility', value as PrivacySettings['profileVisibility'])}
              className="space-y-2"
            >
              {[
                { value: 'public', label: t('settings.privacy.visibility_public'), desc: t('settings.privacy.visibility_public_desc') },
                { value: 'friends', label: t('settings.privacy.visibility_friends'), desc: t('settings.privacy.visibility_friends_desc') },
                { value: 'private', label: t('settings.privacy.visibility_private'), desc: t('settings.privacy.visibility_private_desc') }
              ].map(option => (
                <div key={option.value} className="flex items-center space-x-3 space-y-0 rounded-xl border p-4 hover:bg-accent/50 hover:border-accent transition-colors cursor-pointer">
                  <RadioGroupItem value={option.value} id={`privacy-${option.value}`} />
                  <Label htmlFor={`privacy-${option.value}`} className="flex flex-col space-y-1 cursor-pointer w-full">
                    <span className="font-medium">{option.label}</span>
                    <span className="font-normal text-sm text-muted-foreground">{option.desc}</span>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="space-y-4 pt-4 border-t border-border/50">
            <div className="flex items-center justify-between space-x-2 pb-4 border-b border-border/50">
              <Label htmlFor="privacy-showEmail" className="flex flex-col space-y-1 cursor-pointer">
                <span className="font-medium">{t('settings.privacy.show_email')}</span>
                <span className="font-normal text-sm text-muted-foreground">{t('settings.privacy.show_email_desc')}</span>
              </Label>
              <Switch
                id="privacy-showEmail"
                checked={settings.privacy.showEmail}
                onCheckedChange={(checked) => updatePrivacySetting('showEmail', checked)}
              />
            </div>

            <div className="flex items-center justify-between space-x-2 pb-4 border-b border-border/50">
              <Label htmlFor="privacy-showLocation" className="flex flex-col space-y-1 cursor-pointer">
                <span className="font-medium">{t('settings.privacy.show_location')}</span>
                <span className="font-normal text-sm text-muted-foreground">{t('settings.privacy.show_location_desc')}</span>
              </Label>
              <Switch
                id="privacy-showLocation"
                checked={settings.privacy.showLocation}
                onCheckedChange={(checked) => updatePrivacySetting('showLocation', checked)}
              />
            </div>

            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="privacy-allowMessages" className="flex flex-col space-y-1 cursor-pointer">
                <span className="font-medium">{t('settings.privacy.allow_messages')}</span>
                <span className="font-normal text-sm text-muted-foreground">{t('settings.privacy.allow_messages_desc')}</span>
              </Label>
              <Switch
                id="privacy-allowMessages"
                checked={settings.privacy.allowMessages}
                onCheckedChange={(checked) => updatePrivacySetting('allowMessages', checked)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security */}
      <Card className="shadow-sm">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-500/10 rounded-full flex items-center justify-center">
              <Shield className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <CardTitle className="text-lg">{t('settings.security.title')}</CardTitle>
              <CardDescription>{t('settings.security.desc')}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="flex items-center justify-between p-4 rounded-xl border bg-card">
            <div className="space-y-1">
              <Label className="text-base font-medium">{t('settings.security.two_factor')}</Label>
              <p className="text-sm text-muted-foreground">{t('settings.security.two_factor_desc')}</p>
            </div>
            <div className="flex items-center gap-3">
              {settings.security.twoFactor ? (
                <Badge variant="outline" className="flex items-center gap-1 bg-green-500/10 text-green-600 border-green-500/20">
                  <Check className="h-3 w-3" />
                  {t('common.enabled')}
                </Badge>
              ) : (
                <Badge variant="outline" className="flex items-center gap-1">
                  <X className="h-3 w-3" />
                  {t('common.disabled')}
                </Badge>
              )}
              <Button
                variant={settings.security.twoFactor ? "outline" : "default"}
                size="sm"
                onClick={() => updateSecuritySetting('twoFactor', !settings.security.twoFactor)}
              >
                {settings.security.twoFactor ? t('common.disable') : t('common.enable')}
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between space-x-2 py-4 border-y border-border/50">
            <Label htmlFor="security-loginAlerts" className="flex flex-col space-y-1 cursor-pointer">
              <span className="font-medium">{t('settings.security.login_alerts')}</span>
              <span className="font-normal text-sm text-muted-foreground">{t('settings.security.login_alerts_desc')}</span>
            </Label>
            <Switch
              id="security-loginAlerts"
              checked={settings.security.loginAlerts}
              onCheckedChange={(checked) => updateSecuritySetting('loginAlerts', checked)}
            />
          </div>

          <div className="space-y-3">
            <Label htmlFor="security-sessionTimeout" className="font-medium">{t('settings.security.session_timeout')}</Label>
            <Select
              value={settings.security.sessionTimeout.toString()}
              onValueChange={(value) => updateSecuritySetting('sessionTimeout', Number(value))}
            >
              <SelectTrigger id="security-sessionTimeout" className="w-full sm:w-64">
                <SelectValue placeholder={t('settings.security.session_timeout')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="15">{t('settings.security.timeout_15m')}</SelectItem>
                <SelectItem value="30">{t('settings.security.timeout_30m')}</SelectItem>
                <SelectItem value="60">{t('settings.security.timeout_1h')}</SelectItem>
                <SelectItem value="120">{t('settings.security.timeout_2h')}</SelectItem>
                <SelectItem value="0">{t('settings.security.timeout_none')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="pt-4">
            <Button variant="outline" className="flex items-center gap-2">
              <Lock className="h-4 w-4" />
              {t('settings.security.change_password')}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Data Management */}
      <Card className="shadow-sm">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
              <Download className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <CardTitle className="text-lg">{t('settings.data.title')}</CardTitle>
              <CardDescription>{t('settings.data.desc')}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-xl border bg-card hover:bg-accent/30 transition-colors">
            <div className="space-y-1">
              <h3 className="font-medium text-foreground">{t('settings.data.download')}</h3>
              <p className="text-sm text-muted-foreground">{t('settings.data.download_desc')}</p>
            </div>
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              {t('common.download')}
            </Button>
          </div>

          <div className="flex items-center justify-between p-4 rounded-xl border border-destructive/20 bg-destructive/5 hover:bg-destructive/10 transition-colors">
            <div className="space-y-1">
              <h3 className="font-medium text-destructive">{t('settings.data.delete_account')}</h3>
              <p className="text-sm text-destructive/70">{t('settings.data.delete_account_desc')}</p>
            </div>
            <Button variant="destructive" className="flex items-center gap-2">
              <Trash2 className="h-4 w-4" />
              {t('common.delete')}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
