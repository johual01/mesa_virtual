"use client"

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/hooks/useAuth";
import { useCharacter } from "@/hooks/useCharacters";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Edit, 
  Loader2, 
  User, 
  BookOpen,
  Scroll,
  Package,
  Sparkles,
  ChevronUp,
  Share2,
  Copy,
  RotateCcw,
  Printer,
  List
} from "lucide-react";
import { CharacterState } from "@/types/character";
import { usePageTitle } from "@/hooks/usePageTitle";
import { useNotificationContext } from "@/context/notifications";
import { InfoTab, BackstoryTab, FeaturesTab, EquipmentTab, SpellsTab } from "@/components/character-detail";

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

const getStateLabel = (state: CharacterState) => {
  switch (state) {
    case CharacterState.ACTIVE: return "Activo";
    case CharacterState.DEAD: return "Muerto";
    case CharacterState.INACTIVE: return "Inactivo";
    case CharacterState.DELETED: return "Eliminado";
    case CharacterState.NON_PLAYER: return "NPC";
    default: return state;
  }
};

export default function CharacterDetailPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const characterId = params?.id as string;
  
  const { character, loading, error } = useCharacter(characterId);
  const { error: notifyError } = useNotificationContext();
  const [isOwner, setIsOwner] = useState(false);
  const [activeTab, setActiveTab] = useState("info");
  
  // Establecer título dinámico basado en el personaje
  usePageTitle(character ? `${character.name} - Personaje` : "Personaje");

  // Mostrar error como toast y redirigir
  useEffect(() => {
    if (error) {
      notifyError('Error', error);
      router.push('/characters');
    }
  }, [error, notifyError, router]);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }
    
    if (character && user) {
      // El personaje pertenece al usuario actual si coincide el ID
      // Por ahora asumimos que si puede ver el personaje, puede editarlo
      setIsOwner(true);
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

  if (!character && !loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Personaje no encontrado</p>
          <Button onClick={() => router.push('/characters')}>
            Volver a Personajes
          </Button>
        </div>
      </div>
    );
  }

  if (!character) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header del personaje */}
      <div className="border-b border-border bg-card/50">
        <div className="container mx-auto px-4 py-4">
          {/* Breadcrumb y acciones */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>PERSONAD20</span>
              <span>/</span>
              <span>PERSONAJES</span>
              <span>/</span>
              <span className="text-foreground uppercase">{character.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => router.push('/characters')}>
                <List className="h-4 w-4 mr-1" />
                Listado
              </Button>
              {isOwner && (
                <Button variant="default" size="sm" onClick={() => router.push(`/characters/${characterId}/edit`)}>
                  <Edit className="h-4 w-4 mr-1" />
                  Editar
                </Button>
              )}
            </div>
          </div>

          {/* Info principal */}
          <div className="flex items-start gap-4">
            {/* Avatar */}
            <div className="relative">
              {character.pictureRoute ? (
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-primary">
                  <Image
                    src={character.pictureRoute}
                    alt={character.name}
                    width={64}
                    height={64}
                    className="object-cover w-full h-full"
                  />
                </div>
              ) : (
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center border-2 border-border">
                  <User className="h-8 w-8 text-muted-foreground" />
                </div>
              )}
              <Badge 
                className="absolute -bottom-1 -right-1 text-xs"
                variant={getStateVariant(character.state) as "default" | "secondary" | "destructive" | "outline"}
              >
                {character.level}
              </Badge>
            </div>

            {/* Nombre y detalles */}
            <div className="flex-1">
              <h1 className="text-2xl font-bold">{character.name}</h1>
              <p className="text-muted-foreground">
                {character.persona} {character.class} {character.level}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className="text-xs">
                  Nivel {character.level}
                </Badge>
                <Badge variant={getStateVariant(character.state) as "default" | "secondary" | "destructive" | "outline"} className="text-xs">
                  {getStateLabel(character.state)}
                </Badge>
              </div>
            </div>

            {/* Acciones rápidas */}
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" title="Ir arriba">
                <ChevronUp className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" title="Compartir">
                <Share2 className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" title="Copiar">
                <Copy className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" title="Reiniciar">
                <RotateCcw className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" title="Imprimir">
                <Printer className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido con tabs */}
      <div className="container mx-auto px-4 py-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full justify-start overflow-x-auto mb-4 bg-muted/50 scrollbar-hide">
            <TabsTrigger value="info" className="gap-2">
              <User className="h-4 w-4" />
              Información
            </TabsTrigger>
            <TabsTrigger value="backstory" className="gap-2">
              <BookOpen className="h-4 w-4" />
              Trasfondo
            </TabsTrigger>
            <TabsTrigger value="features" className="gap-2">
              <Sparkles className="h-4 w-4" />
              Rasgos
            </TabsTrigger>
            <TabsTrigger value="equipment" className="gap-2">
              <Package className="h-4 w-4" />
              Equipo
            </TabsTrigger>
            <TabsTrigger value="spells" className="gap-2">
              <Scroll className="h-4 w-4" />
              Conjuros
            </TabsTrigger>
          </TabsList>

          {/* Tab Información */}
          <TabsContent value="info" className="space-y-6">
            <InfoTab character={character} />
          </TabsContent>

          {/* Tab Trasfondo */}
          <TabsContent value="backstory" className="space-y-6">
            <BackstoryTab character={character} isOwner={isOwner} />
          </TabsContent>

          {/* Tab Rasgos */}
          <TabsContent value="features" className="space-y-6">
            <FeaturesTab character={character} isOwner={isOwner} />
          </TabsContent>

          {/* Tab Equipo */}
          <TabsContent value="equipment" className="space-y-6">
            <EquipmentTab character={character} isOwner={isOwner} />
          </TabsContent>

          {/* Tab Conjuros */}
          <TabsContent value="spells" className="space-y-6">
            <SpellsTab character={character} isOwner={isOwner} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
