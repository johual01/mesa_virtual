export enum CharacterState {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  DELETED = 'DELETED',
  DEAD = 'DEAD',
  NON_PLAYER = 'NON_PLAYER'
}

export enum System {
  PERSONAD20 = 'PERSONAD20'
}

// Enums según documentación
export enum Element {
  PSY = 'psy',
  NUKE = 'nuke',
  FIRE = 'fire',
  ICE = 'ice',
  ELEC = 'elec',
  WIND = 'wind',
  CURSE = 'curse',
  BLESS = 'bless',
  ALMIGHTY = 'almighty',
  SLASH = 'slash',
  STRIKE = 'strike',
  PIERCE = 'pierce'
}

export enum PersonaStadistic {
  KNOWLEDGE = 'knowledge',
  INSTINCTS = 'instincts',
  DEXTERITY = 'dexterity',
  COURAGE = 'courage',
  CHARISMA = 'charisma'
}

export enum PersonaSecondaryAbility {
  ACROBATICS = 'acrobatics',
  ART = 'art',
  ATHLETICS = 'athletics',
  CONSCIOUSNESS = 'consciousness',
  EMPATHY = 'empathy',
  EXPRESSION = 'expression',
  FOLKLORE = 'folklore',
  HANDCRAFT = 'handcraft',
  INVESTIGATION = 'investigation',
  MEDITATION = 'meditation',
  MYSTICISM = 'mysticism',
  ORIENTATION = 'orientation',
  QUIBBLE = 'quibble',
  REFLEXES = 'reflexes',
  SPEED = 'speed',
  STEALTH = 'stealth',
  STRENGTH = 'strength',
  TECHNOLOGY = 'technology',
  STREETWISE = 'streetwise',
  WILLPOWER = 'willpower'
}

export enum UseType {
  ACTIVE = 'active',
  PASSIVE = 'passive'
}

export enum EquipmentType {
  WEAPON = 'weapon',
  ARMOR = 'armor',
  ACCESORY = 'accesory',
  CONSUMIBLE = 'consumible',
  OTHER = 'other'
}

export enum WeaponCategory {
  SIMPLE = 'simple',
  MARTIAL = 'martial',
  EXOTIC = 'exotic',
  FIRE_WEAPONS = 'fire_weapons'
}

export enum ArmorCategory {
  ARMOR = 'armor',
  SHIELD = 'shield',
  DODGE = 'dodge',
  MAGICAL = 'magical'
}

export enum SpellCategory {
  ATTACK = 'attack',
  BUFF = 'buff',
  DEBUFF = 'debuff',
  HEAL = 'heal',
  SHIELD = 'shield',
  COUNTER = 'counter',
  UTILITY = 'utility',
  SUMMONING = 'summoning'
}

export enum TargetType {
  SELF = 'self',
  ALLY = 'ally',
  ENEMY = 'enemy',
  ENEMIES_AT_RANGE = 'enemies_at_range',
  ALLIES_AT_RANGE = 'allies_at_range',
  ALL_ENEMIES = 'all_enemies',
  ALL_ALLIES = 'all_allies',
  ONLY_ALLY = 'only_ally',
  ALLIES_ATTACKING_TARGET = 'allies_attacking_target',
  ALL = 'all'
}

export enum RangeType {
  MELEE = 'melee',
  RANGED = 'ranged',
  SELF = 'self',
  ALL = 'all'
}

export type TriggerType = string;

// Interfaces según documentación
export interface Backstory {
  history: string;
  personality: string;
  appearance: string;
  traits: string;
  defects: string;
  ideals: string;
  dreams: string;
  bonds: string;
  trauma: string;
}

export interface Inspiration {
  reroll: boolean;
  bonus: number;
  critic: boolean;
  automaticSuccess: boolean;
}

export interface Duration {
  type: 'temporal' | 'permanent' | 'instant' | 'concentration';
  duration: number;
  medition: 'rounds' | 'turns' | 'attacks' | 'minutes' | 'hours' | 'days' | 'combat' | 'rest';
}

export interface Range {
  type: RangeType;
  range?: number;
  shape?: string;
}

export interface Cost {
  amount: string | number;
  type?: 'temporal' | 'permanent';
  resource?: string;
}

export interface SpellCost {
  type: 'AP' | 'HP' | 'AP and HP';
  AP?: number;
  HP?: number;
}

export interface Modifier {
  value: number | string;
  type: string;
  description: string;
  permanent?: boolean;
  origin?: string;
  featureId?: string;
  addTo?: string | string[];
  target?: TargetType;
  duration?: Duration;
  stadistic?: PersonaStadistic;
  replaceStadistic?: PersonaStadistic;
  trigger?: TriggerType | TriggerType[];
  shouldSaveEachTurn?: boolean;
  state: 'ACTIVE' | 'INACTIVE';
  modifierId?: string;
  damageType?: Element;
  dice?: string;
}

export interface Effect {
  [key: string]: unknown;
}

export interface Feature {
  featureId: string;
  name: string;
  description: string;
  useType: UseType;
  action?: string;
  alternativeAction?: string;
  modifiers?: Modifier[];
  trigger?: TriggerType | TriggerType[];
  condition?: string;
  cost?: Cost[];
  alternativeCost?: Cost[];
  range?: Range;
  target?: TargetType;
  duration?: Duration;
  uses?: number;
  origin?: string;
  state?: 'ACTIVE' | 'INACTIVE';
  effects: Effect[];
  subFeatures?: Feature[];
}

export interface CustomFeature {
  featureId: string;
  name: string;
  description: string;
  useType: UseType;
}

export interface Spell {
  _id: string;
  name: string;
  system: System;
  custom?: boolean;
  owner?: string;
  cost?: Cost[];
  alternativeCost?: Cost[];
  action?: string;
  alternativeAction?: string;
  useType: UseType;
  category: SpellCategory | string;
  description: string;
  trigger?: TriggerType;
  concentration: boolean;
  effects?: Effect[];
  modifiers?: Modifier[];
  toList?: 'list' | 'free' | 'additional';
  state: 'ACTIVE' | 'INACTIVE' | 'DELETED';
}

export interface Spells {
  list: Spell[];
  freeList: Spell[];
  additionalList: Spell[];
  preparedList: Spell[];
  maxPrepared: number;
}

export interface WeaponProperties {
  attack: {
    proficiency: PersonaStadistic | 'none';
    bonus: number;
  };
  target: TargetType;
  range: Range;
  damageType: Element;
  damage: string;
  critical: string;
  alternativeDamage: string;
  alternativeCritical: string;
  ammunition?: string;
  twoHanded: boolean;
  light: boolean;
  finesse: boolean;
  versatile: boolean;
  heavy: boolean;
  loading: boolean;
  reach: boolean;
  thrown: boolean;
}

export interface CharacterEquipment {
  _id: string;
  character: string;
  state: string;
  equipmentName: string;
  description: string;
  type: EquipmentType;
  category: string;
  equipped: boolean;
  proficiency: PersonaStadistic | 'none';
  canAttack: boolean;
  provideDefense: boolean;
  quantity: number;
  properties?: WeaponProperties | Effect;
  modifiers?: Modifier[];
  additionalProperties?: Feature[];
}

export interface Item {
  _id: string;
  name: string;
  description: string;
  type: EquipmentType;
  category: string;
}

export interface StatValue {
  value: number;
  bonus: number;
  isProficient: boolean;
}

export interface ModifierStat {
  total: number;
  modifiers: Modifier[];
}

export interface Character {
  _id: string;
  name: string;
  state: CharacterState;
  system: System;
  pictureRoute?: string;
  class: string;
  subclass?: string;
  level: number;
  persona: string;
  experience: number;
  money: number;
  proficency: number;
  element?: Element;
  weakness?: Element;
  stats: {
    courage: StatValue;
    dexterity: StatValue;
    instincts: StatValue;
    knowledge: StatValue;
    charisma: StatValue;
  };
  secondaryAbilities: Record<string, unknown>;
  background: Backstory;
  features: {
    classFeatures: Feature[];
    subclassFeatures: Feature[];
    itemFeatures: Feature[];
    customFeatures: CustomFeature[];
  };
  characterInventory: CharacterEquipment[];
  inspiration: Inspiration;
  combatData: {
    defensiveStats: {
      HP: ModifierStat;
      defense: ModifierStat;
      magicDefense: ModifierStat;
    };
    fisicalStats: {
      speed: ModifierStat;
      initiative: ModifierStat;
      rangeAttackModifiers: ModifierStat;
      meleeAttackModifiers: ModifierStat;
      rangeDamageModifiers: ModifierStat;
      meleeDamageModifiers: ModifierStat;
      criticalDamageModifiers: ModifierStat;
    };
    magicalStats: {
      elements: Record<string, unknown>;
      AP: ModifierStat;
      magicSave: ModifierStat;
      magicLaunch: ModifierStat;
      magicHealing: ModifierStat;
      magicDamage: ModifierStat;
      spells: Spells;
    };
    actions: {
      actions: ModifierStat;
      bonusActions: ModifierStat;
      reactions: ModifierStat;
    };
    critical: {
      critical: ModifierStat;
      criticalFail: ModifierStat;
      criticalOnFisical: ModifierStat;
      criticalOnMagic: ModifierStat;
    };
    resource: { name: string };
  };
}

export interface CharacterSummary {
  _id: string;
  name: string;
  system: System;
  state: CharacterState;
  pictureRoute?: string;
  characterData: {
    class: object;
    level: number;
  };
}

export interface Stadistics {
  courage: number;
  dexterity: number;
  instincts: number;
  knowledge: number;
  charisma: number;
}

export interface CreateCharacterData {
  name: string;
  system: System;
  state: CharacterState;
  backstory: Backstory;
  pictureRoute?: string;
  characterClass: string;
  persona: string;
  money: number;
  stadistics: Stadistics;
  proficency: string[];
  element: Element;
  weakness: Element;
}

export interface EditCharacterData {
  name: string;
  state: CharacterState;
  backstory: Backstory;
  pictureRoute?: string;
  persona: string;
  money: number;
  stadistics: Stadistics;
  proficency: string[];
  element: Element;
  weakness: Element;
}

export interface PersonaClass {
  _id: string;
  name: string;
  description: string;
}

export interface SubclassLevel {
  level: number;
  features: Feature[];
}

export interface PersonaSubclass {
  _id: string;
  name: string;
  description: string;
  levels: SubclassLevel[];
}

export interface CharacterCreateInfo {
  elements: string[];
  states: string[];
  secondaryAbilities: string[];
  campaigns: Array<{
    _id: string;
    name: string;
  }>;
  classes: PersonaClass[];
  translations: {
    elements: Record<string, string>;
    states: Record<string, string>;
    secondaryAbilities: Record<string, string>;
    statistics: Record<string, string>;
  };
}

export interface LevelUpInfo {
  level: number;
  HPDice: string;
  features: Feature[];
  spells: Spell[];
  subclassFeatures: Feature[];
  shouldChooseSubclass: boolean;
  shouldChooseSecondaryFeatures: boolean;
  shouldChooseSecondaryAffinities: boolean;
  shouldChooseStatImprovement: boolean;
  subclasses?: PersonaSubclass[];
  secondaryFeatures?: Feature[];
}

export interface LevelUpData {
  newHP: number;
  selectedSubclass?: string;
  selectedSecondaryFeatures?: string[];
  selectedSecondaryAffinity?: Element;
  selectedStats?: Partial<Stadistics>;
}

export interface SecondaryFeaturesResponse {
  secondaryFeatures: Array<{
    featureId: string;
    name: string;
    description: string;
  }>;
}

export interface AddModifierData {
  value: number | string;
  type: string;
  description: string;
  addTo?: string | string[];
  target?: TargetType;
  duration?: Duration;
  stadistic?: PersonaStadistic;
  replaceStadistic?: PersonaStadistic;
}

// Tipos de respuesta de servicios - Character
export interface GetCharactersRequest {
  origin: 'user' | 'campaign';
  state?: CharacterState;
  campaignId?: string;
}

export interface GetCharactersResponse {
  characters: CharacterSummary[];
}

// Tipos de respuesta de servicios - Features
export interface ChangeFeatureStatusData {
  status: 'active' | 'inactive';
}

export interface AddCustomFeatureData {
  name: string;
  description: string;
  useType: UseType;
}

export interface EditCustomFeatureData {
  name: string;
  description: string;
  useType: UseType;
}

export interface CustomFeatureResponse {
  message: string;
  feature: CustomFeature;
}

// Tipos de respuesta de servicios - Spells
export interface AddCustomSpellData {
  name: string;
  cost: SpellCost;
  useType: UseType;
  category: SpellCategory;
  description: string;
  concentration: boolean;
  toList: 'list' | 'free' | 'additional';
  trigger?: TriggerType;
  effects?: Effect[];
  modifiers?: Modifier[];
}

export interface EditCustomSpellData extends AddCustomSpellData {
  state: 'ACTIVE' | 'INACTIVE' | 'DELETED';
}

export interface SpellMutationResponse {
  message: string;
  spell: Spell;
}

// Tipos de respuesta de servicios - Inventory
export interface GetDefaultItemsResponse {
  defaultItems: Item[];
  characterItems: CharacterEquipment[];
}

export interface AddItemData {
  name: string;
  description: string;
  type: EquipmentType;
  category: string;
  equipped: boolean;
  proficiency: PersonaStadistic | 'none';
  canAttack: boolean;
  provideDefense: boolean;
  quantity: number;
  properties?: WeaponProperties | Effect;
  modifiers?: Modifier[];
  additionalProperties?: Feature[];
}

export interface ItemMutationResponse {
  message: string;
  item: CharacterEquipment;
}
