import {Schema, model, Document} from 'mongoose';
import { IStatusEffect } from './StatusEffect';
import { IModifier, elements, healingTypes, barrierTypes, targetTypes, IRange, triggerTypes, costTypes, system, useTypes, IDuration } from './types';

export interface ISpellEffect {
    type: string, // Tipo de hechizo
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
    modification: string, // Ajuste de efecto
    levelCondition?: number, // Condición de nivel para discriminar efectos
    etiquette?: string, // Etiqueta para unificar efectos por condición
}

export interface ISpell extends Document {
    name: string,
    system: system,
    cost?: string,
    AP?: number,
    costHP?: string,
    costType?: costTypes,
    useType: useTypes,
    category: string,
    description: string,
    trigger?: triggerTypes,
    concentration: boolean,
    effects?: ISpellEffect[],
    modifiers?: IModifier[],
}

const SpellSchema = new Schema({
    name: {type: String, required: true},
    system: {type: String, required: true},
    cost: {type: String},
    AP: {type: Number},
    costHP: {type: String},
    costType: {type: String},
    useType: {type: String, required: true},
    category: {type: String, required: true},
    description: {type: String, required: true},
    trigger: {type: String},
    concentration: {type: Boolean, required: true},
    effects: {type: [ Object ]},
    modifier: {type: [ Object ] },
});

export default model<ISpell>('Spell', SpellSchema);