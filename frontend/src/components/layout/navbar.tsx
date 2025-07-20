"use client";

import { Button } from "@/components/ui/button";
import { Logo } from "./logo";
import { NavMenu } from "./nav-menu";
import { NavigationSheet } from "./navigation-sheet";
import { ModeToggle } from "./mode-toggle";
import { useAuth } from "@/context/auth";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const { user, logout } = useAuth();
  const router = useRouter();

  return (
    <div className="bg-muted">
      <nav className="h-16 bg-background border-b">
        <div className="h-full flex items-center justify-between max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-8">
            <Logo />
            {user && <NavMenu className="hidden md:block" />}
          </div>

          <div className="flex items-center gap-3">
            {user ? (
              <>
                <span className="hidden sm:inline-flex text-sm text-muted-foreground">
                  Hola, {user.user}
                </span>
                <Button 
                  variant="outline" 
                  className="hidden sm:inline-flex"
                  onClick={() => router.push('/profile')}
                >
                  Perfil
                </Button>
                <Button onClick={logout}>Cerrar Sesión</Button>
              </>
            ) : (
              <>
                <Button 
                  variant="outline" 
                  className="hidden sm:inline-flex"
                  onClick={() => router.push('/login')}
                >
                  Ingresar
                </Button>
                <Button onClick={() => router.push('/register')}>
                  Registrarse
                </Button>
              </>
            )}
            <ModeToggle />
            {/* Mobile Menu */}
            {user && (
              <div className="md:hidden">
                <NavigationSheet />
              </div>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
