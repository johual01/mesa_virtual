"use client"

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultEmail?: string;
}

export function ForgotPasswordModal({ isOpen, onClose, defaultEmail = '' }: ForgotPasswordModalProps) {
  const [email, setEmail] = useState(defaultEmail);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setEmail(defaultEmail);
      setMessage('');
      setIsSuccess(false);
    }
  }, [isOpen, defaultEmail]);

  const handleClose = () => {
    setEmail('');
    setMessage('');
    setIsSuccess(false);
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      const response = await fetch(process.env.NEXT_PUBLIC_URL_API + '/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.errMsg || 'Error al enviar el correo de recuperación');
      }

      setMessage(data.message || 'Se ha enviado un correo para recuperar la contraseña');
      setIsSuccess(true);
      setEmail('');
      
      // Auto close after 3 seconds on success
      setTimeout(() => {
        handleClose();
      }, 3000);

    } catch (error) {
      console.error('Error al recuperar contraseña:', error);
      setMessage(error instanceof Error ? error.message : 'Error al enviar el correo de recuperación');
      setIsSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-background p-6 rounded-lg shadow-lg w-full max-w-md mx-4 border">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Recuperar Contraseña</h2>
          <button
            onClick={handleClose}
            className="text-muted-foreground hover:text-foreground text-xl leading-none"
            aria-label="Cerrar"
          >
            ×
          </button>
        </div>

        {!isSuccess ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="forgot-email">Correo electrónico</Label>
              <Input
                id="forgot-email"
                type="email"
                placeholder="correo@ejemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
              <p className="text-sm text-muted-foreground">
                Te enviaremos un enlace para restablecer tu contraseña.
              </p>
            </div>

            {message && !isSuccess && (
              <div className="text-sm p-3 rounded-md bg-red-500/15 text-red-400 border border-red-500/30">
                {message}
              </div>
            )}

            <div className="flex gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={handleClose}
                disabled={isLoading}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="flex-1"
                disabled={isLoading || !email.trim()}
              >
                {isLoading ? 'Enviando...' : 'Enviar enlace'}
              </Button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="text-center py-4">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-3">
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
              <h3 className="text-lg font-semibold mb-2">¡Correo enviado!</h3>
              <p className="text-sm text-muted-foreground">{message}</p>
            </div>
            
            <Button
              onClick={handleClose}
              className="w-full"
            >
              Entendido
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
