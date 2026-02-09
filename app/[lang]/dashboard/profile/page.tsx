'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useClubs } from '@/hooks/useClubs';
import { useLanguage } from '@/hooks/useLanguage';
import { AMENITIES, VIBE_TAGS, NEIGHBORHOODS } from '@/lib/constants';
import { 
  Edit3, 
  Save, 
  X, 
  Plus, 
  Trash2, 
  MapPin, 
  Phone, 
  Mail, 
  Globe,
  Instagram,
  Facebook,
  Upload,
  Check
} from 'lucide-react';

export default function ProfilePage() {
  const { clubs } = useClubs();
  const { t } = useLanguage();
  const club = clubs[0]; // Simulate current club
  
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editForm, setEditForm] = useState({
    name: club?.name || '',
    description: club?.description || '',
    address: club?.address || '',
    phoneNumber: club?.phoneNumber || '',
    contactEmail: club?.contactEmail || '',
    website: club?.website || '',
    neighborhood: club?.neighborhood || '',
    capacity: club?.capacity || 0,
    priceRange: club?.priceRange || '$',
    amenities: club?.amenities || [],
    vibeTags: club?.vibeTags || [],
    openingHours: club?.openingHours || {
      monday: '16:00 - 00:00',
      tuesday: '16:00 - 00:00',
      wednesday: '16:00 - 00:00',
      thursday: '16:00 - 02:00',
      friday: '16:00 - 02:00',
      saturday: '14:00 - 02:00',
      sunday: '14:00 - 00:00'
    },
    socialMedia: club?.socialMedia || { instagram: '', facebook: '' }
  });

  if (!club) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsSaving(false);
    setIsEditing(false);
    alert(t('form.success'));
  };

  const handleCancel = () => {
    setEditForm({
      name: club.name,
      description: club.description,
      address: club.address || '',
      phoneNumber: club.phoneNumber || '',
      contactEmail: club.contactEmail,
      website: club.website || '',
      neighborhood: club.neighborhood,
      capacity: club.capacity,
      priceRange: club.priceRange,
      amenities: club.amenities,
      vibeTags: club.vibeTags,
      openingHours: club.openingHours,
      socialMedia: club.socialMedia || { instagram: '', facebook: '' }
    });
    setIsEditing(false);
  };

  const toggleAmenity = (amenity: string) => {
    setEditForm(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const toggleVibeTag = (vibe: string) => {
    setEditForm(prev => ({
      ...prev,
      vibeTags: prev.vibeTags.includes(vibe)
        ? prev.vibeTags.filter(v => v !== vibe)
        : [...prev.vibeTags, vibe]
    }));
  };

  const getDayName = (day: string) => {
    const dayMap: Record<string, string> = {
      monday: t('days.monday'),
      tuesday: t('days.tuesday'),
      wednesday: t('days.wednesday'),
      thursday: t('days.thursday'),
      friday: t('days.friday'),
      saturday: t('days.saturday'),
      sunday: t('days.sunday')
    };
    return dayMap[day] || day;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t('dashboard.club_profile')}</h1>
          <p className="text-gray-600 mt-2">
            Gestiona la información y configuración de tu club
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

      {/* Basic Information */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Información Básica</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre del Club
            </label>
            {isEditing ? (
              <input
                type="text"
                value={editForm.name}
                onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
              />
            ) : (
              <p className="text-gray-900 p-3 bg-gray-50 rounded-md">{club.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Barrio
            </label>
            {isEditing ? (
              <select
                value={editForm.neighborhood}
                onChange={(e) => setEditForm(prev => ({ ...prev, neighborhood: e.target.value }))}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
              >
                {NEIGHBORHOODS.map(neighborhood => (
                  <option key={neighborhood} value={neighborhood}>{neighborhood}</option>
                ))}
              </select>
            ) : (
              <p className="text-gray-900 p-3 bg-gray-50 rounded-md">{club.neighborhood}</p>
            )}
          </div>

          <div className="lg:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descripción
            </label>
            {isEditing ? (
              <textarea
                rows={4}
                value={editForm.description}
                onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
              />
            ) : (
              <p className="text-gray-900 p-3 bg-gray-50 rounded-md">{club.description}</p>
            )}
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">{t('club.contact')}</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <MapPin className="h-4 w-4 inline mr-1" />
              Dirección
            </label>
            {isEditing ? (
              <input
                type="text"
                value={editForm.address}
                onChange={(e) => setEditForm(prev => ({ ...prev, address: e.target.value }))}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
              />
            ) : (
              <p className="text-gray-900 p-3 bg-gray-50 rounded-md">{club.address}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Phone className="h-4 w-4 inline mr-1" />
              {t('form.phone')}
            </label>
            {isEditing ? (
              <input
                type="tel"
                value={editForm.phoneNumber}
                onChange={(e) => setEditForm(prev => ({ ...prev, phoneNumber: e.target.value }))}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
              />
            ) : (
              <p className="text-gray-900 p-3 bg-gray-50 rounded-md">{club.phoneNumber}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Mail className="h-4 w-4 inline mr-1" />
              {t('form.email')}
            </label>
            {isEditing ? (
              <input
                type="email"
                value={editForm.contactEmail}
                onChange={(e) => setEditForm(prev => ({ ...prev, contactEmail: e.target.value }))}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
              />
            ) : (
              <p className="text-gray-900 p-3 bg-gray-50 rounded-md">{club.contactEmail}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Globe className="h-4 w-4 inline mr-1" />
              Sitio Web
            </label>
            {isEditing ? (
              <input
                type="url"
                value={editForm.website}
                onChange={(e) => setEditForm(prev => ({ ...prev, website: e.target.value }))}
                placeholder="www.ejemplo.com"
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
              />
            ) : (
              <p className="text-gray-900 p-3 bg-gray-50 rounded-md">
                {club.website || 'No especificado'}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Social Media */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Redes Sociales</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Instagram className="h-4 w-4 inline mr-1" />
              Instagram
            </label>
            {isEditing ? (
              <input
                type="text"
                value={editForm.socialMedia.instagram}
                onChange={(e) => setEditForm(prev => ({ 
                  ...prev, 
                  socialMedia: { ...prev.socialMedia, instagram: e.target.value }
                }))}
                placeholder="@usuario"
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
              />
            ) : (
              <p className="text-gray-900 p-3 bg-gray-50 rounded-md">
                {club.socialMedia?.instagram || 'No especificado'}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Facebook className="h-4 w-4 inline mr-1" />
              Facebook
            </label>
            {isEditing ? (
              <input
                type="text"
                value={editForm.socialMedia.facebook}
                onChange={(e) => setEditForm(prev => ({ 
                  ...prev, 
                  socialMedia: { ...prev.socialMedia, facebook: e.target.value }
                }))}
                placeholder="usuario"
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
              />
            ) : (
              <p className="text-gray-900 p-3 bg-gray-50 rounded-md">
                {club.socialMedia?.facebook || 'No especificado'}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Club Details */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Detalles del Club</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('club.capacity')}
            </label>
            {isEditing ? (
              <input
                type="number"
                value={editForm.capacity}
                onChange={(e) => setEditForm(prev => ({ ...prev, capacity: parseInt(e.target.value) }))}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
              />
            ) : (
              <p className="text-gray-900 p-3 bg-gray-50 rounded-md">{club.capacity} {t('club.people')}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rango de Precios
            </label>
            {isEditing ? (
              <select
                value={editForm.priceRange}
                onChange={(e) => setEditForm(prev => ({ ...prev, priceRange: e.target.value as '$' | '$$' | '$$$' }))}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
              >
                <option value="$">$ - Económico</option>
                <option value="$$">$$ - Moderado</option>
                <option value="$$$">$$$ - Premium</option>
              </select>
            ) : (
              <p className="text-gray-900 p-3 bg-gray-50 rounded-md">{club.priceRange}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Año de Fundación
            </label>
            <p className="text-gray-900 p-3 bg-gray-50 rounded-md">{club.foundedYear}</p>
          </div>
        </div>

        {/* Amenities */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            {t('club.services')}
          </label>
          {isEditing ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
              {AMENITIES.map(amenity => (
                <button
                  key={amenity}
                  type="button"
                  onClick={() => toggleAmenity(amenity)}
                  className={`p-2 text-sm rounded-md border transition-colors ${
                    editForm.amenities.includes(amenity)
                      ? 'bg-green-100 border-green-300 text-green-800'
                      : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {editForm.amenities.includes(amenity) && (
                    <Check className="h-3 w-3 inline mr-1" />
                  )}
                  {amenity}
                </button>
              ))}
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {club.amenities.map(amenity => (
                <Badge key={amenity} variant="outline">{amenity}</Badge>
              ))}
            </div>
          )}
        </div>

        {/* Vibe Tags */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            {t('club.atmosphere')}
          </label>
          {isEditing ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
              {VIBE_TAGS.map(vibe => (
                <button
                  key={vibe}
                  type="button"
                  onClick={() => toggleVibeTag(vibe)}
                  className={`p-2 text-sm rounded-md border transition-colors ${
                    editForm.vibeTags.includes(vibe)
                      ? 'bg-green-100 border-green-300 text-green-800'
                      : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {editForm.vibeTags.includes(vibe) && (
                    <Check className="h-3 w-3 inline mr-1" />
                  )}
                  {vibe}
                </button>
              ))}
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {club.vibeTags.map(vibe => (
                <Badge key={vibe} variant="secondary">{vibe}</Badge>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Opening Hours */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">{t('club.schedule')}</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {Object.entries(editForm.openingHours as Record<string, string>).map(([day, hours]) => (
            <div key={day} className="flex items-center justify-between">
              <span className="font-medium text-gray-700 capitalize w-24">
                {getDayName(day)}
              </span>
              {isEditing ? (
                <input
                  type="text"
                  value={hours}
                  onChange={(e) => setEditForm(prev => ({
                    ...prev,
                    openingHours: { ...prev.openingHours, [day]: e.target.value }
                  }))}
                  className="flex-1 ml-4 p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                  placeholder="16:00 - 00:00"
                />
              ) : (
                <span className="text-gray-600 flex-1 ml-4">{hours}</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Images Gallery */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Galería de Imágenes</h2>
          {isEditing && (
            <Button variant="outline" size="sm">
              <Upload className="h-4 w-4 mr-2" />
              Subir Imagen
            </Button>
          )}
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {club.images.map((image, index) => (
            <div key={index} className="relative group">
              <div className="relative h-32 rounded-lg overflow-hidden">
                <Image
                  src={image}
                  alt={`${club.name} - Imagen ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
              {isEditing && (
                <button className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                  <Trash2 className="h-3 w-3" />
                </button>
              )}
            </div>
          ))}
          
          {isEditing && (
            <div className="h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center hover:border-green-400 transition-colors cursor-pointer">
              <div className="text-center">
                <Plus className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <span className="text-sm text-gray-500">Añadir imagen</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}