"use client"

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { Logo } from "./logo";
import { NavMenu } from "./nav-menu";
import { useAuth } from "@/context/auth";
import { useRouter } from "next/navigation";

export const NavigationSheet = () => {
  const { logout } = useAuth();
  const router = useRouter();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon">
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[300px] sm:w-[360px]">
        <Logo />
        <NavMenu orientation="vertical" className="mt-10" />
        <div className="mt-8 space-y-2 border-t pt-6">
          <Button variant="outline" className="w-full" onClick={() => router.push('/profile')}>
            Perfil
          </Button>
          <Button className="w-full" onClick={logout}>
            Cerrar Sesión
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};
