'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Leaf, LogIn, UserPlus, Shield } from 'lucide-react';

export default function ClubPanelChooser() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
      <nav className="bg-white/95 backdrop-blur-md shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <Leaf className="h-8 w-8 text-green-600" />
              <span className="text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                SocialClubsMaps
              </span>
            </Link>
            <div className="flex items-center">
              <Link href="/">
                <Button variant="ghost">Volver al inicio</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-800 rounded-full mb-6">
            <Shield className="h-4 w-4" />
            <span className="text-sm font-medium">Panel de Gestión para Clubs</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Bienvenido al Panel Club
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Gestiona tu club social de cannabis, recibe solicitudes y conecta con tu comunidad
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Card className="p-8 hover:shadow-xl transition-all duration-300 border-2 hover:border-green-200 cursor-pointer group">
            <Link href="/club-panel/login">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6 group-hover:scale-110 transition-transform">
                  <LogIn className="h-8 w-8 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Iniciar Sesión
                </h2>
                <p className="text-gray-600 mb-6">
                  ¿Ya tienes un club registrado? Accede a tu panel de control
                </p>
                <div className="flex items-center justify-center gap-2 text-green-600 font-medium group-hover:gap-3 transition-all">
                  <span>Acceder</span>
                  <LogIn className="h-4 w-4" />
                </div>
              </div>
            </Link>
          </Card>

          <Card className="p-8 hover:shadow-xl transition-all duration-300 border-2 hover:border-green-200 cursor-pointer group">
            <Link href="/club-panel/signup">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-full mb-6 group-hover:scale-110 transition-transform">
                  <UserPlus className="h-8 w-8 text-emerald-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Registrar Club
                </h2>
                <p className="text-gray-600 mb-6">
                  ¿Nuevo aquí? Registra tu club y empieza a gestionar tu comunidad
                </p>
                <div className="flex items-center justify-center gap-2 text-emerald-600 font-medium group-hover:gap-3 transition-all">
                  <span>Registrarse</span>
                  <UserPlus className="h-4 w-4" />
                </div>
              </div>
            </Link>
          </Card>
        </div>
      </div>
    </div>
  );
}
