"use client"

import { LoginForm } from "@/components/login-form"
import { usePageTitle } from "@/hooks/usePageTitle"
import Image from "next/image"

export default function LoginPage() {
  // Establecer título dinámico de la página
  usePageTitle("Iniciar Sesión");
  
  return (
    <div className="grow grid lg:grid-cols-2 h-100">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm />
          </div>
        </div>
      </div>
      <div className="relative hidden bg-muted lg:block">
        <Image
          src="/background_login.jpg"
          alt="Image"
          fill
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
          sizes="50vw"
        />
      </div>
    </div>
  )
}
