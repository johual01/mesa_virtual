"use client"

import { ResetPassword } from "@/components/reset-password"
import { usePageTitle } from "@/hooks/usePageTitle"
import { Suspense } from "react"

export default function ResetPasswordPage() {
  // Establecer título dinámico de la página
  usePageTitle("Restablecer Contraseña");
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/50 p-4">
      <Suspense fallback={<div className="text-sm text-muted-foreground">Cargando...</div>}>
        <ResetPassword />
      </Suspense>
    </div>
  );
}
