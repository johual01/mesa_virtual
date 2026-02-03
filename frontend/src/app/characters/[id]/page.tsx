"use client"

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/hooks/useAuth";
import { useCharacter } from "@/hooks/useCharacters";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Edit, 
  Loader2, 
  User, 
  Shield, 
  Swords, 
  Zap, 
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
import { CharacterState, Spell, Feature, CustomFeature } from "@/types/character";
import { usePageTitle } from "@/hooks/usePageTitle";
import { useNotificationContext } from "@/context/notifications";

// Traducciones
const statTranslations: Record<string, string> = {
  courage: "Coraje",
  dexterity: "Destreza",
  instincts: "Instintos",
  knowledge: "Conocimiento",
  charisma: "Carisma"
};

const statAbbreviations: Record<string, string> = {
  courage: "COR",
  dexterity: "DES",
  instincts: "INS",
  knowledge: "CON",
  charisma: "CAR"
};

const secondaryAbilityTranslations: Record<string, string> = {
  acrobatics: "Acrobacias",
  art: "Arte",
  athletics: "Atletismo",
  consciousness: "Consciencia",
  empathy: "Empatía",
  expression: "Expresión",
  folklore: "Folklore",
  handcraft: "Artesanía",
  investigation: "Investigación",
  meditation: "Meditación",
  mysticism: "Misticismo",
  orientation: "Orientación",
  quibble: "Subterfugio",
  reflexes: "Reflejos",
  speed: "Velocidad",
  stealth: "Sigilo",
  strength: "Fuerza",
  technology: "Tecnología",
  streetwise: "Callejeo",
  willpower: "Voluntad"
};

const elementTranslations: Record<string, string> = {
  fire: "Fuego",
  ice: "Hielo",
  elec: "Eléctrico",
  wind: "Viento",
  psy: "Psíquico",
  nuke: "Nuclear",
  bless: "Bendición",
  curse: "Maldición",
  almighty: "Todopoderoso",
  slash: "Corte",
  strike: "Golpe",
  pierce: "Perforación"
};

const spellCategoryTranslations: Record<string, string> = {
  attack: "Ataque",
  buff: "Mejora",
  debuff: "Debilitación",
  heal: "Curación",
  shield: "Escudo",
  counter: "Contraataque",
  utility: "Utilidad",
  summoning: "Invocación"
};

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

// Componente para mostrar un modificador con formato
const ModifierDisplay = ({ value, showSign = true }: { value: number; showSign?: boolean }) => {
  const displayValue = showSign && value >= 0 ? `+${value}` : `${value}`;
  return (
    <span className={value >= 0 ? "text-green-500" : "text-red-500"}>
      {displayValue}
    </span>
  );
};

// Componente para mostrar una estadística principal
const StatBlock = ({ abbr, value, modifier, isProficient }: { 
  abbr: string; 
  value: number; 
  modifier: number;
  isProficient: boolean;
}) => (
  <div className="flex flex-col items-center p-3 bg-muted/30 rounded-lg border border-border min-w-[80px]">
    <span className="text-xs text-muted-foreground uppercase tracking-wider">{abbr}</span>
    <span className="text-2xl font-bold">
      <ModifierDisplay value={modifier} />
    </span>
    <span className="text-sm text-muted-foreground">{value}</span>
    {isProficient && (
      <div className="w-2 h-2 rounded-full bg-primary mt-1" title="Competente en salvación" />
    )}
  </div>
);

// Componente para stat de combate grande
const CombatStatBlock = ({ label, value, sublabel }: { 
  label: string; 
  value: number | string; 
  sublabel?: string;
}) => (
  <div className="flex flex-col items-center p-3 bg-muted/30 rounded-lg border border-border">
    <span className="text-xs text-muted-foreground uppercase tracking-wider">{label}</span>
    <span className="text-2xl font-bold">{value}</span>
    {sublabel && <span className="text-xs text-muted-foreground">{sublabel}</span>}
  </div>
);

// Componente para habilidad secundaria
const SecondaryAbilityRow = ({ 
  name, 
  stat, 
  bonus, 
  isProficient,
  proficiencyBonus
}: { 
  name: string; 
  stat: string; 
  bonus: number;
  isProficient: boolean;
  proficiencyBonus: number;
}) => {
  const totalBonus = bonus + (isProficient ? proficiencyBonus : 0);
  return (
    <div className="flex items-center justify-between py-1 px-2 hover:bg-muted/30 rounded">
      <div className="flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${isProficient ? 'bg-primary' : 'bg-muted-foreground/30'}`} />
        <span className="text-sm">
          {secondaryAbilityTranslations[name] || name} 
          <span className="text-muted-foreground text-xs ml-1">({statAbbreviations[stat]})</span>
        </span>
      </div>
      <span className="font-mono text-sm">
        <ModifierDisplay value={totalBonus} />
      </span>
    </div>
  );
};

// Componente para tirada de salvación
const SavingThrowRow = ({ 
  name, 
  modifier, 
  isProficient,
  proficiencyBonus
}: { 
  name: string; 
  modifier: number;
  isProficient: boolean;
  proficiencyBonus: number;
}) => {
  const total = modifier + (isProficient ? proficiencyBonus : 0);
  return (
    <div className="flex items-center justify-between py-1 px-2 hover:bg-muted/30 rounded">
      <div className="flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${isProficient ? 'bg-primary' : 'bg-muted-foreground/30'}`} />
        <span className="text-sm">{statTranslations[name]} ({statAbbreviations[name]})</span>
      </div>
      <span className="font-mono text-sm">
        <ModifierDisplay value={total} />
      </span>
    </div>
  );
};

// Componente para elemento con badge
const ElementBadge = ({ element, type }: { element: string; type: 'affinity' | 'resistance' | 'weakness' | 'immunity' | 'reflection' }) => {
  const colorMap: Record<string, string> = {
    affinity: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    resistance: 'bg-green-500/20 text-green-400 border-green-500/30',
    weakness: 'bg-red-500/20 text-red-400 border-red-500/30',
    immunity: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    reflection: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
  };
  
  return (
    <Badge variant="outline" className={`${colorMap[type]} text-xs`}>
      {elementTranslations[element] || element}
    </Badge>
  );
};

// Componente para un conjuro
const SpellCard = ({ spell }: { spell: Spell }) => {
  const costDisplay = spell.cost?.map(c => `${c.amount} ${c.resource || 'AP'}`).join(', ') || 'Gratis';
  
  return (
    <div className="p-3 bg-muted/20 rounded-lg border border-border hover:border-primary/50 transition-colors">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h4 className="font-semibold text-sm">{spell.name}</h4>
            {spell.concentration && (
              <Badge variant="outline" className="text-xs">Concentración</Badge>
            )}
          </div>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="secondary" className="text-xs">
              {spellCategoryTranslations[spell.category] || spell.category}
            </Badge>
            <span className="text-xs text-muted-foreground">Coste: {costDisplay}</span>
          </div>
        </div>
      </div>
      <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{spell.description}</p>
    </div>
  );
};

// Componente para un rasgo/feature
const FeatureCard = ({ feature, level }: { feature: Feature | CustomFeature; level?: number }) => {
  const isCustom = !('effects' in feature);
  
  return (
    <div className="p-4 bg-muted/20 rounded-lg border border-border">
      <div className="flex items-start justify-between">
        <div>
          <h4 className="font-semibold">{feature.name}</h4>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="outline" className="text-xs">
              {feature.useType === 'active' ? 'Activo' : 'Pasivo'}
            </Badge>
            {level && <Badge variant="secondary" className="text-xs">Nivel {level}</Badge>}
            {isCustom && <Badge className="text-xs">Personalizado</Badge>}
          </div>
        </div>
      </div>
      <p className="text-sm text-muted-foreground mt-2 whitespace-pre-wrap">{feature.description}</p>
    </div>
  );
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

  // Extraer datos del personaje
  const { stats, secondaryAbilities, combatData, background, features } = character;
  const elements = combatData?.magicalStats?.elements as {
    affinity?: string;
    resistance?: string[];
    weakness?: string[];
    immunity?: string[];
    reflection?: string[];
  } | undefined;

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
          <TabsList className="w-full justify-start overflow-x-auto mb-4 bg-muted/50">
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Columna izquierda */}
              <div className="space-y-6">
                {/* Características */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Shield className="h-5 w-5" />
                      CARACTERÍSTICAS
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-3 justify-center">
                      {stats && Object.entries(stats).map(([key, stat]) => (
                        <StatBlock
                          key={key}
                          abbr={statAbbreviations[key]}
                          value={stat.value}
                          modifier={stat.bonus}
                          isProficient={stat.isProficient}
                        />
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Stats de combate */}
                <Card>
                  <CardContent className="pt-4">
                    <div className="grid grid-cols-5 gap-2">
                      <CombatStatBlock 
                        label="PUNTOS" 
                        value={combatData?.defensiveStats?.HP?.total || 0}
                        sublabel="DE GOLPE"
                      />
                      <CombatStatBlock 
                        label="INICIATIVA" 
                        value={`+${combatData?.fisicalStats?.initiative?.total || 0}`}
                      />
                      <CombatStatBlock 
                        label="VELOCIDAD" 
                        value={combatData?.fisicalStats?.speed?.total || 0}
                        sublabel="CASILLAS"
                      />
                      <CombatStatBlock 
                        label="CLASE DE" 
                        value={combatData?.defensiveStats?.defense?.total || 10}
                        sublabel="ARMADURA"
                      />
                      <CombatStatBlock 
                        label="BONIF." 
                        value={`+${character.proficency}`}
                        sublabel="COMPETENCIA"
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Tiradas de salvación */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">TIRADAS DE SALVACIÓN</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-x-4">
                      <div className="text-sm font-semibold text-muted-foreground mb-1">Nombre</div>
                      <div className="text-sm font-semibold text-muted-foreground mb-1 text-right">Total</div>
                      {stats && Object.entries(stats).map(([key, stat]) => (
                        <SavingThrowRow
                          key={key}
                          name={key}
                          modifier={stat.bonus}
                          isProficient={stat.isProficient}
                          proficiencyBonus={character.proficency}
                        />
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Stats mágicos */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Zap className="h-5 w-5" />
                      ESTADÍSTICAS MÁGICAS
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <CombatStatBlock 
                        label="PUNTOS DE ÁNIMA" 
                        value={combatData?.magicalStats?.AP?.total || 0}
                      />
                      <CombatStatBlock 
                        label="DEFENSA MÁGICA" 
                        value={combatData?.defensiveStats?.magicDefense?.total || 10}
                      />
                      <CombatStatBlock 
                        label="LANZAMIENTO" 
                        value={`+${combatData?.magicalStats?.magicLaunch?.total || 0}`}
                      />
                      <CombatStatBlock 
                        label="SALVACIÓN" 
                        value={combatData?.magicalStats?.magicSave?.total || 10}
                      />
                      <CombatStatBlock 
                        label="CURACIÓN" 
                        value={`+${combatData?.magicalStats?.magicHealing?.total || 0}`}
                      />
                      <CombatStatBlock 
                        label="DAÑO MÁGICO" 
                        value={`+${combatData?.magicalStats?.magicDamage?.total || 0}`}
                      />
                    </div>

                    {/* Elementos */}
                    {elements && (
                      <div className="space-y-2 pt-2 border-t border-border">
                        {elements.affinity && (
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground w-24">Afinidad:</span>
                            <ElementBadge element={elements.affinity} type="affinity" />
                          </div>
                        )}
                        {elements.resistance && elements.resistance.length > 0 && (
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm text-muted-foreground w-24">Resistencia:</span>
                            {elements.resistance.map(el => (
                              <ElementBadge key={el} element={el} type="resistance" />
                            ))}
                          </div>
                        )}
                        {elements.weakness && elements.weakness.length > 0 && (
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm text-muted-foreground w-24">Debilidad:</span>
                            {elements.weakness.map(el => (
                              <ElementBadge key={el} element={el} type="weakness" />
                            ))}
                          </div>
                        )}
                        {elements.immunity && elements.immunity.length > 0 && (
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm text-muted-foreground w-24">Inmunidad:</span>
                            {elements.immunity.map(el => (
                              <ElementBadge key={el} element={el} type="immunity" />
                            ))}
                          </div>
                        )}
                        {elements.reflection && elements.reflection.length > 0 && (
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm text-muted-foreground w-24">Reflejo:</span>
                            {elements.reflection.map(el => (
                              <ElementBadge key={el} element={el} type="reflection" />
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Columna derecha - Habilidades */}
              <div className="space-y-6">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Swords className="h-5 w-5" />
                      HABILIDADES
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {secondaryAbilities && Object.entries(secondaryAbilities).map(([key, value]) => {
                      const ability = value as { statistic: string; bonus: number; isProficient: boolean };
                      return (
                        <SecondaryAbilityRow
                          key={key}
                          name={key}
                          stat={ability.statistic}
                          bonus={ability.bonus}
                          isProficient={ability.isProficient}
                          proficiencyBonus={character.proficency}
                        />
                      );
                    })}
                  </CardContent>
                </Card>

                {/* Acciones de combate */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">ACCIONES DE COMBATE</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-3">
                      <CombatStatBlock 
                        label="ACCIONES" 
                        value={combatData?.actions?.actions?.total || 1}
                      />
                      <CombatStatBlock 
                        label="BONUS" 
                        value={combatData?.actions?.bonusActions?.total || 1}
                      />
                      <CombatStatBlock 
                        label="REACCIONES" 
                        value={combatData?.actions?.reactions?.total || 1}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Stats de ataque físico */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">MODIFICADORES FÍSICOS</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex justify-between items-center py-1 px-2">
                        <span className="text-sm">Ataque Cuerpo a Cuerpo</span>
                        <span className="font-mono">
                          <ModifierDisplay value={combatData?.fisicalStats?.meleeAttackModifiers?.total || 0} />
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-1 px-2">
                        <span className="text-sm">Ataque a Distancia</span>
                        <span className="font-mono">
                          <ModifierDisplay value={combatData?.fisicalStats?.rangeAttackModifiers?.total || 0} />
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-1 px-2">
                        <span className="text-sm">Daño Cuerpo a Cuerpo</span>
                        <span className="font-mono">
                          <ModifierDisplay value={combatData?.fisicalStats?.meleeDamageModifiers?.total || 0} />
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-1 px-2">
                        <span className="text-sm">Daño a Distancia</span>
                        <span className="font-mono">
                          <ModifierDisplay value={combatData?.fisicalStats?.rangeDamageModifiers?.total || 0} />
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-1 px-2 col-span-2">
                        <span className="text-sm">Daño Crítico</span>
                        <span className="font-mono">
                          <ModifierDisplay value={combatData?.fisicalStats?.criticalDamageModifiers?.total || 0} />
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Críticos */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">PROBABILIDADES CRÍTICAS</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex justify-between items-center py-1 px-2">
                        <span className="text-sm">Crítico General</span>
                        <span className="font-mono text-green-500">
                          {Math.round((combatData?.critical?.critical?.total || 0.05) * 100)}%
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-1 px-2">
                        <span className="text-sm">Fallo Crítico</span>
                        <span className="font-mono text-red-500">
                          {Math.round((combatData?.critical?.criticalFail?.total || 0.05) * 100)}%
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-1 px-2">
                        <span className="text-sm">Crítico Físico</span>
                        <span className="font-mono text-green-500">
                          {Math.round((combatData?.critical?.criticalOnFisical?.total || 0.05) * 100)}%
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-1 px-2">
                        <span className="text-sm">Crítico Mágico</span>
                        <span className="font-mono text-green-500">
                          {Math.round((combatData?.critical?.criticalOnMagic?.total || 0.05) * 100)}%
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Tab Trasfondo */}
          <TabsContent value="backstory" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    TRASFONDO
                  </CardTitle>
                  {isOwner && (
                    <Button variant="outline" size="sm" onClick={() => router.push(`/characters/${characterId}/edit`)}>
                      Editar
                    </Button>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  Cada personaje tiene una historia. Aquí se cuenta la de {character.name}.
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Columna izquierda */}
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Detalles</h3>
                      
                      <div className="mb-4">
                        <span className="font-semibold">Persona.</span>{' '}
                        <span className="text-muted-foreground">{character.persona}</span>
                      </div>

                      {background?.history && (
                        <div className="mb-4">
                          <span className="font-semibold">Historia.</span>{' '}
                          <span className="text-muted-foreground whitespace-pre-wrap">{background.history}</span>
                        </div>
                      )}

                      {background?.personality && (
                        <div className="mb-4">
                          <span className="font-semibold">Personalidad.</span>{' '}
                          <span className="text-muted-foreground whitespace-pre-wrap">{background.personality}</span>
                        </div>
                      )}

                      {background?.appearance && (
                        <div className="mb-4">
                          <span className="font-semibold">Apariencia.</span>{' '}
                          <span className="text-muted-foreground whitespace-pre-wrap">{background.appearance}</span>
                        </div>
                      )}

                      {background?.traits && (
                        <div className="mb-4">
                          <span className="font-semibold">Rasgos.</span>{' '}
                          <span className="text-muted-foreground whitespace-pre-wrap">{background.traits}</span>
                        </div>
                      )}

                      {background?.defects && (
                        <div className="mb-4">
                          <span className="font-semibold">Defectos.</span>{' '}
                          <span className="text-muted-foreground whitespace-pre-wrap">{background.defects}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Columna derecha */}
                  <div className="space-y-6">
                    {background?.ideals && (
                      <div className="mb-4">
                        <span className="font-semibold">Ideales.</span>{' '}
                        <span className="text-muted-foreground whitespace-pre-wrap">{background.ideals}</span>
                      </div>
                    )}

                    {background?.dreams && (
                      <div className="mb-4">
                        <span className="font-semibold">Sueños.</span>{' '}
                        <span className="text-muted-foreground whitespace-pre-wrap">{background.dreams}</span>
                      </div>
                    )}

                    {background?.bonds && (
                      <div className="mb-4">
                        <span className="font-semibold">Vínculos.</span>{' '}
                        <span className="text-muted-foreground whitespace-pre-wrap">{background.bonds}</span>
                      </div>
                    )}

                    {background?.trauma && (
                      <div className="mb-4">
                        <span className="font-semibold">Traumas/Miedos.</span>{' '}
                        <span className="text-muted-foreground whitespace-pre-wrap">{background.trauma}</span>
                      </div>
                    )}

                    {/* Imagen del personaje */}
                    {character.pictureRoute && (
                      <div className="relative w-full aspect-[3/4] rounded-lg overflow-hidden border border-border">
                        <Image
                          src={character.pictureRoute}
                          alt={character.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab Rasgos */}
          <TabsContent value="features" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5" />
                    RASGOS
                  </CardTitle>
                  {isOwner && (
                    <Button variant="outline" size="sm" onClick={() => router.push(`/characters/${characterId}/edit`)}>
                      Editar
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Clase */}
                <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className="text-xs">{character.class}</Badge>
                    <span className="text-sm text-muted-foreground">Nivel {character.level}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Rasgos y habilidades de tu clase {character.class}.
                  </p>
                </div>

                {/* Rasgos de clase */}
                {features?.classFeatures && features.classFeatures.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-3">Rasgos de Clase</h3>
                    <div className="space-y-3">
                      {features.classFeatures.map((feature, index) => (
                        <FeatureCard key={feature.featureId || index} feature={feature} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Rasgos de subclase */}
                {features?.subclassFeatures && features.subclassFeatures.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-3">Rasgos de Subclase</h3>
                    <div className="space-y-3">
                      {features.subclassFeatures.map((feature, index) => (
                        <FeatureCard key={feature.featureId || index} feature={feature} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Rasgos de objetos */}
                {features?.itemFeatures && features.itemFeatures.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-3">Rasgos de Objetos</h3>
                    <div className="space-y-3">
                      {features.itemFeatures.map((feature, index) => (
                        <FeatureCard key={feature.featureId || index} feature={feature} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Rasgos personalizados */}
                {features?.customFeatures && features.customFeatures.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-3">Rasgos Personalizados</h3>
                    <div className="space-y-3">
                      {features.customFeatures.map((feature, index) => (
                        <FeatureCard key={feature.featureId || index} feature={feature} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Mensaje si no hay rasgos */}
                {(!features?.classFeatures?.length && 
                  !features?.subclassFeatures?.length && 
                  !features?.itemFeatures?.length && 
                  !features?.customFeatures?.length) && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Sparkles className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>Este personaje aún no tiene rasgos.</p>
                    <p className="text-sm">Los rasgos se obtienen al subir de nivel o mediante objetos especiales.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab Equipo */}
          <TabsContent value="equipment" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    EQUIPO E INVENTARIO
                  </CardTitle>
                  {isOwner && (
                    <Button variant="outline" size="sm" onClick={() => router.push(`/characters/${characterId}/edit`)}>
                      Editar
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {/* Dinero */}
                <div className="flex items-center gap-4 mb-6 p-3 bg-muted/30 rounded-lg">
                  <span className="font-semibold">Dinero:</span>
                  <span className="text-xl font-bold text-yellow-500">{character.money} ¥</span>
                </div>

                {/* Lista de equipo */}
                {character.characterInventory && character.characterInventory.length > 0 ? (
                  <div className="space-y-3">
                    {character.characterInventory.map((item) => (
                      <div 
                        key={item._id} 
                        className={`p-3 rounded-lg border ${item.equipped ? 'bg-primary/5 border-primary/30' : 'bg-muted/20 border-border'}`}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-semibold">{item.equipmentName}</h4>
                              {item.equipped && <Badge variant="default" className="text-xs">Equipado</Badge>}
                              <Badge variant="outline" className="text-xs">{item.type}</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                          </div>
                          <span className="text-sm text-muted-foreground">x{item.quantity}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Package className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>Este personaje no tiene objetos en su inventario.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab Conjuros */}
          <TabsContent value="spells" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Scroll className="h-5 w-5" />
                    CONJUROS Y HABILIDADES
                  </CardTitle>
                  {isOwner && (
                    <Button variant="outline" size="sm" onClick={() => router.push(`/characters/${characterId}/edit`)}>
                      Editar
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Stats rápidos de magia */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-3 bg-muted/30 rounded-lg">
                  <div className="text-center">
                    <span className="text-xs text-muted-foreground">AP Máximo</span>
                    <p className="text-xl font-bold text-blue-500">{combatData?.magicalStats?.AP?.total || 0}</p>
                  </div>
                  <div className="text-center">
                    <span className="text-xs text-muted-foreground">Lanzamiento</span>
                    <p className="text-xl font-bold">+{combatData?.magicalStats?.magicLaunch?.total || 0}</p>
                  </div>
                  <div className="text-center">
                    <span className="text-xs text-muted-foreground">Salvación</span>
                    <p className="text-xl font-bold">{combatData?.magicalStats?.magicSave?.total || 10}</p>
                  </div>
                  <div className="text-center">
                    <span className="text-xs text-muted-foreground">Curación</span>
                    <p className="text-xl font-bold text-green-500">+{combatData?.magicalStats?.magicHealing?.total || 0}</p>
                  </div>
                </div>

                {/* Lista de conjuros */}
                {combatData?.magicalStats?.spells?.list && combatData.magicalStats.spells.list.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-3">Conjuros Conocidos</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {combatData.magicalStats.spells.list.map((spell) => (
                        <SpellCard key={spell._id} spell={spell} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Lista de conjuros gratuitos */}
                {combatData?.magicalStats?.spells?.freeList && combatData.magicalStats.spells.freeList.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-3">Conjuros Gratuitos</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {combatData.magicalStats.spells.freeList.map((spell) => (
                        <SpellCard key={spell._id} spell={spell} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Lista de conjuros adicionales */}
                {combatData?.magicalStats?.spells?.additionalList && combatData.magicalStats.spells.additionalList.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-3">Conjuros Adicionales</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {combatData.magicalStats.spells.additionalList.map((spell) => (
                        <SpellCard key={spell._id} spell={spell} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Mensaje si no hay conjuros */}
                {(!combatData?.magicalStats?.spells?.list?.length && 
                  !combatData?.magicalStats?.spells?.freeList?.length && 
                  !combatData?.magicalStats?.spells?.additionalList?.length) && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Scroll className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>Este personaje aún no tiene conjuros.</p>
                    <p className="text-sm">Los conjuros se aprenden al crear el personaje o subir de nivel.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
