'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Leaf, Lock, ArrowLeft, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { useAuth } from '@/components/auth/AuthProvider';

function ResetPasswordForm() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isValidating, setIsValidating] = useState(true);
  const { updatePassword, session } = useAuth();

  useEffect(() => {
    const checkSession = async () => {
      if (!session) {
        const hash = window.location.hash;
        if (hash && hash.includes('access_token')) {
          setIsValidating(false);
        } else {
          setError('Sesión inválida. Por favor, solicita un nuevo enlace de restauración.');
        }
      } else {
        setIsValidating(false);
      }
    };

    checkSession();
  }, [session]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres');
      return;
    }

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    setLoading(true);

    try {
      const { error } = await updatePassword(password);

      if (error) {
        setError(error.message);
      } else {
        setSuccess(true);
      }
    } catch (err) {
      setError('Ha ocurrido un error inesperado');
      console.error('Update password error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (isValidating) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 text-green-600 animate-spin" />
      </div>
    );
  }

  if (success) {
    return (
      <div className="w-full max-w-md mx-auto">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="h-10 w-10 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">
          Contraseña Actualizada
        </h2>
        <p className="text-gray-600 mb-8 text-center">
          Tu contraseña ha sido restaurada exitosamente.
          Ya puedes iniciar sesión con tu nueva contraseña.
        </p>
        <div className="space-y-3">
          <Link href="/club-panel/login" className="block">
            <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
              Ir a Iniciar Sesión
            </Button>
          </Link>
          <Link href="/" className="block">
            <Button variant="outline" className="w-full">
              Volver al Inicio
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md">
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label htmlFor="password" className="flex items-center gap-2 mb-2">
            <Lock className="h-4 w-4 text-gray-500" />
            Nueva Contraseña
          </Label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full"
            required
            disabled={loading}
            minLength={8}
          />
          <p className="text-xs text-gray-500 mt-1">Mínimo 8 caracteres</p>
        </div>

        <div>
          <Label htmlFor="confirmPassword" className="flex items-center gap-2 mb-2">
            <Lock className="h-4 w-4 text-gray-500" />
            Confirmar Contraseña
          </Label>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full"
            required
            disabled={loading}
          />
        </div>

        <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />Actualizando...
            </>
          ) : (
            'Actualizar Contraseña'
          )}
        </Button>
      </form>
    </div>
  );
}

function ResetPasswordLoading() {
  return (
    <div className="flex items-center justify-center py-12">
      <Loader2 className="h-8 w-8 text-green-600 animate-spin" />
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Link href="/club-panel/login" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors">
          <ArrowLeft className="h-4 w-4" />
          <span>Volver</span>
        </Link>

        <Card className="p-8 shadow-xl border-2">
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2 mb-4">
              <Leaf className="h-10 w-10 text-green-600" />
              <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                SocialClubsMaps
              </span>
            </Link>
            <h1 className="text-2xl font-bold text-gray-900 mt-4">Restablecer Contraseña</h1>
            <p className="text-gray-600 mt-2">Introduce tu nueva contraseña a continuación.</p>
          </div>

          <Suspense fallback={<ResetPasswordLoading />}>
            <ResetPasswordForm />
          </Suspense>
        </Card>
      </div>
    </div>
  );
}
