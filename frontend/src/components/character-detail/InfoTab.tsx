"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Swords, Zap } from "lucide-react";
import { Character } from "@/types/character";

// Traducciones
const statAbbreviations: Record<string, string> = {
  courage: "COR",
  dexterity: "DES",
  instincts: "INS",
  knowledge: "CON",
  charisma: "CAR"
};

const statTranslations: Record<string, string> = {
  courage: "Coraje",
  dexterity: "Destreza",
  instincts: "Instintos",
  knowledge: "Conocimiento",
  charisma: "Carisma"
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

// Componente para mostrar un modificador con formato
const ModifierDisplay = ({ value, showSign = true }: { value: number; showSign?: boolean }) => {
  const displayValue = showSign && value >= 0 ? `+${value}` : `${value}`;
    return (
      <span className={value >= 0 ? "text-green-600 font-bold" : "text-red-500 font-bold"}>
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
    resistance: 'bg-green-600/30 text-green-300 border-green-600/40',
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

interface InfoTabProps {
  character: Character;
}

export function InfoTab({ character }: InfoTabProps) {
  const { stats, secondaryAbilities, combatData } = character;
  const elements = combatData?.magicalStats?.elements as {
    affinity?: string;
    resistance?: string[];
    weakness?: string[];
    immunity?: string[];
    reflection?: string[];
  } | undefined;

  return (
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
                <span className="font-mono text-green-600 font-bold">
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
                <span className="font-mono text-green-600 font-bold">
                  {Math.round((combatData?.critical?.criticalOnFisical?.total || 0.05) * 100)}%
                </span>
              </div>
              <div className="flex justify-between items-center py-1 px-2">
                <span className="text-sm">Crítico Mágico</span>
                <span className="font-mono text-green-600 font-bold">
                  {Math.round((combatData?.critical?.criticalOnMagic?.total || 0.05) * 100)}%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
