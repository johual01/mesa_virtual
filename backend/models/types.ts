export interface IModifier {
    origin: string,
    element: string,
    value: number,
    type: string,
    description: string,
    target?: targetTypes,
    duration?: string
}

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
    ALL_ENEMIES = 'all_enemies',
    ALL_ALLIES = 'all_allies',
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
    AT_ATTACK = 'at_attack',
    AT_SPELL = 'at_spell',
    AT_DAMAGE = 'at_damage',
    AT_HEAL = 'at_heal',
    AT_COUNTER = 'at_counter',
    AT_RECEIVE_DAMAGE = 'at_receive_damage',
    AT_WEAPON = 'at_weapon',
    AT_ALL_WEAPONS = 'at_all_weapons',
    AT_DEATH = 'at_death',
    BEFORE_RECEIVE_ATTACK = 'before_receive_attack',
    AT_ZONE = 'at_zone',
    REACTION = 'reaction',
    COUNTER = 'counter',
    END_OF_TURN = 'end_of_turn',
    START_OF_TURN = 'start_of_turn',
    NEXT_ATTACK = 'next_attack',
    NEXT_SPELL = 'next_spell',
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
}

export enum useTypes {
    ACTIVE = 'active',
    PASSIVE = 'passive',
}

export interface IFeature {
    name: string,
    description: string,
    useType: useTypes,
    action?: actions,
    modifier?: IModifier[],
    trigger?: triggerTypes | triggerTypes[],
    cost?: costTypes,
    range?: IRange,
    target?: targetTypes,
    duration?: string,
    resource?: string,
    uses?: number,
    subfeatures?: IFeature[],
}