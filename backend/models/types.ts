import { IStatusEffect } from './StatusEffect';
import { ObjectId, Types } from 'mongoose';

export enum healingTypes {
    HP = 'hp',
    SP = 'sp',
    TEMP_HP = 'temp_hp',
    ACC_TEMP_HP = 'accumulative_temp_hp',
    STATUS_EFFECT = 'status_effect',
    DEBILITATION = 'debilitation',
    ENEMY_POTENTIATION = 'enemy_potentiation',
}

export enum barrierTypes {
    PHYSICAL = 'physical',
    MAGICAL = 'magical',
    ALMIGHTY = 'almighty',
    DOUBLE_ALMIGHTY = 'double_almighty',
}

export enum elements {
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
    PIERCE = 'pierce',
}

export enum personaElements {
    PSY = elements.PSY,
    NUKE = elements.NUKE,
    FIRE = elements.FIRE,
    ICE = elements.ICE,
    ELEC = elements.ELEC,
    WIND = elements.WIND,
    CURSE = elements.CURSE,
    BLESS = elements.BLESS,
    ALMIGHTY = elements.ALMIGHTY,
    SLASH = elements.SLASH,
    STRIKE = elements.STRIKE,
    PIERCE = elements.PIERCE,    
}

export enum targetTypes {
    SELF = 'self',
    ALLY = 'ally',
    ENEMY = 'enemy',
    ENEMIES_AT_RANGE = 'enemies_at_range',
    ALLIES_AT_RANGE = 'allies_at_range',
    ALL_ENEMIES = 'all_enemies',
    ALL_ALLIES = 'all_allies',
    ONLY_ALLY = 'only_ally',
    ALLIES_ATTACKING_TARGET = 'allies_attacking_target',
    ALL = 'all',
}

export enum rangeTypes {
    MELEE = 'melee',
    RANGED = 'ranged',
    SELF = 'self',
    ALL = 'all',
}

export enum rangeShapeTypes {
    CONE = 'cone',
    LINE = 'line',
    CIRCLE = 'circle',
    SQUARE = 'square',
    CROSS = 'cross',
}

export enum triggerTypes {
    AT_ATTACK = 'at_attack', // Se activa al impactar un ataque
    AT_FAILED_ATTACK = 'at_failed_attack', // Se activa al fallar un ataque
    AT_SPELL = 'at_spell', // Se activa al lanzar un hechizo
    AT_SPELL_ATTACK = 'at_spell_attack', // Se activa al lanzar un hechizo de ataque
    AT_DAMAGE = 'at_damage', // Se activa al causar daño
    AT_HEAL = 'at_heal', // Se activa al curar
    AT_RECEIVE_DAMAGE = 'at_receive_damage', // Se activa al recibir daño
    AT_WEAPON = 'at_weapon', // Se activa al usar un arma
    AT_ALL_WEAPONS = 'at_all_weapons', // Se activa al usar cualquier arma
    AT_SELF_DEATH = 'at_self_death', // Se activa al morir
    AT_ENEMY_DEATH = 'at_enemy_death', // Se activa al morir un enemigo
    AT_ALLY_DEATH = 'at_ally_death', // Se activa al morir un aliado
    AT_RECEIVE_ATTACK = 'at_receive_attack', // Se activa al recibir un ataque
    AT_RECEIVE_MAGIC_ATTACK = 'at_receive_magic_attack', // Se activa al recibir un ataque mágico
    AT_ENEMY_FAILED_RECEIVE_ATTACK = 'at_enemy_failed_receive_attack', // Se activa al ver el fallo de un ataque hacia ti
    AT_ENEMY_FAILED_ATTACK = 'at_enemy_failed_attack', // Se activa al ver el fallo de un ataque realizado por un enemigo
    AT_ALLY_RECEIVE_ATTACK = 'at_ally_receive_attack', // Se activa al recibir un ataque un aliado
    BEFORE_ATTACK = 'before_attack', // Se activa antes de realizar un ataque
    BEFORE_RECEIVE_ATTACK = 'before_receive_attack', // Se activa antes de recibir un ataque
    AT_ZONE = 'at_zone', // Se activa al entrar en una zona
    NEXT_ATTACK = 'next_attack', // Se activa al siguiente ataque
    NEXT_SPELL = 'next_spell', // Se activa al siguiente hechizo
    AFTER_DAMAGE_ROLL = 'after_damage_roll', // Se activa después de tirar el daño
    AT_COMBAT_START = 'at_combat_start', // Se activa al inicio del combate
    AT_COMBAT_END = 'at_combat_end', // Se activa al final del combate
    AT_TURN_START = 'at_turn_start', // Se activa al inicio del turno
    AT_ANY_TURN_START = 'at_any_turn_start', // Se activa al inicio de cualquier turno
    AT_TURN_END = 'at_turn_end', // Se activa al final del turno
    AT_ANY_TURN_END = 'at_any_turn_end', // Se activa al final de cualquier turno
    AT_ROUND_START = 'at_round_start', // Se activa al inicio de la ronda
    AT_ROUND_END = 'at_round_end', // Se activa al final de la ronda
    ENEMY_ENTERS_RANGE = 'enemy_enters_range', // Se activa al entrar un enemigo en rango
    AT_USE_REACTION = 'at_use_reaction', // Se activa al usar una reacción
    AT_CRITICAL_ATTACK = 'at_critical_attack', // Se activa al realizar un ataque crítico
    AT_RECEIVE_CRITICAL_ATTACK = 'at_receive_critical_attack', // Se activa al recibir un ataque crítico
    AT_OPPORTUNITY_CRITICAL_ATTACK = 'at_opportunity_critical_attack', // Se activa al realizar un ataque de oportunidad crítico
    AT_OPPORTUNITY_ATTACK = 'at_opportunity_attack', // Se activa al realizar un ataque de oportunidad
    BEFORE_SAVE = 'before_save', // Se activa antes de realizar una salvación
    AT_FAILED_SAVE = 'at_failed_save', // Se activa al fallar una salvación
    AT_SUCCESS_SAVE = 'at_success_save', // Se activa al superar una salvación
    AT_ALLY_CRITICAL = 'at_ally_critical', // Se activa al un aliado realizar una tirada crítica
    AT_ALLY_ATTACK = 'at_ally_attack', // Se activa al un aliado realizar un ataque
    AT_IMPACT_OPPORTUNITY_ATTACK = 'at_impact_opportunity_attack', // Se activa al impactar un ataque de oportunidad
    AT_ENEMY_DISENGAGE_ACTION = 'at_enemy_disengage_action', // Se activa cuando un enemigo realiza la acción de desengancharse
    AT_APPLY_STATUS_EFFECT = 'at_apply_status_effect', // Se activa al aplicar un efecto de estado
    AT_REMOVE_STATUS_EFFECT = 'at_remove_status_effect', // Se activa al eliminar un efecto de estado
    AT_APPLY_DEBUFF_EFFECT = 'at_apply_debuff_effect', // Se activa al aplicar un efecto negativo
    AT_APPLY_BUFF_EFFECT = 'at_apply_buff_effect', // Se activa al aplicar un efecto positivo
    AT_APPLY_NEGATIVE_EFFECT = 'at_apply_negative_effect', // Se activa al aplicar un efecto negativo o debilitante
    AT_DISPEL_EFFECT = 'at_dispel_effect', // Se activa al disipar un efecto
    AT_SPELL_CAST_DURING_ATTACK = 'at_spell_cast_during_attack', // Se activa al lanzar un hechizo como parte de un ataque
    AT_ENEMY_SPELL_CAST = 'at_enemy_spell_cast', // Se activa al lanzar un hechizo un enemigo
}

export enum costTypes {
    TEMPORAL = 'temporal',
    PERMANENT = 'permanent',
}

export enum spellCategories {
    ATTACK = 'attack',
    BUFF = 'buff',
    DEBUFF = 'debuff',
    HEAL = 'heal',
    SHIELD = 'shield',
    COUNTER = 'counter',
    UTILITY = 'utility',
    SUMMONING = 'summoning',
}

export enum resourceTypes {
    RAGE_POINTS = 'Rage Points',
    MORALE_POINTS = 'Morale Points',
    REACTION = 'reaction',
    ACTION_POINTS = 'AP',
    SPELL_POINTS = 'SP',
    HP = 'HP',
    MOVEMENT = 'movement',
    BONUS_ACTION = 'bonus_action',
    FREE_ACTION = 'free_action',
}

export enum durationType {
    TEMPORAL = 'temporal',
    PERMANENT = 'permanent',
    INSTANT = 'instant',
    CONCENTRATION = 'concentration',
}

export enum meditionType {
    ROUNDS = 'rounds',
    TURNS = 'turns',
    ATTACKS = 'attacks',
    MINUTES = 'minutes',
    HOURS = 'hours',
    DAYS = 'days',
    COMBAT = 'combat',
    REST = 'rest',
}

export interface IRange {
    type: rangeTypes,
    range?: number,
    shape?: rangeShapeTypes,
}

export interface IDuration {
    type: durationType,
    duration: number,
    medition: meditionType,
}

export interface ICost {
    amount: string | number,
    type?: costTypes,
    resource?: resourceTypes | string,
}

export enum modifierTypes {
    // Combat modifiers
    DAMAGE = 'damage',
    ATTACK = 'attack',
    DEFENSE = 'defense',
    CRITICAL = 'critical',
    CRITICAL_FAIL = 'criticalFail',
    DICES = 'dices',
    
    // Resistance and healing
    RESISTANCE = 'resistance',
    MAGIC_DEFENSE = 'magic_defense',
    HEALING_RECEIVED = 'healing_received',
    
    // Actions and movement
    ACTION = 'action',
    BONUS_ACTION = 'bonus_action',
    REACTION = 'reaction',
    EXTRA_ACTION = 'extra_action',
    SPEED = 'speed',
    EXTRA_MOVEMENT = 'extra_movement',
    
    // Other
    OFFENSIVE_ACTION = 'offensive_action',
    DEFEND = 'defend',
    ALL_SAVING_THROWS = 'all_saving_throws',
    STADISTIC = 'stadistic',
}

export interface IModifier {
    value: number | string,
    type: modifierTypes | string,
    description: string,
    permanent?: boolean,
    origin?: string,
    featureId?: Types.ObjectId,
    addTo?: string | string[],
    target?: targetTypes,
    duration?: IDuration,
    stadistic?: personaStadistics,
    replaceStadistic?: personaStadistics,
    trigger?: triggerTypes | triggerTypes[],
    shouldSaveEachTurn?: boolean,
    state: 'ACTIVE' | 'INACTIVE',
    modifierId?: string,
    etiquette?: string,
    damageType?: elements,
    triggeredBy?: ObjectId,
    dice?: string,
}

export enum system {
    DND5E = 'DND5E',
    PERSONAD20 = 'PERSONAD20',
}

export enum personaStadistics {
    KNOWLEDGE = 'knowledge',
    INSTINCTS = 'instincts',
    DEXTERITY = 'dexterity',
    COURAGE = 'courage',
    CHARISMA = 'charisma'
}

export enum actions {
    ACTION = 'action',
    BONUS_ACTION = 'bonus_action',
    REACTION = 'reaction',
    FREE_ACTION = 'free_action',
    MOVEMENT = 'movement',
    INTERACTION = 'interaction',
    NONE = 'none',
}

export enum useTypes {
    ACTIVE = 'active',
    PASSIVE = 'passive',
}

export interface IFeature {
    featureId: Types.ObjectId,
    name: string,
    description: string,
    useType: useTypes,
    action?: actions,
    alternativeAction?: actions,
    modifiers?: IModifier[],
    trigger?: triggerTypes | triggerTypes[],
    condition?: string, // Condición para activar el efecto como "si el objetivo está envenenado", se concatena con el de arriba
    cost?: ICost[],
    alternativeCost?: ICost[],
    range?: IRange,
    target?: targetTypes,
    duration?: IDuration,
    uses?: number,
    internalCounter?: boolean,
    counterCondition?: string,
    triggerForRecover?: triggerTypes | triggerTypes[],
    requireSalvation?: boolean, // Requiere salvación
    cd?: number | string, // Dificultad a superar
    cooldown?: IDuration, // Tiempo de reutilización
    origin?: string,
    addUsesToParent?: boolean,
    addAsSubfeatureToParent?: boolean,
    state?: 'ACTIVE' | 'INACTIVE',
    effects: IEffect[],
    parent?: Types.ObjectId,
    subFeatures?: IFeature[],
}


// Base effect interface
export interface IBaseEffect {
    type: string,
    parent?: Types.ObjectId,
    target?: targetTypes,
    range?: IRange,
    trigger?: triggerTypes,
    condition?: string,
    uses?: number,
    levelCondition?: number,
    shouldSaveEachTurn?: boolean,
    etiquette?: string,
    canUseFeatures?: boolean,
    canTriggerEffects?: boolean,
    salvation?: personaStadistics,
    cd?: number | string,
    duration?: IDuration,
}

// Specific effect types
export interface IDamageEffect extends IBaseEffect {
    type: 'damage' | 'physical_damage' | 'magical_damage',
    damage: string,
    damageType?: elements,
    preventCritical?: boolean,
}

export interface IHealEffect extends IBaseEffect {
    type: 'heal' | 'regeneration',
    heal: string,
    healType?: healingTypes,
    resource?: resourceTypes | string,
}

export interface IShieldEffect extends IBaseEffect {
    type: 'shield' | 'barrier',
    heal?: string, // Amount of shield
    shieldType?: barrierTypes,
}

export interface IStatusEffectType extends IBaseEffect {
    type: 'status_effect' | 'debuff' | 'buff',
    statusEffect?: IStatusEffect,
    modifiers?: IModifier[],
}

export interface IMovementEffect extends IBaseEffect {
    type: 'movement' | 'teleport' | 'push' | 'pull',
    movement?: number,
    movementType?: string,
    movementDirection?: string,
}

export type modificationEffectTypes =  'modification' 
    | 'reduce_damage' 
    | 'avoid_damage' 
    | 'cancel_disadvantage' 
    | 'reset_bonifier' 
    | 'activate_feature' 
    | 'break_concentration'
    | 'remove_buffs'
    | 'remove_debuffs'
    | 'extend_buffs'
    | 'change_initiative'
    | 'spell_cost_reduction'
    | 'break_shield'
    | 'additional_target'
    | 'stack_buffs'
    | 'attack_with_weapon'
    | 'opportunity_attack'
    | 'modify_feature_uses'
    | 'cast_spell'
    | 'create_zone'
    | 'counterspell'

export interface IModificationEffect extends IBaseEffect {
    type: modificationEffectTypes,
    modification?: string,
    action?: actions,
    damageReduction?: string,
    reduction?: number,
    multiplier?: number,
    maxStacks?: number,
    condition?: string,
    spellCategory?: spellCategories | string,
    featureId?: Types.ObjectId,
    cost?: ICost[],
    zoneType?: string,
}

// Union type for all effects
export type IEffect = 
    | IDamageEffect 
    | IHealEffect 
    | IShieldEffect 
    | IStatusEffectType 
    | IMovementEffect 
    | IModificationEffect 
    | IBaseEffect; // Fallback for custom effects
