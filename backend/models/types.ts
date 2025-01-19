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
    AT_ATTACK = 'at_attack', // Se activa al atacar
    AT_SPELL = 'at_spell', // Se activa al lanzar un hechizo
    AT_SPELL_ATTACK = 'at_spell_attack', // Se activa al lanzar un hechizo de ataque
    AT_DAMAGE = 'at_damage', // Se activa al causar daño
    AT_HEAL = 'at_heal', // Se activa al curar
    AT_RECEIVE_DAMAGE = 'at_receive_damage', // Se activa al recibir daño
    AT_WEAPON = 'at_weapon', // Se activa al usar un arma
    AT_ALL_WEAPONS = 'at_all_weapons', // Se activa al usar cualquier arma
    AT_DEATH = 'at_death', // Se activa al morir
    BEFORE_RECEIVE_ATTACK = 'before_receive_attack', // Se activa antes de recibir un ataque
    AT_RECEIVE_ATTACK = 'at_receive_attack', // Se activa al recibir un ataque
    AT_ZONE = 'at_zone', // Se activa al entrar en una zona
    REACTION = 'reaction', // Se activa como reacción
    END_OF_TURN = 'end_of_turn', // Se activa al final del turno
    START_OF_TURN = 'start_of_turn', // Se activa al inicio del turno
    NEXT_ATTACK = 'next_attack', // Se activa al siguiente ataque
    NEXT_SPELL = 'next_spell', // Se activa al siguiente hechizo
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
    featureId?: string,
    addTo?: string | string[],
    target?: targetTypes,
    duration?: IDuration,
    stadistic?: personaStadistics,
    replaceStadistic?: personaStadistics,
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
    featureId: string,
    name: string,
    description: string,
    useType: useTypes,
    action?: actions,
    modifiers?: IModifier[],
    trigger?: triggerTypes | triggerTypes[],
    cost?: costTypes,
    range?: IRange,
    target?: targetTypes,
    duration?: string,
    resource?: string,
    uses?: number,
    triggerForRecover?: triggerTypes | triggerTypes[],
    cd?: number | string, // Dificultad a superar
    origin?: string,
    state?: 'ACTIVE' | 'INACTIVE',
    subFeatures?: IFeature[],
}