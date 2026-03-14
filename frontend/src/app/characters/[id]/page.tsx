"use client"

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/hooks/useAuth";
import { useCharacter } from "@/hooks/useCharacters";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  Edit, 
  Loader2, 
  User, 
  BookOpen,
  Scroll,
  Package,
  Sparkles,
  ArrowUp
} from "lucide-react";
import { CharacterState, Inspiration } from "@/types/character";
import { usePageTitle } from "@/hooks/usePageTitle";
import { useNotificationContext } from "@/context/notifications";
import { InfoTab, BackstoryTab, FeaturesTab, EquipmentTab, SpellsTab } from "@/components/character-detail";
import { characterService } from "@/services/characterService";

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
  
  const { character, loading, error, refetch } = useCharacter(characterId);
  const { error: notifyError, success: notifySuccess } = useNotificationContext();
  const [isOwner, setIsOwner] = useState(false);
  const [activeTab, setActiveTab] = useState("info");
  const [xpValue, setXpValue] = useState<number>(0);
  const [inspirationValue, setInspirationValue] = useState<Inspiration>({
    reroll: false,
    bonus: 0,
    critic: false,
    automaticSuccess: false
  });
  const [isSavingXp, setIsSavingXp] = useState(false);
  const [isSavingInspiration, setIsSavingInspiration] = useState(false);
  const [isXpModalOpen, setIsXpModalOpen] = useState(false);
  const [isInspirationModalOpen, setIsInspirationModalOpen] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  
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
      setXpValue(character.experience ?? 0);
      setInspirationValue(character.inspiration ?? {
        reroll: false,
        bonus: 0,
        critic: false,
        automaticSuccess: false
      });
    }
  }, [user, authLoading, character, router]);

  const handleUpdateXp = async () => {
    if (!character || !character._id) {
      return;
    }
    try {
      setIsSavingXp(true);
      await characterService.updateXP(character._id, xpValue);
      notifySuccess("XP actualizada", "Se guardó la experiencia correctamente.");
      await refetch?.();
      setIsXpModalOpen(false);
    } catch (err) {
      notifyError("Error", err instanceof Error ? err.message : "No se pudo actualizar la XP.");
    } finally {
      setIsSavingXp(false);
    }
  };

  const handleUpdateInspiration = async () => {
    if (!character || !character._id) {
      return;
    }
    try {
      setIsSavingInspiration(true);
      await characterService.updateInspiration(character._id, inspirationValue);
      notifySuccess("Inspiración actualizada", "Se guardó la inspiración correctamente.");
      await refetch?.();
      setIsInspirationModalOpen(false);
    } catch (err) {
      notifyError("Error", err instanceof Error ? err.message : "No se pudo actualizar la inspiración.");
    } finally {
      setIsSavingInspiration(false);
    }
  };

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

  const smallCharacterImage = character.profilePictureRoute || character.pictureRoute;

  return (
    <div className="min-h-screen bg-background">
      {/* Header del personaje */}
      <div className="border-b border-border bg-card/50">
        <div className="container mx-auto px-4 py-4">
          {/* Breadcrumb y acciones */}
          <div className="mb-4 flex items-center justify-between gap-2">
            <div className="min-w-0 flex items-center gap-2 overflow-hidden whitespace-nowrap text-xs text-muted-foreground sm:text-sm">
              <span className="hidden sm:inline">PERSONAD20</span>
              <span className="hidden sm:inline">/</span>
              <button 
                onClick={() => router.push('/characters')}
                className="shrink-0 transition-colors hover:text-foreground"
              >
                PERSONAJES
              </button>
              <span>/</span>
              <span className="truncate text-foreground uppercase">{character.name}</span>
            </div>
            <div className="shrink-0 flex items-center gap-2">
              {isOwner && (
                <>
                  <Button variant="default" size="sm" onClick={() => router.push(`/characters/${characterId}/edit`)}>
                    <Edit className="h-4 w-4 mr-1" />
                    Editar
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Info principal */}
          <div className="space-y-3 lg:flex lg:items-end lg:justify-between lg:gap-6 lg:space-y-0">
            <div className="flex items-start gap-3 lg:flex-1">
              <div className="relative self-start">
                {smallCharacterImage ? (
                  <Dialog open={isImageModalOpen} onOpenChange={setIsImageModalOpen}>
                    <DialogTrigger asChild>
                      <button
                        type="button"
                        className="h-16 w-16 overflow-hidden rounded-full border-2 border-primary transition-transform hover:scale-105"
                        aria-label="Ver avatar en grande"
                      >
                        <Image
                          src={smallCharacterImage}
                          alt={character.name}
                          width={64}
                          height={64}
                          className="h-full w-full object-cover"
                        />
                      </button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>{character.name}</DialogTitle>
                        <DialogDescription>Avatar del personaje</DialogDescription>
                      </DialogHeader>
                      <div className="relative mt-2 aspect-square w-full overflow-hidden rounded-md border bg-muted/30">
                        <Image
                          src={smallCharacterImage}
                          alt={character.name}
                          fill
                          className="object-contain p-2"
                          sizes="(max-width: 768px) 90vw, 700px"
                        />
                      </div>
                    </DialogContent>
                  </Dialog>
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

              <div className="min-w-0 flex-1">
                <h1 className="truncate text-xl font-bold sm:text-2xl">{character.name}</h1>
                <p className="text-muted-foreground">{character.persona} {character.class}</p>
                <div className="mt-1 flex flex-wrap items-center gap-2">
                  <Badge variant="outline" className="text-xs">Nivel {character.level}</Badge>
                  <Badge variant={getStateVariant(character.state) as "default" | "secondary" | "destructive" | "outline"} className="text-xs">
                    {getStateLabel(character.state)}
                  </Badge>
                </div>
              </div>
            </div>

            <div
              className={`grid w-full xl:w-fit gap-2 ${
                character.level < 20
                  ? 'grid-cols-[minmax(0,1fr)_minmax(0,1fr)_56px] xl:grid-cols-[180px_180px_140px]'
                  : 'grid-cols-2 xl:grid-cols-[180px_180px]'
              }`}
            >
              <Dialog open={isXpModalOpen} onOpenChange={setIsXpModalOpen}>
                <DialogTrigger asChild>
                  <button
                    className="flex h-[72px] min-w-0 flex-col items-start justify-center rounded-lg border border-border bg-card px-3 py-2 text-left transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:opacity-50"
                    disabled={!isOwner}
                  >
                    <p className="text-[11px] leading-none text-muted-foreground">EXPERIENCIA</p>
                    <p className="mt-1 text-xl font-bold leading-none">{character.experience?.toLocaleString() || 0}</p>
                  </button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Actualizar Experiencia</DialogTitle>
                    <DialogDescription>Modifica los puntos de experiencia del personaje.</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="xp">Puntos de Experiencia</Label>
                      <Input
                        id="xp"
                        type="number"
                        value={xpValue}
                        onChange={(e) => setXpValue(Number(e.target.value) || 0)}
                        placeholder="0"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsXpModalOpen(false)}>Cancelar</Button>
                    <Button onClick={handleUpdateXp} disabled={isSavingXp}>
                      {isSavingXp ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Guardando...
                        </>
                      ) : (
                        "Guardar"
                      )}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Dialog open={isInspirationModalOpen} onOpenChange={setIsInspirationModalOpen}>
                <DialogTrigger asChild>
                  <button
                    className="flex h-[72px] min-w-0 flex-col items-start justify-center rounded-lg border border-border bg-card px-3 py-2 text-left transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:opacity-50"
                    disabled={!isOwner}
                  >
                    <p className="text-[11px] leading-none text-muted-foreground">INSPIRACIÓN</p>
                    <div className="mt-1 flex min-h-[24px] flex-wrap items-center gap-1">
                      {character.inspiration?.bonus ? <Badge variant="secondary" className="h-5 px-1.5 text-xs">+{character.inspiration.bonus}</Badge> : null}
                      {character.inspiration?.reroll ? <Badge variant="secondary" className="h-5 px-1.5 text-xs">V</Badge> : null}
                      {character.inspiration?.automaticSuccess ? <Badge variant="secondary" className="h-5 px-1.5 text-xs">E.A.</Badge> : null}
                      {character.inspiration?.critic ? <Badge variant="secondary" className="h-5 px-1.5 text-xs">C.A.</Badge> : null}
                      {!character.inspiration?.bonus && !character.inspiration?.reroll && !character.inspiration?.critic && !character.inspiration?.automaticSuccess ? (
                        <span className="text-sm text-muted-foreground">Ninguna</span>
                      ) : null}
                    </div>
                  </button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Actualizar Inspiración</DialogTitle>
                    <DialogDescription>Configura los modificadores de inspiración del personaje.</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="bonus">Bonificador</Label>
                      <Input
                        id="bonus"
                        type="number"
                        value={inspirationValue.bonus}
                        onChange={(e) => setInspirationValue({ ...inspirationValue, bonus: Number(e.target.value) || 0 })}
                        placeholder="0"
                      />
                    </div>
                    <div className="space-y-3">
                      <Label>Otras Inspiraciones</Label>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between rounded-lg border border-border p-3">
                          <span className="text-sm">Ventaja</span>
                          <Button
                            size="sm"
                            variant={inspirationValue.reroll ? "default" : "outline"}
                            onClick={() => setInspirationValue({ ...inspirationValue, reroll: !inspirationValue.reroll })}
                          >
                            {inspirationValue.reroll ? "Activado" : "Desactivado"}
                          </Button>
                        </div>
                        <div className="flex items-center justify-between rounded-lg border border-border p-3">
                          <span className="text-sm">Éxito automático</span>
                          <Button
                            size="sm"
                            variant={inspirationValue.automaticSuccess ? "default" : "outline"}
                            onClick={() => setInspirationValue({ ...inspirationValue, automaticSuccess: !inspirationValue.automaticSuccess })}
                          >
                            {inspirationValue.automaticSuccess ? "Activado" : "Desactivado"}
                          </Button>
                        </div>
                        <div className="flex items-center justify-between rounded-lg border border-border p-3">
                          <span className="text-sm">Crítico automático</span>
                          <Button
                            size="sm"
                            variant={inspirationValue.critic ? "default" : "outline"}
                            onClick={() => setInspirationValue({ ...inspirationValue, critic: !inspirationValue.critic })}
                          >
                            {inspirationValue.critic ? "Activado" : "Desactivado"}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsInspirationModalOpen(false)}>Cancelar</Button>
                    <Button onClick={handleUpdateInspiration} disabled={isSavingInspiration}>
                      {isSavingInspiration ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Guardando...
                        </>
                      ) : (
                        "Guardar"
                      )}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              {character.level < 20 ? (
                <Button
                  variant="default"
                  size="default"
                  disabled={!isOwner}
                  onClick={() => router.push(`/characters/${characterId}/level-up`)}
                  className="h-14 w-14 min-w-0 p-0 xl:h-[72px] xl:w-[140px] xl:flex-col xl:items-center xl:justify-center xl:px-3 xl:py-2 xl:text-center"
                >
                  <ArrowUp className="h-4 w-4" />
                  <span className="hidden xl:inline">Subir de nivel</span>
                </Button>
              ) : (
                <div className="flex h-[72px] min-w-0 flex-col items-start justify-center rounded-lg border border-border bg-card px-3 py-2">
                  <p className="text-[11px] leading-none text-muted-foreground">BONIF. COMP.</p>
                  <p className="mt-1 text-xl font-bold leading-none">+{character.proficency}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Contenido con tabs */}
      <div className="container mx-auto px-4 py-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-4 w-full justify-start gap-1 overflow-x-auto bg-muted/50 scrollbar-hide sm:gap-0">
            <TabsTrigger value="info" className="gap-2">
              <User className="h-4 w-4" />
              <span className="sr-only sm:not-sr-only">Información</span>
            </TabsTrigger>
            <TabsTrigger value="backstory" className="gap-2">
              <BookOpen className="h-4 w-4" />
              <span className="sr-only sm:not-sr-only">Trasfondo</span>
            </TabsTrigger>
            <TabsTrigger value="features" className="gap-2">
              <Sparkles className="h-4 w-4" />
              <span className="sr-only sm:not-sr-only">Rasgos</span>
            </TabsTrigger>
            <TabsTrigger value="equipment" className="gap-2">
              <Package className="h-4 w-4" />
              <span className="sr-only sm:not-sr-only">Equipo</span>
            </TabsTrigger>
            <TabsTrigger value="spells" className="gap-2">
              <Scroll className="h-4 w-4" />
              <span className="sr-only sm:not-sr-only">Conjuros</span>
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
            <EquipmentTab character={character} isOwner={isOwner} onRefetch={refetch} />
          </TabsContent>

          {/* Tab Conjuros */}
          <TabsContent value="spells" className="space-y-6">
            <SpellsTab character={character} isOwner={isOwner} onRefetch={refetch} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
