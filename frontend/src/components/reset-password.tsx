"use client"

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter, useSearchParams } from 'next/navigation';

interface ResetPasswordProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export function ResetPassword({ onSuccess, onError }: ResetPasswordProps) {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [token, setToken] = useState('');
  
  const router = useRouter();
  const searchParams = useSearchParams();
  useEffect(() => {
    const tokenFromUrl = searchParams?.get('token');
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
    } else {
      setMessage('Token de recuperación no válido o expirado');
      onError?.('Token no válido');
    }
  }, [searchParams, onError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setMessage('Las contraseñas no coinciden');
      return;
    }

    if (password.length < 6) {
      setMessage('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setIsLoading(true);
    setMessage('');

    try {
      const response = await fetch(process.env.NEXT_PUBLIC_URL_API + '/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ 
          password 
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.errMsg || 'Error al actualizar la contraseña');
      }

      setMessage(data.message || 'Contraseña actualizada correctamente');
      setIsSuccess(true);
      onSuccess?.();
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        router.push('/login');
      }, 3000);

    } catch (error) {
      console.error('Error al restablecer contraseña:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error al actualizar la contraseña';
      setMessage(errorMessage);
      onError?.(errorMessage);
      setIsSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="max-w-md mx-auto p-6 bg-background rounded-lg shadow-lg">
        <div className="text-center">
          <h2 className="text-xl font-bold text-destructive mb-2">Token inválido</h2>
          <p className="text-muted-foreground mb-4">
            El enlace de recuperación no es válido o ha expirado.
          </p>
          <Button onClick={() => router.push('/login')} variant="outline">
            Volver al inicio de sesión
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-background rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4 text-center">Restablecer Contraseña</h2>
      
      {!isSuccess ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="new-password">Nueva contraseña</Label>
            <Input
              id="new-password"
              type="password"
              placeholder="Ingresa tu nueva contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirmar contraseña</Label>
            <Input
              id="confirm-password"
              type="password"
              placeholder="Confirma tu nueva contraseña"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={6}
              disabled={isLoading}
            />
          </div>

          {message && !isSuccess && (
            <div className="text-sm p-3 rounded bg-destructive/10 text-destructive">
              {message}
            </div>
          )}

          <div className="space-y-2">
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading || !password || !confirmPassword}
            >
              {isLoading ? 'Actualizando...' : 'Actualizar contraseña'}
            </Button>
            
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => router.push('/login')}
              disabled={isLoading}
            >
              Cancelar
            </Button>
          </div>
        </form>
      ) : (
        <div className="text-center space-y-4">
          <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto">
            <svg
              className="w-6 h-6 text-green-600 dark:text-green-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold">¡Contraseña actualizada!</h3>
          <p className="text-sm text-muted-foreground">{message}</p>
          <p className="text-sm text-muted-foreground">
            Serás redirigido al inicio de sesión en unos segundos...
          </p>
        </div>
      )}
    </div>
  );
}
