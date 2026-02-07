'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Leaf, Building, Mail, Lock, MapPin, Phone, ArrowLeft, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '@/components/auth/AuthProvider';

interface FormData {
  clubName: string;
  email: string;
  password: string;
  address: string;
  phone: string;
  description: string;
}

export default function ClubSignupPage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    clubName: '',
    email: '',
    password: '',
    address: '',
    phone: '',
    description: '',
  });
  const { signUp } = useAuth();
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (step < 2) {
      // Basic validation for step 1
      if (!formData.clubName || !formData.email || !formData.password) {
        setError('Por favor, completa todos los campos');
        return;
      }
      if (formData.password.length < 8) {
        setError('La contraseña debe tener al menos 8 caracteres');
        return;
      }
      setStep(2);
    } else {
      setLoading(true);
      try {
        const { error: signUpError, needsEmailConfirmation } = await signUp(
          formData.email,
          formData.password,
          formData.clubName,
          {
            club_name: formData.clubName,
            club_address: formData.address,
            club_phone: formData.phone,
            club_description: formData.description,
          }
        );

        if (signUpError) {
          setError(signUpError.message);
          setLoading(false);
        } else if (needsEmailConfirmation) {
          setStep(3);
          setLoading(false);
        } else {
          router.push('/dashboard');
          router.refresh();
        }
      } catch (err) {
        setError('Ha ocurrido un error inesperado');
        console.error('Signup error:', err);
        setLoading(false);
      }
    }
  };

  if (step === 3) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center p-4">
        <Card className="p-8 max-w-md w-full text-center shadow-xl">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Registro Exitoso
          </h2>
          <p className="text-gray-600 mb-8">
            Tu club <strong>{formData.clubName}</strong> ha sido registrado exitosamente.
            Por favor, verifica tu correo electrónico para activar tu cuenta.
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
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <Link
          href={step === 1 ? "/club-panel" : "#"}
          onClick={(e) => {
            if (step > 1) {
              e.preventDefault();
              setStep(step - 1);
            }
          }}
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Volver</span>
        </Link>

        <Card className="p-8 shadow-xl">
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2 mb-4">
              <Leaf className="h-10 w-10 text-green-600" />
              <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                SocialClubsMaps
              </span>
            </Link>
            <h1 className="text-2xl font-bold text-gray-900 mt-4">
              Registrar Nuevo Club
            </h1>
            <p className="text-gray-600 mt-2">
              Paso {step} de 2
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {step === 1 && (
              <>
                <div>
                  <Label htmlFor="clubName" className="flex items-center gap-2 mb-2">
                    <Building className="h-4 w-4 text-gray-500" />
                    Nombre del Club
                  </Label>
                  <Input
                    id="clubName"
                    name="clubName"
                    type="text"
                    placeholder="Green Harmony CSC"
                    value={formData.clubName}
                    onChange={handleChange}
                    required
                    disabled={loading}
                  />
                </div>

                <div>
                  <Label htmlFor="email" className="flex items-center gap-2 mb-2">
                    <Mail className="h-4 w-4 text-gray-500" />
                    Email de Contacto
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="info@greenharmony.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    disabled={loading}
                  />
                </div>

                <div>
                  <Label htmlFor="password" className="flex items-center gap-2 mb-2">
                    <Lock className="h-4 w-4 text-gray-500" />
                    Contraseña
                  </Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Mínimo 8 caracteres"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    minLength={8}
                    disabled={loading}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Usa al menos 8 caracteres con una combinación de letras y números
                  </p>
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <div>
                  <Label htmlFor="address" className="flex items-center gap-2 mb-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    Dirección
                  </Label>
                  <Input
                    id="address"
                    name="address"
                    type="text"
                    placeholder="Calle Mayor 123, Madrid"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    disabled={loading}
                  />
                </div>

                <div>
                  <Label htmlFor="phone" className="flex items-center gap-2 mb-2">
                    <Phone className="h-4 w-4 text-gray-500" />
                    Teléfono
                  </Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="+34 600 123 456"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    disabled={loading}
                  />
                </div>

                <div>
                  <Label htmlFor="description" className="flex items-center gap-2 mb-2">
                    <Building className="h-4 w-4 text-gray-500" />
                    Descripción
                  </Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Describe tu club..."
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    required
                    disabled={loading}
                  />
                </div>
              </>
            )}

            <Button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Registrando...
                </>
              ) : step === 2 ? (
                'Registrar Club'
              ) : (
                'Siguiente'
              )}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-600">
            ¿Ya tienes una cuenta?{' '}
            <Link href="/club-panel/login" className="text-green-600 hover:text-green-700 font-medium">
              Inicia sesión
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
