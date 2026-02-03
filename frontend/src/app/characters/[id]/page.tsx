"use client"

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/hooks/useAuth";
import { useCharacter } from "@/hooks/useCharacters";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Settings, User, Loader2, Edit } from "lucide-react";
import { CharacterState, System } from "@/types/character";
import { usePageTitle } from "@/hooks/usePageTitle";

const getStateVariant = (state: CharacterState) => {
  switch (state) {
    case CharacterState.ACTIVE:
      return "success";
    case CharacterState.DEAD:
      return "destructive";
    case CharacterState.INACTIVE:
      return "secondary";
    default:
      return "outline";
  }
};

const getSystemLabel = (system: System) => {
  switch (system) {
    case System.DND5E:
      return "D&D 5E";
    case System.PERSONAD20:
      return "Persona D20";
    default:
      return system;
  }
};

export default function CharacterDetailPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const characterId = params?.id as string;
  
  const { character, loading, error } = useCharacter(characterId);
  const [isOwner, setIsOwner] = useState(false);
  
  // Establecer título dinámico basado en el personaje
  usePageTitle(character ? `${character.name} - Personaje` : "Personaje");

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }
    
    if (character && user) {
      // Verificar si el usuario es el dueño del personaje
      const playerId = typeof character.player === 'string' ? character.player : character.player;
      setIsOwner(playerId === user.id);
    }
  }, [user, authLoading, character, router]);

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
          <span className="ml-2">Cargando personaje...</span>
        </div>
      </div>
    );
  }

  if (error || !character) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error || 'Personaje no encontrado'}</p>
          <Button onClick={() => router.push('/characters')}>
            Volver a Personajes
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
            <h1 className="text-2xl font-bold">{character.name}</h1>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant={getStateVariant(character.state) as "default" | "secondary" | "destructive" | "outline"}>
                {character.state === CharacterState.ACTIVE && "Activo"}
                {character.state === CharacterState.DEAD && "Muerto"}
                {character.state === CharacterState.INACTIVE && "Inactivo"}
                {character.state === CharacterState.DELETED && "Eliminado"}
                {character.state === CharacterState.NON_PLAYER && "NPC"}
              </Badge>
              <Badge variant="outline">{getSystemLabel(character.system)}</Badge>
            </div>
          </div>
        </div>
        
        {isOwner && (
          <Button
            variant="outline"
            onClick={() => router.push(`/characters/${characterId}/edit`)}
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
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Información General
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-sm text-muted-foreground">Sistema</h4>
                  <p>{getSystemLabel(character.system)}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-muted-foreground">Estado</h4>
                  <p>{character.state}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-muted-foreground">Creado</h4>
                  <p>{new Date(character.createdAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-muted-foreground">Actualizado</h4>
                  <p>{new Date(character.updatedAt).toLocaleDateString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Historia */}
          <Card>
            <CardHeader>
              <CardTitle>Historia del Personaje</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {character.backstory.history && (
                <div>
                  <h4 className="font-semibold mb-2">Historia</h4>
                  <p className="text-muted-foreground whitespace-pre-wrap">
                    {character.backstory.history}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {character.backstory.personality && (
                  <div>
                    <h4 className="font-semibold mb-2">Personalidad</h4>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                      {character.backstory.personality}
                    </p>
                  </div>
                )}

                {character.backstory.appearance && (
                  <div>
                    <h4 className="font-semibold mb-2">Apariencia</h4>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                      {character.backstory.appearance}
                    </p>
                  </div>
                )}

                {character.backstory.traits && (
                  <div>
                    <h4 className="font-semibold mb-2">Rasgos</h4>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                      {character.backstory.traits}
                    </p>
                  </div>
                )}

                {character.backstory.defects && (
                  <div>
                    <h4 className="font-semibold mb-2">Defectos</h4>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                      {character.backstory.defects}
                    </p>
                  </div>
                )}

                {character.backstory.ideals && (
                  <div>
                    <h4 className="font-semibold mb-2">Ideales</h4>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                      {character.backstory.ideals}
                    </p>
                  </div>
                )}

                {character.backstory.dreams && (
                  <div>
                    <h4 className="font-semibold mb-2">Sueños</h4>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                      {character.backstory.dreams}
                    </p>
                  </div>
                )}

                {character.backstory.bonds && (
                  <div>
                    <h4 className="font-semibold mb-2">Vínculos</h4>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                      {character.backstory.bonds}
                    </p>
                  </div>
                )}

                {character.backstory.trauma && (
                  <div className="md:col-span-2">
                    <h4 className="font-semibold mb-2">Traumas/Miedos</h4>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                      {character.backstory.trauma}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Imagen del Personaje */}
          <Card>
            <CardHeader>
              <CardTitle>Avatar</CardTitle>
            </CardHeader>
            <CardContent>
              {character.pictureRoute ? (
                <div className="relative w-full h-64 rounded-md overflow-hidden">
                  <Image
                    src={character.pictureRoute}
                    alt={character.name}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="w-full h-64 bg-muted rounded-md flex items-center justify-center">
                  <div className="text-center text-muted-foreground">
                    <User className="h-12 w-12 mx-auto mb-2" />
                    <p className="text-sm">Sin imagen</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Acciones Rápidas */}
          <Card>
            <CardHeader>
              <CardTitle>Acciones</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {isOwner && (
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => router.push(`/characters/${characterId}/edit`)}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Editar Personaje
                </Button>
              )}
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => router.push('/characters')}
              >
                <User className="h-4 w-4 mr-2" />
                Ver Todos los Personajes
              </Button>
              {character.system === System.DND5E && (
                <Button 
                  variant="ghost" 
                  className="w-full justify-start"
                  disabled
                >
                  🎲 Hoja de Tiradas
                </Button>
              )}
              {character.system === System.PERSONAD20 && (
                <Button 
                  variant="ghost" 
                  className="w-full justify-start"
                  disabled
                >
                  🃏 Gestión de Cartas
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Información del Sistema */}
          <Card>
            <CardHeader>
              <CardTitle>Sistema: {getSystemLabel(character.system)}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center text-muted-foreground">
                <p className="text-sm">
                  {character.system === System.DND5E && 
                    "Dungeons & Dragons 5ta Edición"}
                  {character.system === System.PERSONAD20 && 
                    "Sistema basado en Persona con dados D20"}
                </p>
                <p className="text-xs mt-2">
                  Las características específicas del sistema se mostrarán aquí en futuras versiones
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
