"use client"

import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useCharacter } from "@/hooks/useCharacters";
import { useCharacterLevelUp, useLevelUpForm } from "@/hooks/useCharacterLevelUp";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  ArrowUp, 
  Loader2, 
  Dices, 
  Heart,
  Shield,
  Sparkles,
  Plus,
  Minus,
  Check
} from "lucide-react";
import { usePageTitle } from "@/hooks/usePageTitle";
import { useNotificationContext } from "@/context/notifications";
import { Element, Stadistics } from "@/types/character";

// Traducciones para elementos
const ELEMENT_TRANSLATIONS: Record<string, string> = {
  psy: 'Psíquico',
  nuke: 'Nuclear',
  fire: 'Fuego',
  ice: 'Hielo',
  elec: 'Eléctrico',
  wind: 'Viento',
  curse: 'Maldición',
  bless: 'Bendición',
  almighty: 'Todopoderoso',
  slash: 'Cortante',
  strike: 'Contundente',
  pierce: 'Perforante'
};

// Traducciones para estadísticas
const STAT_TRANSLATIONS: Record<keyof Stadistics, string> = {
  courage: 'Coraje',
  dexterity: 'Destreza',
  instincts: 'Instintos',
  knowledge: 'Conocimiento',
  charisma: 'Carisma'
};

// Traducciones para categorías de hechizos
const SPELL_CATEGORY_TRANSLATIONS: Record<string, string> = {
  attack: 'Daño',
  buff: 'Potenciador',
  heal: 'Curación',
  shield: 'Escudo',
  debuff: 'Debilitador',
  utility: 'Utilidad',
  counter: 'Contraataque'
};

const STAT_KEYS: (keyof Stadistics)[] = ['courage', 'dexterity', 'instincts', 'knowledge', 'charisma'];

// Función para simular tirada de dado
const rollDice = (diceString: string): number => {
  // Formato esperado: "1d8", "2d6", etc.
  const match = diceString.match(/(\d+)d(\d+)/);
  if (!match) return 0;
  
  const count = parseInt(match[1], 10);
  const sides = parseInt(match[2], 10);
  
  let total = 0;
  for (let i = 0; i < count; i++) {
    total += Math.floor(Math.random() * sides) + 1;
  }
  return total;
};

export default function LevelUpPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const characterId = params?.id as string;
  
  const { character, loading: characterLoading } = useCharacter(characterId);
  const { 
    levelUpInfo, 
    loading: levelUpLoading, 
    error, 
    submitting, 
    submitLevelUp 
  } = useCharacterLevelUp({ characterId });
  
  const {
    formData,
    setNewHP,
    setSelectedSubclass,
    toggleSecondaryFeature,
    setSelectedSecondaryAffinity,
    incrementStat,
    decrementStat,
    remainingStatPoints,
    isFormValid,
  } = useLevelUpForm({ levelUpInfo });

  const { error: notifyError, success: notifySuccess } = useNotificationContext();
  
  usePageTitle(character ? `Subir de Nivel - ${character.name}` : "Subir de Nivel");

  // Redirigir si no autenticado
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  // Mostrar error si hay
  useEffect(() => {
    if (error) {
      notifyError('Error', error);
    }
  }, [error, notifyError]);

  const handleRollHP = () => {
    if (!levelUpInfo?.HPDice) return;
    const result = rollDice(levelUpInfo.HPDice);
    setNewHP(result);
  };

  const handleSubmit = async () => {
    if (!isFormValid()) {
      notifyError('Formulario incompleto', 'Por favor completa todos los campos requeridos');
      return;
    }

    const success = await submitLevelUp(formData);
    if (success) {
      notifySuccess('¡Nivel subido!', `Tu personaje ahora es nivel ${levelUpInfo?.level}`);
      router.push(`/characters/${characterId}`);
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

  if (characterLoading || levelUpLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Cargando información...</span>
        </div>
      </div>
    );
  }

  if (!character || !levelUpInfo) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">
            {error || 'No se pudo cargar la información de subida de nivel'}
          </p>
          <Button onClick={() => router.push(`/characters/${characterId}`)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver al personaje
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card/50">
        <div className="container mx-auto px-4 py-4">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <span>PERSONAD20</span>
            <span>/</span>
            <button 
              onClick={() => router.push('/characters')}
              className="hover:text-foreground transition-colors"
            >
              PERSONAJES
            </button>
            <span>/</span>
            <button 
              onClick={() => router.push(`/characters/${characterId}`)}
              className="hover:text-foreground transition-colors"
            >
              {character.name.toUpperCase()}
            </button>
            <span>/</span>
            <span className="text-foreground">SUBIR DE NIVEL</span>
          </div>

          {/* Título */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                <ArrowUp className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Subir de Nivel</h1>
                <p className="text-muted-foreground">
                  {character.name} · Nivel {character.level} → Nivel {levelUpInfo.level}
                </p>
              </div>
            </div>
            <Button variant="outline" onClick={() => router.push(`/characters/${characterId}`)}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Cancelar
            </Button>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Columna izquierda - Selecciones obligatorias */}
          <div className="space-y-6">
            {/* Puntos de Vida */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-red-500" />
                  Puntos de Vida
                </CardTitle>
                <CardDescription>
                  Tira {levelUpInfo.HPDice} para determinar los PV que ganas este nivel
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <Input
                      id="newHP"
                      type="number"
                      min={1}
                      value={formData.newHP || ''}
                      onChange={(e) => setNewHP(parseInt(e.target.value) || 0)}
                      placeholder="Resultado de la tirada"
                    />
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <Button 
                      type="button" 
                      variant="secondary"
                      onClick={handleRollHP}
                      className="flex items-center gap-2"
                    >
                      <Dices className="h-4 w-4" />
                      Tirar {levelUpInfo.HPDice}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Selección de Subclase */}
            {levelUpInfo.shouldChooseSubclass && levelUpInfo.subclasses && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-blue-500" />
                    Selecciona tu Subclase
                  </CardTitle>
                  <CardDescription>
                    Elige una especialización para tu personaje
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {levelUpInfo.subclasses.map((subclass) => (
                    <button
                      key={subclass._id}
                      type="button"
                      onClick={() => setSelectedSubclass(subclass._id)}
                      className={`w-full p-4 rounded-lg border text-left transition-all ${
                        formData.selectedSubclass === subclass._id
                          ? 'border-primary bg-primary/10'
                          : 'border-border hover:border-primary/50 hover:bg-accent'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold">{subclass.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {subclass.description}
                          </p>
                        </div>
                        {formData.selectedSubclass === subclass._id && (
                          <Check className="h-5 w-5 text-primary" />
                        )}
                      </div>
                    </button>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Mejora de Estadísticas */}
            {levelUpInfo.shouldChooseStatImprovement && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-yellow-500" />
                    Mejora de Estadísticas
                  </CardTitle>
                  <CardDescription>
                    Distribuye 2 puntos entre tus estadísticas
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <Badge variant={remainingStatPoints > 0 ? "secondary" : "default"}>
                      Puntos restantes: {remainingStatPoints}
                    </Badge>
                  </div>
                  <div className="space-y-3">
                    {STAT_KEYS.map((stat) => {
                      const currentValue = character.stats[stat]?.value || 0;
                      const currentBonus = character.stats[stat]?.bonus || 0;
                      const increment = formData.selectedStats?.[stat] || 0;
                      const newValue = currentValue + increment;
                      const newBonus = Math.floor((newValue - 10) / 2);
                      const bonusChanged = newBonus !== currentBonus;
                      
                      return (
                        <div key={stat} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                          <div className="flex flex-col">
                            <span className="font-medium">{STAT_TRANSLATIONS[stat]}</span>
                            <div className="flex items-center gap-2 text-sm">
                              <span className="text-muted-foreground">
                                {currentValue} ({currentBonus >= 0 ? '+' : ''}{currentBonus})
                              </span>
                              {increment > 0 && (
                                <>
                                  <span className="text-muted-foreground">→</span>
                                  <span className={`font-semibold ${bonusChanged ? 'text-green-500' : 'text-primary'}`}>
                                    {newValue} ({newBonus >= 0 ? '+' : ''}{newBonus})
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => decrementStat(stat)}
                              disabled={increment <= 0}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className={`w-8 text-center font-bold ${increment > 0 ? 'text-primary' : ''}`}>
                              +{increment}
                            </span>
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => incrementStat(stat)}
                              disabled={remainingStatPoints <= 0}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Columna derecha - Características y hechizos */}
          <div className="space-y-6">
            {/* Afinidad Secundaria */}
            {levelUpInfo.shouldChooseSecondaryAffinities && (
              <Card>
                <CardHeader>
                  <CardTitle>Afinidad Secundaria</CardTitle>
                  <CardDescription>
                    Elige un elemento como afinidad secundaria
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-2">
                    {Object.entries(ELEMENT_TRANSLATIONS).map(([key, label]) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setSelectedSecondaryAffinity(key as Element)}
                        className={`p-2 rounded-lg border text-sm transition-all ${
                          formData.selectedSecondaryAffinity === key
                            ? 'border-primary bg-primary/10'
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Habilidades Secundarias */}
            {levelUpInfo.shouldChooseSecondaryFeatures && levelUpInfo.secondaryFeatures && (
              <Card>
                <CardHeader>
                  <CardTitle>Habilidades Secundarias</CardTitle>
                  <CardDescription>
                    Selecciona nuevas habilidades secundarias
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {levelUpInfo.secondaryFeatures.map((feature) => {
                    const isSelected = formData.selectedSecondaryFeatures?.includes(feature.featureId) || false;
                    return (
                      <button
                        key={feature.featureId}
                        type="button"
                        onClick={() => toggleSecondaryFeature(feature.featureId)}
                        className={`w-full p-3 rounded-lg border text-left transition-all ${
                          isSelected
                            ? 'border-primary bg-primary/10'
                            : 'border-border hover:border-primary/50 hover:bg-accent'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">{feature.name}</h4>
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {feature.description}
                            </p>
                          </div>
                          {isSelected && (
                            <Check className="h-5 w-5 text-primary shrink-0" />
                          )}
                        </div>
                      </button>
                    );
                  })}
                </CardContent>
              </Card>
            )}

            {/* Nuevos Rasgos de Clase */}
            {levelUpInfo.features && levelUpInfo.features.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Nuevos Rasgos de Clase</CardTitle>
                  <CardDescription>
                    Rasgos que obtienes automáticamente al subir de nivel
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {levelUpInfo.features.map((feature, index) => (
                    <div
                      key={feature.featureId || index}
                      className="p-3 rounded-lg border border-border bg-muted/30"
                    >
                      <h4 className="font-medium">{feature.name}</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        {feature.description}
                      </p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Rasgos de Subclase - mostrar si ya tiene subclase o si seleccionó una */}
            {(() => {
              // Obtener los features de la subclase para el nivel actual
              let subclassFeaturesToShow = levelUpInfo.subclassFeatures || [];
              
              // Si está eligiendo subclase y seleccionó una, mostrar sus features
              if (levelUpInfo.shouldChooseSubclass && formData.selectedSubclass) {
                const selectedSubclass = levelUpInfo.subclasses?.find(s => s._id === formData.selectedSubclass);
                const subclassLevelData = selectedSubclass?.levels?.find(l => l.level === levelUpInfo.level);
                subclassFeaturesToShow = subclassLevelData?.features || [];
              }
              
              if (subclassFeaturesToShow.length === 0) return null;
              
              return (
                <Card>
                  <CardHeader>
                    <CardTitle>Rasgos de Subclase</CardTitle>
                    <CardDescription>
                      Rasgos de tu especialización que obtendrás en este nivel
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {subclassFeaturesToShow.map((feature, index) => (
                      <div
                        key={feature.featureId || index}
                        className="p-3 rounded-lg border border-border bg-muted/30"
                      >
                        <h4 className="font-medium">{feature.name}</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          {feature.description}
                        </p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              );
            })()}

            {/* Nuevos Hechizos */}
            {levelUpInfo.spells && levelUpInfo.spells.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Nuevos Hechizos</CardTitle>
                  <CardDescription>
                    Hechizos que desbloqueas este nivel
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {levelUpInfo.spells.map((spell, index) => (
                    <div
                      key={spell._id || index}
                      className="p-3 rounded-lg border border-border bg-muted/30"
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{spell.name}</h4>
                        <Badge variant="outline">{SPELL_CATEGORY_TRANSLATIONS[spell.category] || spell.category}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {spell.description}
                      </p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Footer con botón de confirmación */}
        <div className="mt-8 flex justify-end gap-4">
          <Button 
            variant="outline" 
            onClick={() => router.push(`/characters/${characterId}`)}
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={!isFormValid() || submitting}
            className="min-w-[150px]"
          >
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Subiendo de nivel...
              </>
            ) : (
              <>
                <ArrowUp className="h-4 w-4 mr-2" />
                Subir a Nivel {levelUpInfo.level}
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
