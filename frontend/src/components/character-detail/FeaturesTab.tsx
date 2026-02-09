"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { 
  Sparkles, 
  ChevronDown, 
  ChevronRight, 
  Zap, 
  Target, 
  Coins,
  Shield,
  Swords,
  Heart,
  Users,
  Move,
  CircleDot
} from "lucide-react";
import { Character, Feature, CustomFeature, Cost, Modifier, Effect } from "@/types/character";

const triggerLabels: Record<string, string> = {
  at_attack: 'Al impactar un ataque',
  at_failed_attack: 'Al fallar un ataque',
  before_attack: 'Antes de realizar un ataque',
  next_attack: 'En el próximo ataque',
  at_weapon: 'Al atacar con un arma',
  at_all_weapons: 'Al atacar con cualquier arma',
  at_opportunity_attack: 'Al realizar un ataque de oportunidad',
  at_impact_opportunity_attack: 'Al impactar un ataque de oportunidad',
  at_opportunity_critical_attack: 'Al realizar un crítico de oportunidad',
  at_critical_attack: 'Al realizar un golpe crítico',
  at_receive_critical_attack: 'Al recibir un golpe crítico',
  at_enemy_failed_attack: 'Cuando un enemigo falla un ataque',
  at_enemy_failed_receive_attack: 'Cuando un enemigo falla un ataque contra ti',
  at_receive_attack: 'Al recibir un ataque',
  at_receive_magic_attack: 'Al recibir un ataque mágico',
  before_receive_attack: 'Antes de recibir un ataque',
  before_ally_receive_attack: 'Antes de que un aliado reciba un ataque',
  at_receive_damage: 'Al recibir daño',
  at_break_shield: 'Al romper un escudo',
  at_damage: 'Al infligir daño',
  after_damage_roll: 'Después de la tirada de daño',
  at_heal: 'Al curar',
  at_apply_status_effect: 'Al aplicar un estado',
  at_remove_status_effect: 'Al eliminar un estado',
  at_apply_debuff_effect: 'Al aplicar un efecto debilitante',
  at_apply_buff_effect: 'Al aplicar un efecto beneficioso',
  at_apply_negative_effect: 'Al aplicar un efecto negativo',
  at_dispel_effect: 'Al disipar un efecto',
  at_spell: 'Al lanzar un hechizo',
  at_spell_attack: 'Al realizar un ataque con hechizo',
  next_spell: 'En el próximo hechizo',
  at_spell_cast_during_attack: 'Al lanzar un hechizo como parte de un ataque',
  at_enemy_spell_cast: 'Cuando un enemigo lanza un hechizo',
  before_save: 'Antes de realizar una tirada de salvación',
  at_failed_save: 'Al fallar una tirada de salvación',
  at_success_save: 'Al superar una tirada de salvación',
  at_ally_attack: 'Cuando un aliado ataca',
  at_ally_critical: 'Cuando un aliado realiza un golpe crítico',
  at_ally_receive_attack: 'Cuando un aliado recibe un ataque',
  at_enemy_death: 'Al derrotar a un enemigo',
  at_ally_death: 'Al morir un aliado',
  at_self_death: 'Al morir',
  at_combat_start: 'Al inicio del combate',
  at_combat_end: 'Al final del combate',
  at_turn_start: 'Al inicio de tu turno',
  at_any_turn_start: 'Al inicio de cualquier turno',
  at_turn_end: 'Al final de tu turno',
  at_any_turn_end: 'Al final de cualquier turno',
  at_round_start: 'Al inicio de la ronda',
  at_round_end: 'Al final de la ronda',
  at_zone: 'Al entrar en una zona',
  enemy_enters_range: 'Cuando un enemigo entra en tu alcance',
  at_enemy_disengage_action: 'Cuando un enemigo se desengancha',
  at_use_reaction: 'Al usar una reacción',
  at_all_out_attack: 'Al realizar un ataque total',
};

const resourceLabels: Record<string, string> = {
  'Rage Points': 'Puntos de Rabia',
  'Morale Points': 'Puntos de Ánimo',
  'reaction': 'Reacción',
  'AP': 'Puntos de Ánima',
  'HP': 'Puntos de Vida',
  'movement': 'Movimiento',
  'bonus_action': 'Acción bonus',
  'free_action': 'Acción libre',
};

const effectTypeLabels: Record<string, string> = {
  'damage': 'Daño',
  'physical_damage': 'Daño físico',
  'magical_damage': 'Daño mágico',
  'heal': 'Curación',
  'regeneration': 'Regeneración',
  'shield': 'Escudo',
  'barrier': 'Barrera',
  'status_effect': 'Estado',
  'debuff': 'Debuff',
  'buff': 'Buff',
  'movement': 'Movimiento',
  'teleport': 'Teletransporte',
  'push': 'Empujar',
  'pull': 'Atraer',
  'recover_resource': 'Recuperar recurso',
  'change_initiative': 'Cambiar iniciativa',
  'break_shield': 'Romper escudo',
  'additional_target': 'Objetivo adicional',
};

const healTypeLabels: Record<string, string> = {
  'hp': 'PV',
  'ap': 'AP',
  'temp_hp': 'PV temporales',
  'accumulative_temp_hp': 'PV temp. acumulables',
  'status_effect': 'Estado',
  'debilitation': 'Debilitación',
};

// Función para calcular expresiones con variables
const calculateExpression = (expression: string | number, proficiency: number): string | number => {
  if (typeof expression === 'number') return expression;
  if (!expression.includes('{')) return expression;
  
  // Reemplazar variables y calcular
  let result = expression;
  
  // Reemplazar {proficiency * X} o {proficiency}
  result = result.replace(/\{proficiency\s*\*\s*(\d+)\}/g, (_, multiplier) => {
    return String(proficiency * parseInt(multiplier));
  });
  result = result.replace(/\{proficiency\}/g, String(proficiency));
  
  return result;
};

// Componente para mostrar el costo
const CostBadge = ({ cost, proficiency }: { cost: Cost; proficiency: number }) => {
  const amount = calculateExpression(cost.amount, proficiency);
  const resource = cost.resource || cost.type || 'recurso';
  const resourceLabel = resourceLabels[resource] || resource;
  
  return (
    <Badge variant="destructive" className="text-xs gap-1">
      <Coins className="h-3 w-3" />
      {amount} {resourceLabel}
    </Badge>
  );
};

// Componente para mostrar modificadores
const ModifierDisplay = ({ modifier, proficiency }: { modifier: Modifier; proficiency: number }) => {
  const getValue = () => {
    const value = calculateExpression(modifier.value, proficiency);
    if (typeof value === 'number') {
      return value > 0 ? `+${value}` : value;
    }
    return value;
  };

  const getDurationText = () => {
    if (!modifier.duration) return null;
    const { duration, medition } = modifier.duration;
    const meditionLabels: Record<string, string> = {
      'rounds': 'rondas',
      'turns': 'turnos',
      'attacks': 'ataques',
      'minutes': 'minutos',
      'hours': 'horas',
      'days': 'días',
      'combat': 'combate',
      'rest': 'descanso',
    };
    return `${duration} ${meditionLabels[medition] || medition}`;
  };

  return (
    <div className="flex items-center gap-2 text-xs bg-blue-500/10 text-blue-700 dark:text-blue-300 px-2 py-1 rounded">
      <Shield className="h-3 w-3" />
      <span className="font-medium">{getValue()}</span>
      <span>{modifier.description}</span>
      {getDurationText() && (
        <span className="text-muted-foreground">({getDurationText()})</span>
      )}
    </div>
  );
};

// Componente para mostrar efectos
const EffectDisplay = ({ effect, proficiency }: { effect: Effect; proficiency: number }) => {
  const getEffectIcon = () => {
    const type = effect.type as string;
    switch (type) {
      case 'heal': 
      case 'regeneration':
        return <Heart className="h-3 w-3" />;
      case 'recover_resource': return <Zap className="h-3 w-3" />;
      case 'buff':
      case 'shield':
      case 'barrier':
        return <Shield className="h-3 w-3" />;
      case 'break_shield': 
      case 'damage':
      case 'physical_damage':
      case 'magical_damage':
        return <Swords className="h-3 w-3" />;
      case 'change_initiative': return <Users className="h-3 w-3" />;
      case 'movement':
      case 'teleport':
      case 'push':
      case 'pull':
        return <Move className="h-3 w-3" />;
      default: return <Target className="h-3 w-3" />;
    }
  };

  const getEffectDescription = () => {
    const type = effect.type as string;
    const description = effect.description as string;
    
    // Si hay descripción, calcular valores y devolver
    if (description) {
      return calculateExpression(description, proficiency);
    }
    
    // Construir descripción basada en el tipo
    const typeLabel = effectTypeLabels[type] || type;
    const healEffect = effect as { heal?: string; healType?: string; resource?: string; value?: number | string };
    
    if (healEffect.heal) {
      const healValue = calculateExpression(healEffect.heal, proficiency);
      const healType = healEffect.healType ? healTypeLabels[healEffect.healType] || healEffect.healType : '';
      return `${typeLabel}: ${healValue} ${healType}`.trim();
    }
    
    if (healEffect.value !== undefined) {
      const value = calculateExpression(healEffect.value, proficiency);
      return `${typeLabel}: ${value}`;
    }
    
    return typeLabel;
  };

  const effectDesc = getEffectDescription();
  if (!effectDesc) return null;

  return (
    <div className="flex items-center gap-2 text-xs bg-green-500/10 text-green-700 dark:text-green-300 px-2 py-1 rounded">
      {getEffectIcon()}
      <span>{effectDesc}</span>
    </div>
  );
};

// Componente para sub-features
const SubFeatureCard = ({ feature, proficiency }: { feature: Feature; proficiency: number }) => {
  const [isOpen, setIsOpen] = useState(false);
  const hasDetails = (feature.modifiers && feature.modifiers.length > 0) || 
                     (feature.effects && feature.effects.length > 0);

  return (
    <div className="p-3 bg-muted/30 rounded-lg border border-border/50 ml-4">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              {hasDetails && (
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                    {isOpen ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </Button>
                </CollapsibleTrigger>
              )}
              <h5 className="font-medium text-sm">{feature.name}</h5>
            </div>
            <div className="flex flex-wrap items-center gap-1.5 mt-1 ml-6">
              <Badge variant="outline" className="text-xs">
                {feature.useType === 'active' ? 'Activo' : 'Pasivo'}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-2 ml-6 whitespace-pre-wrap">
              {feature.description}
            </p>
          </div>
        </div>

        {hasDetails && (
          <CollapsibleContent className="mt-3 ml-6 space-y-2">
            {feature.modifiers && feature.modifiers.length > 0 && (
              <div className="space-y-1">
                <span className="text-xs font-medium text-muted-foreground">Modificadores:</span>
                <div className="flex flex-wrap gap-1">
                  {feature.modifiers.map((mod, idx) => (
                    <ModifierDisplay key={idx} modifier={mod} proficiency={proficiency} />
                  ))}
                </div>
              </div>
            )}
            {feature.effects && feature.effects.length > 0 && (
              <div className="space-y-1">
                <span className="text-xs font-medium text-muted-foreground">Efectos:</span>
                <div className="flex flex-wrap gap-1">
                  {feature.effects.map((eff, idx) => (
                    <EffectDisplay key={idx} effect={eff} proficiency={proficiency} />
                  ))}
                </div>
              </div>
            )}
          </CollapsibleContent>
        )}
      </Collapsible>
    </div>
  );
};

// Componente principal para un rasgo/feature
const FeatureCard = ({ feature, level, proficiency }: { feature: Feature | CustomFeature; level?: number; proficiency: number }) => {
  const [isOpen, setIsOpen] = useState(false);
  const isCustom = !('effects' in feature);
  const fullFeature = feature as Feature;
  
  const hasSubFeatures = !isCustom && fullFeature.subFeatures && fullFeature.subFeatures.length > 0;
  const hasModifiers = !isCustom && fullFeature.modifiers && fullFeature.modifiers.length > 0;
  const hasEffects = !isCustom && fullFeature.effects && fullFeature.effects.length > 0;
  const hasCost = !isCustom && fullFeature.cost && fullFeature.cost.length > 0;
  const hasTrigger = !isCustom && fullFeature.trigger;
  const hasDetails = hasSubFeatures || hasModifiers || hasEffects;

  const getTriggerLabel = (trigger: string | string[] | undefined) => {
    if (!trigger) return null;
    if (Array.isArray(trigger)) {
      return trigger.map(t => triggerLabels[t] || t).join(', ');
    }
    return triggerLabels[trigger] || trigger;
  };

  return (
    <div className="p-4 bg-muted/20 rounded-lg border border-border">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              {hasDetails && (
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-7 w-7 p-0 shrink-0">
                    {isOpen ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </Button>
                </CollapsibleTrigger>
              )}
              <h4 className="font-semibold">{feature.name}</h4>
              {hasSubFeatures && (
                <Badge variant="secondary" className="text-xs">
                  {fullFeature.subFeatures!.length} sub-rasgos
                </Badge>
              )}
            </div>
            
            <div className="flex flex-wrap items-center gap-2 mt-2 ml-9">
              <Badge variant="outline" className="text-xs">
                {feature.useType === 'active' ? 'Activo' : 'Pasivo'}
              </Badge>
              
              {level && (
                <Badge variant="secondary" className="text-xs">
                  Nivel {level}
                </Badge>
              )}
              
              {isCustom && (
                <Badge className="text-xs">Personalizado</Badge>
              )}
              
              {hasTrigger && (
                <Badge variant="outline" className="text-xs gap-1 bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30">
                  <Zap className="h-3 w-3" />
                  {getTriggerLabel(fullFeature.trigger)}
                </Badge>
              )}
              
              {hasCost && fullFeature.cost!.map((cost, idx) => (
                <CostBadge key={idx} cost={cost} proficiency={proficiency} />
              ))}
              
              {!isCustom && fullFeature.uses !== undefined && fullFeature.uses > 0 && (
                <Badge variant="outline" className="text-xs gap-1 bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/30">
                  <CircleDot className="h-3 w-3" />
                  {fullFeature.uses} usos
                </Badge>
              )}
            </div>
            
            <p className="text-sm text-muted-foreground mt-2 ml-9 whitespace-pre-wrap">
              {feature.description}
            </p>
          </div>
        </div>

        {hasDetails && (
          <CollapsibleContent className="mt-4 space-y-3">
            {/* Modificadores del rasgo principal */}
            {hasModifiers && (
              <div className="ml-9 space-y-1">
                <span className="text-xs font-medium text-muted-foreground">Modificadores:</span>
                <div className="flex flex-wrap gap-1">
                  {fullFeature.modifiers!.map((mod, idx) => (
                    <ModifierDisplay key={idx} modifier={mod} proficiency={proficiency} />
                  ))}
                </div>
              </div>
            )}

            {/* Efectos del rasgo principal */}
            {hasEffects && (
              <div className="ml-9 space-y-1">
                <span className="text-xs font-medium text-muted-foreground">Efectos:</span>
                <div className="flex flex-wrap gap-1">
                  {fullFeature.effects.map((eff, idx) => (
                    <EffectDisplay key={idx} effect={eff} proficiency={proficiency} />
                  ))}
                </div>
              </div>
            )}

            {/* Sub-features */}
            {hasSubFeatures && (
              <div className="ml-5 space-y-2">
                <span className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  Sub-rasgos disponibles:
                </span>
                <div className="space-y-2">
                  {fullFeature.subFeatures!.map((subFeature, idx) => (
                    <SubFeatureCard key={subFeature.featureId || idx} feature={subFeature} proficiency={proficiency} />
                  ))}
                </div>
              </div>
            )}
          </CollapsibleContent>
        )}
      </Collapsible>
    </div>
  );
};

interface FeaturesTabProps {
  character: Character;
  isOwner: boolean;
}

export function FeaturesTab({ character, isOwner }: FeaturesTabProps) {
  const router = useRouter();
  const { features } = character;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            RASGOS
          </CardTitle>
          {isOwner && (
            <Button variant="outline" size="sm" onClick={() => router.push(`/characters/${character._id}/edit`)}>
              Editar
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Clase y Recurso */}
        <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge className="text-xs">{character.class}</Badge>
              <span className="text-sm text-muted-foreground">Nivel {character.level}</span>
            </div>
            {features?.resource && (
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{resourceLabels[features.resource.name] || features.resource.name}:</span>
                <Badge variant="outline" className="text-sm gap-1 bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/30">
                  <CircleDot className="h-3 w-3" />
                  {features.resource.current ?? 0} / {features.resource.max}
                </Badge>
              </div>
            )}
          </div>
        </div>

        {/* Rasgos de clase */}
        {features?.classFeatures && features.classFeatures.length > 0 && (
          <div>
            <h3 className="font-semibold mb-3">Rasgos de Clase</h3>
            <div className="space-y-3">
              {features.classFeatures.map((feature, index) => (
                <FeatureCard key={feature.featureId || index} feature={feature} proficiency={character.proficency} />
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
                <FeatureCard key={feature.featureId || index} feature={feature} proficiency={character.proficency} />
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
                <FeatureCard key={feature.featureId || index} feature={feature} proficiency={character.proficency} />
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
                <FeatureCard key={feature.featureId || index} feature={feature} proficiency={character.proficency} />
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
  );
}
