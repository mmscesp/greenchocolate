'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type { UserProfile } from '@/app/actions/users';
import { useLanguage } from '@/hooks/useLanguage';
import { updateUserProfile } from '@/app/actions/users';
import { 
  Edit3, 
  Save, 
  X, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  Star,
  Heart,
  Shield,
  Camera,
  Check
} from 'lucide-react';

interface UserProfilePageContentProps {
  userProfile: UserProfile | null;
}

export default function UserProfilePageContent({ userProfile }: UserProfilePageContentProps) {
  const { t } = useLanguage();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const [editForm, setEditForm] = useState({
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
    form.set('displayName', editForm.displayName);
    form.set('bio', editForm.bio);
    
    const result = await updateUserProfile(form);
    
    setIsSaving(false);
    if (result.success) {
      setIsEditing(false);
    } else {
      alert(result.message);
    }
  };

  const handleCancel = () => {
    setEditForm({
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
          <h1 className="text-3xl font-bold text-gray-900">{t('user.my_profile')}</h1>
          <p className="text-gray-600 mt-2">
            Gestiona tu información personal y preferencias
          </p>
        </div>
        
        {!isEditing ? (
          <Button
            variant="cannabis"
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2"
          >
            <Edit3 className="h-4 w-4" />
            Editar Perfil
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleCancel}
              className="flex items-center gap-2"
            >
              <X className="h-4 w-4" />
              Cancelar
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
              Guardar
            </Button>
          </div>
        )}
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Cover Image */}
        <div className="h-32 bg-gradient-to-r from-green-400 via-emerald-500 to-green-600 relative">
          <div className="absolute inset-0 bg-black/20"></div>
          {isEditing && (
            <button className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm rounded-full p-2 hover:bg-white/30 transition-colors">
              <Camera className="h-4 w-4 text-white" />
            </button>
          )}
        </div>

        {/* Profile Info */}
        <div className="relative px-8 pb-8">
          {/* Avatar */}
          <div className="flex items-end gap-6 -mt-16 mb-6">
            <div className="relative">
              <div className="w-32 h-32 bg-white rounded-full p-2 shadow-lg">
                <div className="w-full h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
                  {userProfile.avatarUrl ? (
                    <img 
                      src={userProfile.avatarUrl} 
                      alt={userProfile.displayName || 'User'} 
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <User className="h-16 w-16 text-white" />
                  )}
                </div>
              </div>
              {isEditing && (
                <button className="absolute bottom-2 right-2 bg-green-600 rounded-full p-2 hover:bg-green-700 transition-colors">
                  <Camera className="h-4 w-4 text-white" />
                </button>
              )}
            </div>

            <div className="flex-1 pb-4">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-2xl font-bold text-gray-900">
                  {isEditing ? (
                    <Input
                      value={editForm.displayName}
                      onChange={(e) => setEditForm(prev => ({ ...prev, displayName: e.target.value }))}
                      className="w-64"
                      placeholder="Tu nombre"
                    />
                  ) : (
                    userProfile.displayName || 'Usuario'
                  )}
                </h2>
                {userProfile.isVerified && (
                  <Badge variant="verified" className="flex items-center gap-1">
                    <Shield className="h-3 w-3" />
                    Verificado
                  </Badge>
                )}
              </div>
              <p className="text-gray-600 mb-3">
                {isEditing ? (
                  <Textarea
                    value={editForm.bio}
                    onChange={(e) => setEditForm(prev => ({ ...prev, bio: e.target.value }))}
                    className="w-full resize-none"
                    rows={2}
                    placeholder="Cuéntanos sobre ti..."
                  />
                ) : (
                  userProfile.bio || 'Sin biografía'
                )}
              </p>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>{t('user.member_since')} {new Date(userProfile.createdAt).getFullYear()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Personal Information */}
      <div className="bg-white rounded-2xl p-8 shadow-sm">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Información Personal</h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <p className="text-gray-900 p-3 bg-gray-50 rounded-lg flex items-center gap-2">
              <Mail className="h-4 w-4 text-gray-400" />
              {userProfile.email}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rol
            </label>
            <p className="text-gray-900 p-3 bg-gray-50 rounded-lg capitalize">
              {userProfile.role.toLowerCase().replace('_', ' ')}
            </p>
          </div>
        </div>
      </div>

      {/* Account Status */}
      <div className="bg-white rounded-2xl p-8 shadow-sm">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Estado de la Cuenta</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <Check className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <div className="font-medium text-green-800">Cuenta Verificada</div>
                <div className="text-sm text-green-600">Tu identidad ha sido verificada</div>
              </div>
            </div>
            <Badge variant="verified">Verificado</Badge>
          </div>

          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                <Star className="h-5 w-5 text-white" />
              </div>
              <div>
                <div className="font-medium text-orange-800">Tier: {userProfile.tier}</div>
                <div className="text-sm text-orange-600">Nivel de membresía</div>
              </div>
            </div>
            <Badge variant="secondary" className="capitalize">{userProfile.tier}</Badge>
          </div>
        </div>
      </div>
    </div>
  );
}
