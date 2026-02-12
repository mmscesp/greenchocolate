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
import {
  Bell,
  Shield,
  Eye,
  Download,
  Check,
  X,
  Lock,
  Trash2
} from 'lucide-react';
import { toast } from 'sonner';

export default function SettingsPage() {
  const { t } = useLanguage();
  const [settings, setSettings] = useState({
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

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSaving(false);
    toast.success(t('settings.save_success'));
  };

  const updateNotificationSetting = (key: string, value: boolean) => {
    setSettings(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: value
      }
    }));
  };

  const updatePrivacySetting = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      privacy: {
        ...prev.privacy,
        [key]: value
      }
    }));
  };

  const updateSecuritySetting = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      security: {
        ...prev.security,
        [key]: value
      }
    }));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t('user.settings')}</h1>
          <p className="text-gray-600 mt-2">
            {t('settings.subtitle')}
          </p>
        </div>

        <Button
          variant="cannabis"
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2"
        >
          {isSaving ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          ) : (
            <Check className="h-4 w-4" />
          )}
          {t('common.save_changes')}
        </Button>
      </div>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
              <Bell className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <CardTitle>{t('settings.notifications.title')}</CardTitle>
              <CardDescription>{t('settings.notifications.desc')}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between space-x-2">
            <Label htmlFor="notifications-email" className="flex flex-col space-y-1">
              <span className="font-medium">{t('settings.notifications.email')}</span>
              <span className="font-normal text-sm text-muted-foreground">{t('settings.notifications.email_desc')}</span>
            </Label>
            <Switch
              id="notifications-email"
              checked={settings.notifications.email}
              onCheckedChange={(checked) => updateNotificationSetting('email', checked)}
            />
          </div>

          <div className="flex items-center justify-between space-x-2">
            <Label htmlFor="notifications-push" className="flex flex-col space-y-1">
              <span className="font-medium">{t('settings.notifications.push')}</span>
              <span className="font-normal text-sm text-muted-foreground">{t('settings.notifications.push_desc')}</span>
            </Label>
            <Switch
              id="notifications-push"
              checked={settings.notifications.push}
              onCheckedChange={(checked) => updateNotificationSetting('push', checked)}
            />
          </div>

          <div className="flex items-center justify-between space-x-2">
            <Label htmlFor="notifications-clubUpdates" className="flex flex-col space-y-1">
              <span className="font-medium">{t('settings.notifications.club_updates')}</span>
              <span className="font-normal text-sm text-muted-foreground">{t('settings.notifications.club_updates_desc')}</span>
            </Label>
            <Switch
              id="notifications-clubUpdates"
              checked={settings.notifications.clubUpdates}
              onCheckedChange={(checked) => updateNotificationSetting('clubUpdates', checked)}
            />
          </div>

          <div className="flex items-center justify-between space-x-2">
            <Label htmlFor="notifications-newReviews" className="flex flex-col space-y-1">
              <span className="font-medium">{t('settings.notifications.new_reviews')}</span>
              <span className="font-normal text-sm text-muted-foreground">{t('settings.notifications.new_reviews_desc')}</span>
            </Label>
            <Switch
              id="notifications-newReviews"
              checked={settings.notifications.newReviews}
              onCheckedChange={(checked) => updateNotificationSetting('newReviews', checked)}
            />
          </div>

          <div className="flex items-center justify-between space-x-2">
            <Label htmlFor="notifications-marketing" className="flex flex-col space-y-1">
              <span className="font-medium">{t('settings.notifications.marketing')}</span>
              <span className="font-normal text-sm text-muted-foreground">{t('settings.notifications.marketing_desc')}</span>
            </Label>
            <Switch
              id="notifications-marketing"
              checked={settings.notifications.marketing}
              onCheckedChange={(checked) => updateNotificationSetting('marketing', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Privacy */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
              <Eye className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <CardTitle>{t('settings.privacy.title')}</CardTitle>
              <CardDescription>{t('settings.privacy.desc')}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <Label className="text-base font-medium">{t('settings.privacy.visibility')}</Label>
            <RadioGroup
              value={settings.privacy.profileVisibility}
              onValueChange={(value) => updatePrivacySetting('profileVisibility', value)}
              className="space-y-2"
            >
              {[
                { value: 'public', label: t('settings.privacy.visibility_public'), desc: t('settings.privacy.visibility_public_desc') },
                { value: 'friends', label: t('settings.privacy.visibility_friends'), desc: t('settings.privacy.visibility_friends_desc') },
                { value: 'private', label: t('settings.privacy.visibility_private'), desc: t('settings.privacy.visibility_private_desc') }
              ].map(option => (
                <div key={option.value} className="flex items-center space-x-3 space-y-0 rounded-md border p-4 hover:bg-accent hover:text-accent-foreground transition-colors">
                  <RadioGroupItem value={option.value} id={`privacy-${option.value}`} />
                  <Label htmlFor={`privacy-${option.value}`} className="flex flex-col space-y-1 cursor-pointer w-full">
                    <span className="font-medium">{option.label}</span>
                    <span className="font-normal text-sm text-muted-foreground">{option.desc}</span>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="space-y-4 pt-4 border-t">
            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="privacy-showEmail" className="flex flex-col space-y-1">
                <span className="font-medium">{t('settings.privacy.show_email')}</span>
                <span className="font-normal text-sm text-muted-foreground">{t('settings.privacy.show_email_desc')}</span>
              </Label>
              <Switch
                id="privacy-showEmail"
                checked={settings.privacy.showEmail}
                onCheckedChange={(checked) => updatePrivacySetting('showEmail', checked)}
              />
            </div>

            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="privacy-showLocation" className="flex flex-col space-y-1">
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
              <Label htmlFor="privacy-allowMessages" className="flex flex-col space-y-1">
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
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
              <Shield className="h-5 w-5 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <CardTitle>{t('settings.security.title')}</CardTitle>
              <CardDescription>{t('settings.security.desc')}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-base font-medium">{t('settings.security.two_factor')}</Label>
              <p className="text-sm text-muted-foreground">{t('settings.security.two_factor_desc')}</p>
            </div>
            <div className="flex items-center gap-3">
              {settings.security.twoFactor ? (
                <Badge variant="success" className="flex items-center gap-1">
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
                variant={settings.security.twoFactor ? "outline" : "cannabis"}
                size="sm"
                onClick={() => updateSecuritySetting('twoFactor', !settings.security.twoFactor)}
              >
                {settings.security.twoFactor ? t('common.disable') : t('common.enable')}
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between space-x-2">
            <Label htmlFor="security-loginAlerts" className="flex flex-col space-y-1">
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
              <SelectTrigger id="security-sessionTimeout" className="w-full">
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

          <div className="pt-4 border-t">
            <Button variant="outline" className="flex items-center gap-2">
              <Lock className="h-4 w-4" />
              {t('settings.security.change_password')}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Data Management */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
              <Download className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            </div>
            <div>
              <CardTitle>{t('settings.data.title')}</CardTitle>
              <CardDescription>{t('settings.data.desc')}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors">
            <div className="space-y-1">
              <h3 className="font-medium text-foreground">{t('settings.data.download')}</h3>
              <p className="text-sm text-muted-foreground">{t('settings.data.download_desc')}</p>
            </div>
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              {t('common.download')}
            </Button>
          </div>

          <div className="flex items-center justify-between p-4 border border-destructive/20 rounded-lg bg-destructive/5 hover:bg-destructive/10 transition-colors">
            <div className="space-y-1">
              <h3 className="font-medium text-destructive">{t('settings.data.delete_account')}</h3>
              <p className="text-sm text-destructive/80">{t('settings.data.delete_account_desc')}</p>
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
