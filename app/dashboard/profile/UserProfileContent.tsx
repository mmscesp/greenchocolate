'use client';

import { useState } from 'react';
import type { UserProfile } from '@/app/actions/users';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useLanguage } from '@/hooks/useLanguage';
import { updateUserProfile } from '@/app/actions/users';
import { 
  User, 
  Mail, 
  Shield, 
  Calendar,
  Edit3,
  Save,
  X,
  Check
} from 'lucide-react';

interface UserProfileContentProps {
  userProfile: UserProfile | null;
}

export default function UserProfileContent({ userProfile }: UserProfileContentProps) {
  const { t } = useLanguage();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    displayName: userProfile?.displayName || '',
    bio: userProfile?.bio || '',
  });

  if (!userProfile) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <h2 className="text-xl font-semibold text-red-800 mb-2">User Not Found</h2>
          <p className="text-red-600">Please log in to view your profile.</p>
        </div>
      </div>
    );
  }

  const handleSave = async () => {
    setIsSaving(true);
    const form = new FormData();
    form.set('displayName', formData.displayName);
    form.set('bio', formData.bio);
    
    const result = await updateUserProfile(form);
    
    setIsSaving(false);
    if (result.success) {
      setIsEditing(false);
    } else {
      alert(result.message);
    }
  };

  const handleCancel = () => {
    setFormData({
      displayName: userProfile.displayName || '',
      bio: userProfile.bio || '',
    });
    setIsEditing(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t('dashboard.profile')}</h1>
          <p className="text-gray-600 mt-2">
            Manage your account settings and preferences
          </p>
        </div>
        
        {!isEditing ? (
          <Button
            variant="cannabis"
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2"
          >
            <Edit3 className="h-4 w-4" />
            Edit Profile
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleCancel}
              className="flex items-center gap-2"
            >
              <X className="h-4 w-4" />
              Cancel
            </Button>
            <Button
              variant="cannabis"
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2"
            >
              {isSaving ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <Save className="h-4 w-4" />
              )}
              Save
            </Button>
          </div>
        )}
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <div className="flex items-center gap-6 mb-6">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
            {userProfile.avatarUrl ? (
              <img 
                src={userProfile.avatarUrl} 
                alt={userProfile.displayName || 'User'} 
                className="w-20 h-20 rounded-full object-cover"
              />
            ) : (
              <User className="h-10 w-10 text-green-600" />
            )}
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {userProfile.displayName || 'User'}
            </h2>
            <div className="flex items-center gap-2 text-gray-500 mt-1">
              <Mail className="h-4 w-4" />
              <span>{userProfile.email}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-500 mt-1">
              <Shield className="h-4 w-4" />
              <span className="capitalize">{userProfile.role.toLowerCase().replace('_', ' ')}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Display Name
            </label>
            {isEditing ? (
              <Input
                value={formData.displayName}
                onChange={(e) => setFormData(prev => ({ ...prev, displayName: e.target.value }))}
                placeholder="Your display name"
              />
            ) : (
              <p className="text-gray-900 p-3 bg-gray-50 rounded-md">
                {userProfile.displayName || 'Not set'}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <p className="text-gray-900 p-3 bg-gray-50 rounded-md">
              {userProfile.email}
            </p>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bio
            </label>
            {isEditing ? (
              <Textarea
                value={formData.bio}
                onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                placeholder="Tell us about yourself"
                rows={4}
              />
            ) : (
              <p className="text-gray-900 p-3 bg-gray-50 rounded-md">
                {userProfile.bio || 'No bio yet'}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Account Info */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Account Information</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Member Since
            </label>
            <div className="flex items-center gap-2 text-gray-900 p-3 bg-gray-50 rounded-md">
              <Calendar className="h-4 w-4 text-gray-400" />
              <span>
                {new Date(userProfile.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Account Status
            </label>
            <div className="flex items-center gap-2">
              {userProfile.isVerified ? (
                <span className="flex items-center gap-2 px-3 py-2 bg-green-100 text-green-800 rounded-md">
                  <Check className="h-4 w-4" />
                  Verified
                </span>
              ) : (
                <span className="flex items-center gap-2 px-3 py-2 bg-yellow-100 text-yellow-800 rounded-md">
                  <Shield className="h-4 w-4" />
                  Pending Verification
                </span>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Member Tier
            </label>
            <p className="text-gray-900 p-3 bg-gray-50 rounded-md capitalize">
              {userProfile.tier}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
