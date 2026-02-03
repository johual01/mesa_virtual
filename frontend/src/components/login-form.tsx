"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useRouter } from "next/navigation"
import React, { useState } from 'react';
import { useAuth } from '@/context/auth';
import { useNotificationContext } from '@/context/notifications';
import { ForgotPasswordModal } from '@/components/forgot-password-modal';
import { Loader2 } from "lucide-react"

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"form">) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const { error: notifyError } = useNotificationContext();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await login(email, password, rememberMe);
      router.push('/');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error al iniciar sesión';
      notifyError('Error de autenticación', message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPasswordClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowForgotPassword(true);
  };

  return (
    <>
      <form className={cn("flex flex-col gap-6", className)} {...props} onSubmit={handleSubmit}>
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold">Ingresa a tu cuenta</h1>
          <div className="text-balance text-sm text-muted-foreground">
            Ingresa con tu correo y contraseña
          </div>
        </div>
        
        <div className="grid gap-6">
          <div className="grid gap-2">
            <Label htmlFor="email">Correo</Label>
            <Input 
              id="email" 
              type="email" 
              placeholder="m@example.com" 
              required 
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <div className="grid gap-2">
            <div className="flex items-center">
              <Label htmlFor="password">Contraseña</Label>
              <a
                href="#"
                onClick={handleForgotPasswordClick}
                className="ml-auto text-sm underline-offset-4 hover:underline cursor-pointer"
              >
                Olvidaste tu contraseña?
              </a>
            </div>
            <Input 
              id="password" 
              type="password" 
              required 
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <div className="flex items-center space-x-2">
            <div className="relative">
              <input
                id="remember"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                disabled={isLoading}
                className="peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground cursor-pointer"
              />
              {rememberMe && (
                <svg
                  className="absolute left-0 top-0 h-4 w-4 text-primary-foreground pointer-events-none"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                >
                  <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425a.247.247 0 0 1 .02-.022Z" />
                </svg>
              )}
            </div>
            <Label htmlFor="remember" className="text-sm font-medium leading-none cursor-pointer">
              Recordarme
            </Label>
          </div>
          <Button 
            type="submit" 
            className="w-full cursor-pointer hover:bg-primary/90 transition-colors"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Ingresando...
              </>
            ) : (
              'Ingresar'
            )}
          </Button>
        </div>
        <div className="text-center text-sm">
          No tienes una cuenta?{" "}
          <Link href="/register" className="underline underline-offset-4">
            Registrarse
          </Link>
        </div>
      </form>
      
      {/* ForgotPassword modal outside the form to avoid nested forms */}
      <ForgotPasswordModal 
        isOpen={showForgotPassword}
        defaultEmail={email}
        onClose={() => setShowForgotPassword(false)}
      />
    </>
  )
}
