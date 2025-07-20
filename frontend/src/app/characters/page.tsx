"use client"

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/hooks/useAuth";
import { usePageTitle } from "@/hooks/usePageTitle";
import { useCharacters } from "@/hooks/useCharacters";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Eye, Settings, Loader2, Skull, User } from "lucide-react";
import { CharacterState, System } from "@/types/character";

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

const getStateIcon = (state: CharacterState) => {
  switch (state) {
    case CharacterState.DEAD:
      return <Skull className="h-3 w-3" />;
    default:
      return <User className="h-3 w-3" />;
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

export default function CharactersPage() {
  const { user } = useAuth();
  const router = useRouter();
  const { characters, loading, error, refetch } = useCharacters();
  
  // Establecer título dinámico de la página
  usePageTitle("Mis Personajes");

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  if (!user) {
    return null;
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Cargando personajes...</span>
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
            Mis Personajes
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Gestiona las fichas de tus personajes
          </p>
        </div>
        <Button onClick={() => router.push('/characters/create')}>
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Personaje
        </Button>
      </div>

      {/* Lista de Personajes */}
      {characters.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <User className="h-16 w-16 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-semibold mb-2">No tienes personajes</h3>
            <p className="text-muted-foreground mb-4">
              Crea tu primer personaje para empezar a jugar
            </p>
            <Button onClick={() => router.push('/characters/create')}>
              <Plus className="h-4 w-4 mr-2" />
              Crear Primer Personaje
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {characters.map((character) => (
            <Card key={character._id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                {character.pictureRoute && (
                  <div className="relative w-full h-32 mb-3 rounded-md overflow-hidden">
                    <Image
                      src={character.pictureRoute}
                      alt={character.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="space-y-2">
                  <CardTitle className="line-clamp-1">{character.name}</CardTitle>
                  <div className="flex flex-wrap gap-2">
                    <Badge 
                      variant={getStateVariant(character.state) as "default" | "secondary" | "destructive" | "outline"}
                      className="text-xs"
                    >
                      {getStateIcon(character.state)}
                      <span className="ml-1">
                        {character.state === CharacterState.ACTIVE && "Activo"}
                        {character.state === CharacterState.DEAD && "Muerto"}
                        {character.state === CharacterState.INACTIVE && "Inactivo"}
                        {character.state === CharacterState.DELETED && "Eliminado"}
                        {character.state === CharacterState.NON_PLAYER && "NPC"}
                      </span>
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {getSystemLabel(character.system)}
                    </Badge>
                  </div>
                  {character.campaign && (
                    <div className="text-sm text-muted-foreground">
                      📋 {character.campaign.name}
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex gap-2">
                  <Button
                    variant="default"
                    size="sm"
                    className="flex-1"
                    onClick={() => router.push(`/characters/${character._id}`)}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    Ver
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push(`/characters/${character._id}/edit`)}
                  >
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Filtros y estadísticas */}
      {characters.length > 0 && (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-green-600">
                {characters.filter(c => c.state === CharacterState.ACTIVE).length}
              </div>
              <p className="text-sm text-muted-foreground">Personajes Activos</p>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-blue-600">
                {characters.filter(c => c.system === System.DND5E).length}
              </div>
              <p className="text-sm text-muted-foreground">D&D 5E</p>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-purple-600">
                {characters.filter(c => c.system === System.PERSONAD20).length}
              </div>
              <p className="text-sm text-muted-foreground">Persona D20</p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
