'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/hooks/useLanguage';
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

export default function ProfilePage() {
  const { t } = useLanguage();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Mock user data
  const [userProfile, setUserProfile] = useState({
    name: 'María González',
    email: 'maria.gonzalez@email.com',
    phone: '+34 600 123 456',
    location: 'Madrid, España',
    bio: 'Amante de la cultura cannabis responsable. Me encanta descubrir nuevos clubs y conectar con la comunidad.',
    dateOfBirth: '1990-05-15',
    memberSince: '2023-03-15',
    preferences: {
      vibes: ['Relajado', 'Social', 'Creativo'],
      neighborhoods: ['Malasaña', 'Centro', 'Chueca']
    },
    stats: {
      favoriteClubs: 3,
      reviews: 12,
      rating: 4.8,
      visits: 45
    },
    isPremium: false,
    isVerified: true
  });

  const [editForm, setEditForm] = useState(userProfile);

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setUserProfile(editForm);
    setIsSaving(false);
    setIsEditing(false);
    alert(t('form.success'));
  };

  const handleCancel = () => {
    setEditForm(userProfile);
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
              {t('form.cancel')}
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
                  <User className="h-16 w-16 text-white" />
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
                <h2 className="text-2xl font-bold text-gray-900">{userProfile.name}</h2>
                {userProfile.isVerified && (
                  <Badge variant="verified" className="flex items-center gap-1">
                    <Shield className="h-3 w-3" />
                    Verificado
                  </Badge>
                )}
                {userProfile.isPremium && (
                  <Badge variant="premium" className="flex items-center gap-1">
                    <Star className="h-3 w-3" />
                    Premium
                  </Badge>
                )}
              </div>
              <p className="text-gray-600 mb-3">{userProfile.bio}</p>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>{t('user.member_since')} {new Date(userProfile.memberSince).getFullYear()}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span>{userProfile.location}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8 p-6 bg-gray-50 rounded-xl">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{userProfile.stats.favoriteClubs}</div>
              <div className="text-sm text-gray-600">{t('user.favorite_clubs')}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{userProfile.stats.reviews}</div>
              <div className="text-sm text-gray-600">{t('user.reviews')}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">{userProfile.stats.rating}</div>
              <div className="text-sm text-gray-600">{t('user.rating')}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{userProfile.stats.visits}</div>
              <div className="text-sm text-gray-600">Visitas</div>
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
              Nombre completo
            </label>
            {isEditing ? (
              <input
                type="text"
                value={editForm.name}
                onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
              />
            ) : (
              <p className="text-gray-900 p-3 bg-gray-50 rounded-lg">{userProfile.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            {isEditing ? (
              <input
                type="email"
                value={editForm.email}
                onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
              />
            ) : (
              <p className="text-gray-900 p-3 bg-gray-50 rounded-lg flex items-center gap-2">
                <Mail className="h-4 w-4 text-gray-400" />
                {userProfile.email}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Teléfono
            </label>
            {isEditing ? (
              <input
                type="tel"
                value={editForm.phone}
                onChange={(e) => setEditForm(prev => ({ ...prev, phone: e.target.value }))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
              />
            ) : (
              <p className="text-gray-900 p-3 bg-gray-50 rounded-lg flex items-center gap-2">
                <Phone className="h-4 w-4 text-gray-400" />
                {userProfile.phone}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ubicación
            </label>
            {isEditing ? (
              <input
                type="text"
                value={editForm.location}
                onChange={(e) => setEditForm(prev => ({ ...prev, location: e.target.value }))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
              />
            ) : (
              <p className="text-gray-900 p-3 bg-gray-50 rounded-lg flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gray-400" />
                {userProfile.location}
              </p>
            )}
          </div>

          <div className="lg:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Biografía
            </label>
            {isEditing ? (
              <textarea
                rows={3}
                value={editForm.bio}
                onChange={(e) => setEditForm(prev => ({ ...prev, bio: e.target.value }))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                placeholder="Cuéntanos sobre ti..."
              />
            ) : (
              <p className="text-gray-900 p-3 bg-gray-50 rounded-lg">{userProfile.bio}</p>
            )}
          </div>
        </div>
      </div>

      {/* Preferences */}
      <div className="bg-white rounded-2xl p-8 shadow-sm">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Preferencias</h3>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Ambientes Favoritos
            </label>
            <div className="flex flex-wrap gap-2">
              {userProfile.preferences.vibes.map(vibe => (
                <Badge key={vibe} variant="secondary" className="flex items-center gap-1">
                  <Heart className="h-3 w-3" />
                  {vibe}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Barrios Preferidos
            </label>
            <div className="flex flex-wrap gap-2">
              {userProfile.preferences.neighborhoods.map(neighborhood => (
                <Badge key={neighborhood} variant="outline" className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {neighborhood}
                </Badge>
              ))}
            </div>
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

          {!userProfile.isPremium && (
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                  <Star className="h-5 w-5 text-white" />
                </div>
                <div>
                  <div className="font-medium text-orange-800">Actualizar a Premium</div>
                  <div className="text-sm text-orange-600">Accede a funciones exclusivas</div>
                </div>
              </div>
              <Button variant="outline" className="border-orange-300 text-orange-600 hover:bg-orange-50">
                Actualizar
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}