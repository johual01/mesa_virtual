import {Schema, model, Document, Types } from 'mongoose';
import { ICharacter } from '../Character';
import { personaStadistics, targetTypes, elements, healingTypes, barrierTypes, triggerTypes, IRange, IFeature, IModifier } from '../types';
import { IStatusEffect } from '../StatusEffect';

export enum noneType {
    NONE = 'none'
}
export enum equipmentType {
    WEAPON = 'weapon',
    ARMOR = 'armor',
    ACCESORY = 'accesory',
    CONSUMIBLE = 'consumible',
    OTHER = 'other'
}

export enum weaponCategory {
    SIMPLE = 'simple',
    MARTIAL = 'martial',
    EXOTIC = 'exotic',
    FIRE_WEAPONS = 'fire_weapons'
}

export enum armorCategory {
    ARMOR = 'armor',
    SHIELD = 'shield',
    DODGE = 'dodge',
    MAGICAL = 'magical',
}

export enum consumibleCategory {
    RECOVERY = 'recovery',
    UTILITY = 'utility',
    DAMAGE = 'damage',
}

export interface IEquipmentCategory {
    [equipmentType.WEAPON]: weaponCategory,
    [equipmentType.ARMOR]: armorCategory,
    [equipmentType.ACCESORY]: string,
    [equipmentType.CONSUMIBLE]: consumibleCategory,
    [equipmentType.OTHER]: string
}

export interface IWeaponProperties {
    attack: {
        proficiency: personaStadistics | noneType,
        bonus: number,
    },
    target: targetTypes,
    range: IRange,
    damageType: elements,
    damage: string,
    critical: string,
    alternativeDamage: string,
    alternativeCritical: string,
    ammunition?: string,
    twoHanded: boolean,
    light: boolean,
    finesse: boolean,
    versatile: boolean,
    heavy: boolean,
    loading: boolean,
    reach: boolean,
    thrown: boolean,
    additionalProperties: IFeature[],
}

export interface IConsumibleProperties {
    modifiers?: IModifier[],
    damage?: string, // Daño
    typeDamage?: elements, // Tipo de daño
    statusEffect?: IStatusEffect, // Efecto de estado
    heal?: string, // Cantidad de curación - Puede tener dados o valores fijos (half_level) o combinaciones
    typeHeal?: healingTypes, // Tipo de curación
    shieldType?: barrierTypes, // Tipo de barrera
    target?: targetTypes, // Objetivo
    range?: IRange, // Rango
    trigger?: triggerTypes, // Disparador de evento
    condition?: string, // Condición para activar el efecto como "si el objetivo está envenenado", se concatena con el de arriba
    movement?: number, // Cantidad de movimiento generado
    movementType?: string, // Tipo de movimiento generado
    movementDirection?: string, // Dirección de movimiento generado
    uses?: number, // Cantidad de usos del efecto
    etiquette?: string, // Etiqueta para unificar efectos por condición
}

export interface ICharacterEquipment extends Document {
    character: Types.ObjectId | ICharacter,
    equipmentName: string,
    description: string,
    type: equipmentType,
    category: IEquipmentCategory[equipmentType],
    equipped: boolean,
    proficiency: personaStadistics | noneType,
    canAttack: boolean,
    provideDefense: boolean,
    quantity: number,
    properties?: IWeaponProperties | IConsumibleProperties,
    modifiers?: IModifier[],
    additionalProperties?: IFeature[],
}

export interface IItem extends Omit<ICharacterEquipment, 'character'> {}

const itemObject = {
    equipmentName: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        enum: equipmentType,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    equipped: {
        type: Boolean,
        required: true,
    },
    proficiency: {
        type: String,
        required: true,
    },
    canAttack: {
        type: Boolean,
        required: true,
    },
    provideDefense: {
        type: Boolean,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
    properties: {
        type: Object,
    },
    modifiers: {
        type: [ Object ],
    },
    additionalProperties: {
        type: [ Object ],
    }
}

const CharacterEquipmentSchema = new Schema({
    character: {
        type: Schema.Types.ObjectId,
        required: true,
    },
    ...itemObject
});

export default model<ICharacterEquipment>('CharacterEquipment', CharacterEquipmentSchema);

const itemSchema = new Schema(itemObject);
export const Item = model<IItem>('Item', itemSchema);