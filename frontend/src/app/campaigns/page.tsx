"use client"

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { usePageTitle } from "@/hooks/usePageTitle";
import { useCampaigns } from "@/hooks/useCampaigns";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Users, Eye, Settings, Loader2 } from "lucide-react";
import Image from "next/image";

export default function CampaignsPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const { campaigns, loading, error, refetch } = useCampaigns();
  
  // Establecer título dinámico de la página
  usePageTitle("Mis Campañas");

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  if (authLoading || !user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-muted-foreground">Verificando autenticación...</span>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Cargando campañas...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <Button onClick={refetch}>Reintentar</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Mis Campañas
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Gestiona y participa en campañas de rol
          </p>
        </div>
        <Button onClick={() => router.push('/campaigns/create')}>
          <Plus className="h-4 w-4 mr-2" />
          Nueva Campaña
        </Button>
      </div>

      {/* Lista de Campañas */}
      {campaigns.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <Users className="h-16 w-16 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-semibold mb-2">No tienes campañas</h3>
            <p className="text-muted-foreground mb-4">
              Crea tu primera campaña o únete a una existente
            </p>
            <Button onClick={() => router.push('/campaigns/create')}>
              <Plus className="h-4 w-4 mr-2" />
              Crear Primera Campaña
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {campaigns.map((campaign) => (
            <Card key={campaign._id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                {campaign.image && (
                  <div className="relative w-full h-32 mb-3 rounded-md overflow-hidden">
                    <Image
                      src={campaign.image}
                      alt={campaign.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <CardTitle className="line-clamp-1">{campaign.name}</CardTitle>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="outline">
                    <Users className="h-3 w-3 mr-1" />
                    Participante
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex gap-2">
                  <Button
                    variant="default"
                    size="sm"
                    className="flex-1"
                    onClick={() => router.push(`/campaigns/${campaign._id}`)}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    Ver
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push(`/campaigns/${campaign._id}/edit`)}
                  >
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
