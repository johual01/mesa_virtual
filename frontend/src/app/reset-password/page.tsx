"use client"

import { ResetPassword } from "@/components/reset-password"
import { usePageTitle } from "@/hooks/usePageTitle"

export default function ResetPasswordPage() {
  // Establecer título dinámico de la página
  usePageTitle("Restablecer Contraseña");
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/50 p-4">
      <ResetPassword />
    </div>
  );
}
