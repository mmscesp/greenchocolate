'use client';

export const dynamic = 'force-dynamic';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/hooks/useLanguage';
import { 
  Bell, 
  Shield, 
  Eye, 
  Globe, 
  Smartphone, 
  Mail, 
  Lock,
  Trash2,
  Download,
  AlertTriangle,
  Check,
  X
} from 'lucide-react';

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
    alert('Configuración guardada correctamente');
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
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t('user.settings')}</h1>
          <p className="text-gray-600 mt-2">
            Gestiona tu privacidad, notificaciones y configuración de seguridad
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
          Guardar Cambios
        </Button>
      </div>

      {/* Notifications */}
      <div className="bg-white rounded-2xl p-8 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <Bell className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Notificaciones</h2>
            <p className="text-gray-600">Controla cómo y cuándo recibes notificaciones</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-900">Notificaciones por Email</h3>
              <p className="text-sm text-gray-600">Recibe actualizaciones importantes por correo</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.notifications.email}
                onChange={(e) => updateNotificationSetting('email', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-900">Notificaciones Push</h3>
              <p className="text-sm text-gray-600">Recibe notificaciones en tiempo real</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.notifications.push}
                onChange={(e) => updateNotificationSetting('push', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-900">Actualizaciones de Clubs</h3>
              <p className="text-sm text-gray-600">Nuevos eventos y noticias de tus clubs favoritos</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.notifications.clubUpdates}
                onChange={(e) => updateNotificationSetting('clubUpdates', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-900">Nuevas Reseñas</h3>
              <p className="text-sm text-gray-600">Cuando alguien responde a tus reseñas</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.notifications.newReviews}
                onChange={(e) => updateNotificationSetting('newReviews', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-900">Marketing y Promociones</h3>
              <p className="text-sm text-gray-600">Ofertas especiales y contenido promocional</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.notifications.marketing}
                onChange={(e) => updateNotificationSetting('marketing', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Privacy */}
      <div className="bg-white rounded-2xl p-8 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
            <Eye className="h-5 w-5 text-purple-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Privacidad</h2>
            <p className="text-gray-600">Controla quién puede ver tu información</p>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="font-medium text-gray-900 mb-3">Visibilidad del Perfil</h3>
            <div className="space-y-2">
              {[
                { value: 'public', label: 'Público', desc: 'Cualquiera puede ver tu perfil' },
                { value: 'friends', label: 'Solo Amigos', desc: 'Solo tus conexiones pueden ver tu perfil' },
                { value: 'private', label: 'Privado', desc: 'Solo tú puedes ver tu perfil' }
              ].map(option => (
                <label key={option.value} className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="profileVisibility"
                    value={option.value}
                    checked={settings.privacy.profileVisibility === option.value}
                    onChange={(e) => updatePrivacySetting('profileVisibility', e.target.value)}
                    className="w-4 h-4 text-green-600 focus:ring-green-500"
                  />
                  <div>
                    <div className="font-medium text-gray-900">{option.label}</div>
                    <div className="text-sm text-gray-600">{option.desc}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900">Mostrar Email</h3>
                <p className="text-sm text-gray-600">Permite que otros vean tu dirección de email</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.privacy.showEmail}
                  onChange={(e) => updatePrivacySetting('showEmail', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900">Mostrar Ubicación</h3>
                <p className="text-sm text-gray-600">Permite que otros vean tu ciudad</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.privacy.showLocation}
                  onChange={(e) => updatePrivacySetting('showLocation', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900">Permitir Mensajes</h3>
                <p className="text-sm text-gray-600">Otros usuarios pueden enviarte mensajes</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.privacy.allowMessages}
                  onChange={(e) => updatePrivacySetting('allowMessages', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Security */}
      <div className="bg-white rounded-2xl p-8 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
            <Shield className="h-5 w-5 text-red-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Seguridad</h2>
            <p className="text-gray-600">Protege tu cuenta con configuraciones de seguridad</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-900">Autenticación de Dos Factores</h3>
              <p className="text-sm text-gray-600">Añade una capa extra de seguridad a tu cuenta</p>
            </div>
            <div className="flex items-center gap-3">
              {settings.security.twoFactor ? (
                <Badge variant="success" className="flex items-center gap-1">
                  <Check className="h-3 w-3" />
                  Activado
                </Badge>
              ) : (
                <Badge variant="outline" className="flex items-center gap-1">
                  <X className="h-3 w-3" />
                  Desactivado
                </Badge>
              )}
              <Button
                variant={settings.security.twoFactor ? "outline" : "cannabis"}
                size="sm"
                onClick={() => updateSecuritySetting('twoFactor', !settings.security.twoFactor)}
              >
                {settings.security.twoFactor ? 'Desactivar' : 'Activar'}
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-900">Alertas de Inicio de Sesión</h3>
              <p className="text-sm text-gray-600">Recibe notificaciones de nuevos inicios de sesión</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.security.loginAlerts}
                onChange={(e) => updateSecuritySetting('loginAlerts', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
            </label>
          </div>

          <div>
            <h3 className="font-medium text-gray-900 mb-3">Tiempo de Sesión</h3>
            <select
              value={settings.security.sessionTimeout}
              onChange={(e) => updateSecuritySetting('sessionTimeout', Number(e.target.value))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
            >
              <option value={15}>15 minutos</option>
              <option value={30}>30 minutos</option>
              <option value={60}>1 hora</option>
              <option value={120}>2 horas</option>
              <option value={0}>Sin límite</option>
            </select>
          </div>

          <div className="pt-4 border-t">
            <Button variant="outline" className="flex items-center gap-2">
              <Lock className="h-4 w-4" />
              Cambiar Contraseña
            </Button>
          </div>
        </div>
      </div>

      {/* Data Management */}
      <div className="bg-white rounded-2xl p-8 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
            <Download className="h-5 w-5 text-gray-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Gestión de Datos</h2>
            <p className="text-gray-600">Controla tus datos personales</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <h3 className="font-medium text-gray-900">Descargar mis Datos</h3>
              <p className="text-sm text-gray-600">Obtén una copia de toda tu información</p>
            </div>
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Descargar
            </Button>
          </div>

          <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg bg-red-50">
            <div>
              <h3 className="font-medium text-red-900">Eliminar Cuenta</h3>
              <p className="text-sm text-red-600">Esta acción no se puede deshacer</p>
            </div>
            <Button variant="destructive" className="flex items-center gap-2">
              <Trash2 className="h-4 w-4" />
              Eliminar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}