import { IStatusEffect } from './StatusEffect';
import { Types } from 'mongoose';

export enum healingTypes {
    HP = 'hp',
    SP = 'sp',
    TEMP_HP = 'temp_hp',
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
    BEFORE_RECEIVE_ATTACK = 'before_receive_attack', // Se activa antes de recibir un ataque
    AT_RECEIVE_ATTACK = 'at_receive_attack', // Se activa al recibir un ataque
    BEFORE_ATTACK = 'before_attack', // Se activa antes de realizar un ataque
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
    AT_FAILED_SAVE = 'at_failed_save', // Se activa al fallar una salvación
    AT_SUCCESS_SAVE = 'at_success_save', // Se activa al superar una salvación
}

export enum costTypes {
    TEMPORAL = 'temporal',
    PERMANENT = 'permanent',
}

export interface IRange {
    type: rangeTypes,
    range?: number,
    shape?: rangeShapeTypes,
}

export interface IDuration {
    type: string,
    duration: number,
    medition: string,
}

export interface IModifier {
    value: number | string,
    type: string,
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
    state: 'ACTIVE' | 'INACTIVE',
    modifierId?: string,
    etiquette?: string
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
    costType?: costTypes,
    cost?: number | string,
    alternativeCostType?: costTypes,
    alternativeCost?: number | string,
    range?: IRange,
    target?: targetTypes,
    duration?: IDuration,
    resource?: string,
    uses?: number,
    triggerForRecover?: triggerTypes | triggerTypes[],
    requireSalvation?: boolean, // Requiere salvación
    cd?: number | string, // Dificultad a superar
    cooldown?: IDuration, // Tiempo de reutilización
    origin?: string,
    addUsesToParent?: boolean,
    state?: 'ACTIVE' | 'INACTIVE',
    effects: IEffect[],
    parent?: Types.ObjectId,
    subFeatures?: IFeature[],
}


export interface IEffect {
    type: string, // Tipo de efecto
    parent?: Types.ObjectId, // Efecto, feature o hechizo padre
    damage?: string, // Daño
    damageType?: elements, // Tipo de daño
    statusEffect?: IStatusEffect, // Efecto de estado
    heal?: string, // Cantidad de curación - Puede tener dados o valores fijos o valores dinámicos (por ejemplo, {half_level}) o combinaciones
    healType?: healingTypes, // Tipo de curación
    shieldType?: barrierTypes, // Tipo de barrera
    target?: targetTypes, // Objetivo
    range?: IRange, // Rango
    trigger?: triggerTypes, // Disparador de evento
    condition?: string, // Condición para activar el efecto como "si el objetivo está envenenado", se concatena con el de arriba
    movement?: number, // Cantidad de movimiento generado
    movementType?: string, // Tipo de movimiento generado
    movementDirection?: string, // Dirección de movimiento generado
    uses?: number, // Cantidad de usos del efecto
    modification: string, // Ajuste de efecto
    levelCondition?: number, // Condición de nivel para discriminar efectos
    shouldSaveEachTurn?: boolean, // Debe realizar la salvación cada turno - TODO: Esto debe incluir el cd de salvación cuando se aplica
    etiquette?: string, // Etiqueta para unificar efectos por condición
    
}