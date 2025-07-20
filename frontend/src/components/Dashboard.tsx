"use client"

import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth";
import { usePageTitle } from "@/hooks/usePageTitle";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, BookOpen, Plus } from "lucide-react";
import { ProtectedRoute } from "@/components/ProtectedRoute";

function DashboardContent() {
  const { user } = useAuth();
  const router = useRouter();
  
  // Establecer título dinámico de la página
  usePageTitle("Dashboard");

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Bienvenido, {user?.user}
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Gestiona tus campañas y personajes desde tu mesa virtual
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Card de Campañas */}
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Campañas</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Mis Campañas</div>
            <p className="text-xs text-muted-foreground">
              Gestiona y participa en campañas
            </p>
            <div className="mt-4 space-y-2">
              <Button 
                className="w-full" 
                onClick={() => router.push('/campaigns')}
              >
                Ver Campañas
              </Button>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => router.push('/campaigns/create')}
              >
                <Plus className="h-4 w-4 mr-2" />
                Nueva Campaña
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Card de Personajes */}
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Personajes</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Mis Fichas</div>
            <p className="text-xs text-muted-foreground">
              Crea y edita tus personajes
            </p>
            <div className="mt-4 space-y-2">
              <Button 
                className="w-full"
                onClick={() => router.push('/characters')}
              >
                Ver Personajes
              </Button>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => router.push('/characters/create')}
              >
                <Plus className="h-4 w-4 mr-2" />
                Nuevo Personaje
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Card de Accesos Rápidos */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="text-sm font-medium">Accesos Rápidos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button 
              variant="ghost" 
              className="w-full justify-start"
              onClick={() => router.push('/campaigns')}
            >
              📋 Mis Campañas Activas
            </Button>
            <Button 
              variant="ghost" 
              className="w-full justify-start"
              onClick={() => router.push('/characters')}
            >
              ⚔️ Personajes Activos
            </Button>
            <Button 
              variant="ghost" 
              className="w-full justify-start"
              onClick={() => router.push('/profile')}
            >
              👤 Mi Perfil
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Sección de actividad reciente (opcional) */}
      <Card>
        <CardHeader>
          <CardTitle>Actividad Reciente</CardTitle>
          <CardDescription>
            Últimas actualizaciones en tus campañas y personajes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No hay actividad reciente</p>
            <p className="text-sm">Empieza creando una campaña o personaje</p>
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
