"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import React, { useState } from 'react';
import { useAuth } from '@/context/auth';

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"form">) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password, rememberMe);
      // Redirigir al usuario a la página principal o a otra página
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
    }
  };

  return (
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
          <Input id="email" type="email" placeholder="m@example.com" required value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="grid gap-2">
          <div className="flex items-center">
            <Label htmlFor="password">Contraseña</Label>
            <a
              href="#"
              className="ml-auto text-sm underline-offset-4 hover:underline"
            >
              Olvidaste tu contraseña?
            </a>
          </div>
          <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
          />
          <Label className="ml-2">Recordarme</Label>
        </div>
        <Button type="submit" className="w-full">
          Ingresar
        </Button>
      </div>
      <div className="text-center text-sm">
        No tienes una cuenta?{" "}
        <a href="#" className="underline underline-offset-4">
          Registrarse
        </a>
      </div>
    </form>
  )
}
