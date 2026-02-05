"use client"

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/hooks/useAuth";
import { usePageTitle } from "@/hooks/usePageTitle";
import { useCharacters } from "@/hooks/useCharacters";
import { useNotificationContext } from "@/context/notifications";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Collapsible, 
  CollapsibleContent, 
  CollapsibleTrigger 
} from "@/components/ui/collapsible";
import { Plus, Eye, Settings, Loader2, Skull, User, Dices, ChevronDown, ChevronRight, Moon } from "lucide-react";
import { CharacterState, System, CharacterSummary } from "@/types/character";

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
    case System.PERSONAD20:
      return "Persona D20";
    default:
      return system;
  }
};

export default function CharactersPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const { characters, loading, error } = useCharacters();
  const { error: notifyError } = useNotificationContext();
  const [showSystemModal, setShowSystemModal] = useState(false);
  const [showInactive, setShowInactive] = useState(false);

  // Separar personajes activos de inactivos/muertos
  const { activeCharacters, inactiveCharacters } = useMemo(() => {
    const active = characters.filter(c => c.state === CharacterState.ACTIVE);
    const inactive = characters.filter(c => 
      c.state === CharacterState.DEAD || 
      c.state === CharacterState.INACTIVE
    );
    return { activeCharacters: active, inactiveCharacters: inactive };
  }, [characters]);

  // Mostrar error como toast cuando ocurra
  useEffect(() => {
    if (error) {
      notifyError('Error', error);
    }
  }, [error, notifyError]);
  
  // Establecer título dinámico de la página
  usePageTitle("Mis Personajes");

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
          <span className="ml-2">Cargando personajes...</span>
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
        <Button onClick={() => setShowSystemModal(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Personaje
        </Button>
      </div>

      {/* Modal de selección de sistema */}
      {showSystemModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div 
            className="absolute inset-0 bg-black/50" 
            onClick={() => setShowSystemModal(false)}
          />
          <Card className="relative z-10 w-full max-w-md mx-4 animate-in fade-in zoom-in duration-200">
            <CardHeader>
              <CardTitle className="text-center">Selecciona el Sistema de Juego</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <button
                onClick={() => {
                  setShowSystemModal(false);
                  router.push('/characters/create?system=PERSONAD20');
                }}
                className="w-full p-4 rounded-lg border-2 border-primary bg-primary/5 hover:bg-primary/10 transition-colors text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
                    <Dices className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <div className="font-semibold">Persona D20</div>
                    <div className="text-sm text-muted-foreground">Sistema basado en la saga Persona</div>
                  </div>
                </div>
              </button>
              <p className="text-xs text-center text-muted-foreground pt-2">
                Más sistemas próximamente
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Lista de Personajes */}
      {characters.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <User className="h-16 w-16 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-semibold mb-2">No tienes personajes</h3>
            <p className="text-muted-foreground mb-4">
              Crea tu primer personaje para empezar a jugar
            </p>
            <Button onClick={() => setShowSystemModal(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Crear Primer Personaje
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-8">
          {/* Personajes Activos */}
          <section>
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <User className="h-5 w-5 text-green-500" />
              Personajes Activos
              <Badge variant="secondary" className="ml-2">
                {activeCharacters.length}
              </Badge>
            </h2>
            {activeCharacters.length === 0 ? (
              <Card className="text-center py-8">
                <CardContent>
                  <p className="text-muted-foreground">
                    No tienes personajes activos
                  </p>
                </CardContent>
              </Card>
            ) : (
              <CharacterGrid characters={activeCharacters} router={router} />
            )}
          </section>

          {/* Personajes Inactivos/Muertos - Sección Expandible */}
          {inactiveCharacters.length > 0 && (
            <Collapsible open={showInactive} onOpenChange={setShowInactive}>
              <CollapsibleTrigger asChild>
                <button className="flex items-center gap-2 text-lg font-semibold text-muted-foreground hover:text-foreground transition-colors w-full text-left py-2">
                  {showInactive ? (
                    <ChevronDown className="h-5 w-5" />
                  ) : (
                    <ChevronRight className="h-5 w-5" />
                  )}
                  <Moon className="h-5 w-5" />
                  Personajes Inactivos y Muertos
                  <Badge variant="outline" className="ml-2">
                    {inactiveCharacters.length}
                  </Badge>
                </button>
              </CollapsibleTrigger>
              <CollapsibleContent className="pt-4">
                <CharacterGrid characters={inactiveCharacters} router={router} />
              </CollapsibleContent>
            </Collapsible>
          )}
        </div>
      )}
    </div>
  );
}

// Componente para la grilla de personajes (evita duplicación)
function CharacterGrid({ characters, router }: { characters: CharacterSummary[], router: ReturnType<typeof useRouter> }) {
  return (
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
  );
}
