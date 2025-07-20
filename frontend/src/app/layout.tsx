"use client"

import { useEffect } from "react";
import { ThemeProvider } from "@/components/theme-provider"
import "./globals.css";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { AuthProvider } from "@/context/auth";
import { NotificationProvider } from "@/context/notifications";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  // Establecer el título de la aplicación
  useEffect(() => {
    document.title = "Mesa Virtual - Tu plataforma de rol de mesa";
    
    // Agregar meta description si no existe
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      metaDescription.setAttribute('content', 'Mesa Virtual es tu plataforma completa para gestionar campañas y personajes de rol de mesa. Crea, edita y administra tus aventuras de D&D 5E, Persona D20 y más.');
      document.head.appendChild(metaDescription);
    }

    // Agregar favicon si no existe
    let favicon = document.querySelector('link[rel="icon"]');
    if (!favicon) {
      favicon = document.createElement('link');
      favicon.setAttribute('rel', 'icon');
      favicon.setAttribute('href', '/favicon.ico');
      document.head.appendChild(favicon);
    }
  }, []);

  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="author" content="Mesa Virtual Team" />
        <meta name="keywords" content="rol de mesa, D&D, dungeons and dragons, persona d20, rpg, gestión de campañas, fichas de personaje" />
        <title>Mesa Virtual - Tu plataforma de rol de mesa</title>
      </head>
      <body>
        <AuthProvider>
          <NotificationProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", maxHeight: "100vh" }}>
                <Navbar />
                <main style={{ flex: 1, display: "flex", flexDirection: "column" }}>{children}</main>
                <Footer />
              </div>
            </ThemeProvider>
          </NotificationProvider>
        </AuthProvider>
        
      </body>
    </html>
  );
}
