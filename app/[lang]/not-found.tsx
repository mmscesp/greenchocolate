'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Search, Home, ArrowLeft } from '@/lib/icons';
import { useRouter } from 'next/navigation';

/**
 * Global 404 Not Found Page
 * Displayed when a route doesn't exist
 * Phase 2: Safety & Stability
 */
export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 pt-16 md:pt-20">
      <div className="max-w-lg w-full bg-white rounded-xl shadow-lg p-8 text-center">
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Search className="h-12 w-12 text-green-600" />
        </div>

        <h1 className="text-6xl font-bold text-gray-900 mb-2">404</h1>

        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Página no encontrada
        </h2>

        <p className="text-gray-600 mb-8">
          Lo sentimos, la página que estás buscando no existe o ha sido movida.
          Por favor, verifica la URL o vuelve a la página principal.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/" passHref>
            <Button className="bg-green-600 hover:bg-green-700">
              <Home className="h-4 w-4 mr-2" />
              Volver al inicio
            </Button>
          </Link>

          <Button
            variant="outline"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver atrás
          </Button>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            ¿Necesitas ayuda?{' '}
            <Link
              href="/contacto"
              className="text-green-600 hover:text-green-700 font-medium"
            >
              Contáctanos
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
