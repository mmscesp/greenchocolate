'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Leaf, Building, Mail, Lock, MapPin, Phone, ArrowLeft, CheckCircle } from 'lucide-react';

export default function ClubSignupPage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    clubName: '',
    email: '',
    password: '',
    address: '',
    phone: '',
    description: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 2) {
      setStep(2);
    } else {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        setStep(3);
      }, 1500);
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
                  />
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
                  />
                </div>
              </>
            )}

            <Button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white"
              disabled={loading}
            >
              {loading ? 'Registrando...' : step === 2 ? 'Registrar Club' : 'Siguiente'}
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
