"use client"

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/hooks/useAuth";
import { useCampaign } from "@/hooks/useCampaigns";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ArrowLeft, Settings, Users, BookOpen, Plus, Loader2, Copy, Check, Link } from "lucide-react";
import { usePageTitle } from "@/hooks/usePageTitle";
import { useNotificationContext } from "@/context/notifications";

export default function CampaignDetailPage() {
  const { user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const campaignId = params?.id as string;
  
  const { campaign, loading, error } = useCampaign(campaignId);
  const { success } = useNotificationContext();
  const [isOwner, setIsOwner] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [copied, setCopied] = useState(false);

  const inviteLink = typeof window !== 'undefined' 
    ? `${window.location.origin}/campaigns/join/${campaignId}` 
    : '';

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink);
      setCopied(true);
      success('Link copiado', 'El link de invitación ha sido copiado al portapapeles');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Error al copiar:', err);
    }
  };
  
  // Establecer título dinámico basado en la campaña
  usePageTitle(campaign ? `${campaign.name} - Campaña` : "Campaña");

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    
    if (campaign && user) {
      // Verificar si el usuario es el dueño de la campaña
      const ownerId = typeof campaign.owner === 'string' ? campaign.owner : campaign.owner._id;
      setIsOwner(ownerId === user._id);
    }
  }, [user, campaign, router]);

  if (!user) {
    return null;
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Cargando campaña...</span>
        </div>
      </div>
    );
  }

  if (error || !campaign) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error || 'Campaña no encontrada'}</p>
          <Button onClick={() => router.push('/campaigns')}>
            Volver a Campañas
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{campaign.name}</h1>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant={isOwner ? "default" : "secondary"}>
                {isOwner ? "Propietario" : "Participante"}
              </Badge>
              <Badge variant="outline">{campaign.state}</Badge>
            </div>
          </div>
        </div>
        
        {isOwner && (
          <Button
            variant="outline"
            onClick={() => router.push(`/campaigns/${campaignId}/edit`)}
          >
            <Settings className="h-4 w-4 mr-2" />
            Editar
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Columna Principal */}
        <div className="lg:col-span-2 space-y-6">
          {/* Información General */}
          <Card>
            <CardHeader>
              <CardTitle>Información General</CardTitle>
            </CardHeader>
            <CardContent>
              {campaign.image && (
                <div className="relative w-full h-48 mb-4 rounded-md overflow-hidden">
                  <Image
                    src={campaign.image}
                    alt={campaign.name}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <p className="text-muted-foreground">
                {campaign.description || "Sin descripción disponible"}
              </p>
            </CardContent>
          </Card>

          {/* Personajes */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Personajes ({campaign.characters?.length || 0})
              </CardTitle>
              <Button size="sm" variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Agregar Personaje
              </Button>
            </CardHeader>
            <CardContent>
              {campaign.characters && campaign.characters.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {campaign.characters.map((character, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <h4 className="font-semibold">Personaje {index + 1}</h4>
                      <p className="text-sm text-muted-foreground">
                        {typeof character === 'string' ? character : 'ID: ' + character}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">
                  No hay personajes en esta campaña
                </p>
              )}
            </CardContent>
          </Card>

          {/* Notas Públicas */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Notas Públicas</CardTitle>
              {isOwner && (
                <Button size="sm" variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Nueva Nota
                </Button>
              )}
            </CardHeader>
            <CardContent>
              {campaign.publicEntries && campaign.publicEntries.length > 0 ? (
                <div className="space-y-4">
                  {campaign.publicEntries.map((note, index) => (
                    <div key={index} className="border-l-4 border-blue-500 pl-4">
                      <h4 className="font-semibold">Nota {index + 1}</h4>
                      <p className="text-sm text-muted-foreground">
                        {typeof note === 'string' ? note : note.title || 'Sin título'}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">
                  No hay notas públicas
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Participantes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Participantes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Dueño */}
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-sm font-bold">
                  {typeof campaign.owner === 'string' ? 'GM' : campaign.owner.username?.[0]?.toUpperCase() || 'GM'}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm">
                    {typeof campaign.owner === 'string' ? 'Game Master' : campaign.owner.username || 'Game Master'}
                  </p>
                  <p className="text-xs text-muted-foreground">Propietario</p>
                </div>
              </div>
              
              {/* Jugadores */}
              {campaign.players && campaign.players.length > 0 ? (
                campaign.players.map((player, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center text-secondary-foreground text-sm font-bold">
                      {typeof player === 'string' ? 'P' : player.username?.[0]?.toUpperCase() || 'P'}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-sm">
                        {typeof player === 'string' ? `Jugador ${index + 1}` : player.username || `Jugador ${index + 1}`}
                      </p>
                      <p className="text-xs text-muted-foreground">Jugador</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground text-sm">
                  No hay otros jugadores
                </p>
              )}
              
              {isOwner && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full mt-3"
                  onClick={() => setShowInviteModal(true)}
                >
                  <Link className="h-4 w-4 mr-2" />
                  Invitar Jugador
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Notas Privadas (solo para el owner) */}
          {isOwner && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Notas Privadas</CardTitle>
                <Button size="sm" variant="outline">
                  <Plus className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent>
                {campaign.notes && campaign.notes.length > 0 ? (
                  <div className="space-y-3">
                    {campaign.notes.map((note, index) => (
                      <div key={index} className="border-l-4 border-orange-500 pl-4">
                        <h4 className="font-semibold text-sm">Nota {index + 1}</h4>
                        <p className="text-xs text-muted-foreground">
                          {typeof note === 'string' ? note : note.title || 'Sin título'}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-sm">
                    No hay notas privadas
                  </p>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Modal de Invitación */}
      <Dialog open={showInviteModal} onOpenChange={setShowInviteModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invitar Jugador</DialogTitle>
            <DialogDescription>
              Comparte este link con el jugador que quieras invitar a la campaña.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex gap-2">
              <Input 
                value={inviteLink} 
                readOnly 
                className="flex-1"
              />
              <Button onClick={handleCopyLink} variant="outline">
                {copied ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              El jugador deberá tener una cuenta e iniciar sesión para unirse a la campaña.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
