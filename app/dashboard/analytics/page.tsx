'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/hooks/useLanguage';
import { 
  BarChart3, 
  Users, 
  TrendingUp, 
  Calendar,
  Eye,
  UserPlus,
  Star,
  MapPin
} from 'lucide-react';

export default function AnalyticsPage() {
  const { t } = useLanguage();
  const [timeRange, setTimeRange] = useState('30d');

  // Mock analytics data
  const stats = {
    totalViews: 1247,
    newMembers: 23,
    averageRating: 4.8,
    totalRequests: 45
  };

  const monthlyData = [
    { month: 'Ene', views: 890, requests: 12 },
    { month: 'Feb', views: 1020, requests: 15 },
    { month: 'Mar', views: 1150, requests: 18 },
    { month: 'Abr', views: 1247, requests: 23 },
  ];

  const topSources = [
    { source: 'Búsqueda directa', percentage: 45, visits: 561 },
    { source: 'Redes sociales', percentage: 28, visits: 349 },
    { source: 'Referencias', percentage: 18, visits: 224 },
    { source: 'Otros', percentage: 9, visits: 113 }
  ];

  const recentActivity = [
    { type: 'view', message: 'Nueva visita al perfil', time: '2 min ago' },
    { type: 'request', message: 'Nueva solicitud de membresía', time: '15 min ago' },
    { type: 'view', message: 'Perfil visto desde Malasaña', time: '1 hora ago' },
    { type: 'request', message: 'Solicitud aprobada', time: '2 horas ago' },
    { type: 'view', message: 'Nueva visita al perfil', time: '3 horas ago' }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t('dashboard.analytics')}</h1>
          <p className="text-gray-600 mt-2">
            Analiza el rendimiento y la actividad de tu club
          </p>
        </div>
        
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
        >
          <option value="7d">Últimos 7 días</option>
          <option value="30d">Últimos 30 días</option>
          <option value="90d">Últimos 90 días</option>
          <option value="1y">Último año</option>
        </select>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Visualizaciones</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalViews.toLocaleString()}</p>
              <p className="text-sm text-green-600 flex items-center mt-1">
                <TrendingUp className="h-3 w-3 mr-1" />
                +12% vs mes anterior
              </p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <Eye className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Nuevos Miembros</p>
              <p className="text-2xl font-bold text-gray-900">{stats.newMembers}</p>
              <p className="text-sm text-green-600 flex items-center mt-1">
                <TrendingUp className="h-3 w-3 mr-1" />
                +28% vs mes anterior
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <UserPlus className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Valoración Media</p>
              <p className="text-2xl font-bold text-gray-900">{stats.averageRating}</p>
              <p className="text-sm text-gray-500 flex items-center mt-1">
                <Star className="h-3 w-3 mr-1 fill-yellow-400 text-yellow-400" />
                Basado en 142 reseñas
              </p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-full">
              <Star className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Solicitudes</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalRequests}</p>
              <p className="text-sm text-orange-600 flex items-center mt-1">
                <Calendar className="h-3 w-3 mr-1" />
                5 pendientes
              </p>
            </div>
            <div className="bg-orange-100 p-3 rounded-full">
              <Users className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Monthly Trends */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Tendencias Mensuales</h3>
            <BarChart3 className="h-5 w-5 text-gray-400" />
          </div>
          
          <div className="space-y-4">
            {monthlyData.map((data, index) => (
              <div key={data.month} className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700 w-12">{data.month}</span>
                <div className="flex-1 mx-4">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(data.views / 1300) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-500 w-12">{data.views}</span>
                  </div>
                </div>
                <Badge variant="outline" className="text-xs">
                  {data.requests} req
                </Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Traffic Sources */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Fuentes de Tráfico</h3>
            <MapPin className="h-5 w-5 text-gray-400" />
          </div>
          
          <div className="space-y-4">
            {topSources.map((source, index) => (
              <div key={source.source} className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">{source.source}</span>
                    <span className="text-sm text-gray-500">{source.percentage}%</span>
                  </div>
                  <div className="bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${source.percentage}%` }}
                    />
                  </div>
                </div>
                <span className="text-xs text-gray-500 ml-4 w-16 text-right">
                  {source.visits} visitas
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Actividad Reciente</h3>
        
        <div className="space-y-4">
          {recentActivity.map((activity, index) => (
            <div key={index} className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
              <div className={`p-2 rounded-full ${
                activity.type === 'view' ? 'bg-blue-100' : 'bg-green-100'
              }`}>
                {activity.type === 'view' ? (
                  <Eye className={`h-4 w-4 ${activity.type === 'view' ? 'text-blue-600' : 'text-green-600'}`} />
                ) : (
                  <UserPlus className="h-4 w-4 text-green-600" />
                )}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                <p className="text-xs text-gray-500">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Performance Insights */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Insights de Rendimiento</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <span className="font-medium text-green-800">Crecimiento Positivo</span>
            </div>
            <p className="text-sm text-green-700">
              Tu club ha experimentado un crecimiento del 28% en nuevos miembros este mes. 
              ¡Excelente trabajo manteniendo la calidad del servicio!
            </p>
          </div>
          
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center gap-2 mb-2">
              <Eye className="h-5 w-5 text-blue-600" />
              <span className="font-medium text-blue-800">Alta Visibilidad</span>
            </div>
            <p className="text-sm text-blue-700">
              Tu perfil está siendo muy visitado. Considera actualizar las fotos y 
              la descripción para mantener el interés de los visitantes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}