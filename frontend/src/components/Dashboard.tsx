"use client"

import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth";
import { usePageTitle } from "@/hooks/usePageTitle";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  Users, 
  BookOpen, 
  Plus, 
  Swords, 
  Shield, 
  ArrowRight,
  User
} from "lucide-react";
import { ProtectedRoute } from "@/components/ProtectedRoute";

function DashboardContent() {
  const { user } = useAuth();
  const router = useRouter();
  
  usePageTitle("Dashboard");

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          ¡Bienvenido, {user?.user}!
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Tu aventura te espera. Gestiona tus campañas y personajes.
        </p>
      </div>

      {/* Main Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Card de Campañas */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Swords className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle>Campañas</CardTitle>
                  <CardDescription>
                    Lidera o únete a aventuras épicas
                  </CardDescription>
                </div>
              </div>
              <Users className="h-5 w-5 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Crea mundos únicos, invita a tus amigos y vive historias inolvidables como Game Master o jugador.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button 
                className="flex-1"
                onClick={() => router.push('/campaigns')}
              >
                Ver Campañas
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => router.push('/campaigns/create')}
              >
                <Plus className="h-4 w-4 mr-2" />
                Nueva Campaña
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Card de Personajes */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Shield className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle>Personajes</CardTitle>
                  <CardDescription>
                    Dale vida a tus héroes y villanos
                  </CardDescription>
                </div>
              </div>
              <BookOpen className="h-5 w-5 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Crea fichas detalladas con estadísticas, habilidades, inventario y toda la historia de tus personajes.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button 
                className="flex-1"
                onClick={() => router.push('/characters')}
              >
                Ver Personajes
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => router.push('/characters/create')}
              >
                <Plus className="h-4 w-4 mr-2" />
                Nuevo Personaje
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Accesos Rápidos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Button 
              variant="outline" 
              className="h-auto p-4 flex flex-col items-center gap-3"
              onClick={() => router.push('/campaigns')}
            >
              <Swords className="h-6 w-6" />
              <div className="text-center">
                <p className="font-medium">Mis Campañas</p>
                <p className="text-xs text-muted-foreground">Ver todas tus campañas</p>
              </div>
            </Button>
            <Button 
              variant="outline" 
              className="h-auto p-4 flex flex-col items-center gap-3"
              onClick={() => router.push('/characters')}
            >
              <Shield className="h-6 w-6" />
              <div className="text-center">
                <p className="font-medium">Mis Personajes</p>
                <p className="text-xs text-muted-foreground">Gestionar fichas de personajes</p>
              </div>
            </Button>
            <Button 
              variant="outline" 
              className="h-auto p-4 flex flex-col items-center gap-3"
              onClick={() => router.push('/profile')}
            >
              <User className="h-6 w-6" />
              <div className="text-center">
                <p className="font-medium">Mi Perfil</p>
                <p className="text-xs text-muted-foreground">Configurar tu cuenta</p>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function Dashboard() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}
