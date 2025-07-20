"use client"

import { RegisterForm } from "@/components/register-form"
import { usePageTitle } from "@/hooks/usePageTitle"

export default function RegisterPage() {
  // Establecer título dinámico de la página
  usePageTitle("Registrarse");
  
  return (
    <div className="grow grid lg:grid-cols-2 h-100">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <RegisterForm />
          </div>
        </div>
      </div>
      <div className="relative hidden bg-muted lg:block">
        <img
          src="/background_login.jpg"
          alt="Mesa Virtual - Registro"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  )
}
