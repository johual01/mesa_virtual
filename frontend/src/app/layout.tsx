"use client"

import { ThemeProvider } from "@/components/theme-provider"
import "./globals.css";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { AuthProvider } from "@/context/auth";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
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
        </AuthProvider>
        
      </body>
    </html>
  );
}
