import {Schema, model, Document} from 'mongoose';
import { IStatusEffect } from './StatusEffect';
import { IModifier, elements, healingTypes, barrierTypes, targetTypes, IRange, triggerTypes, costTypes, system, useTypes } from './types';

export interface ISpellEffect {
    type: string,
    damage?: string,
    typeDamage?: elements,
    statusEffect?: IStatusEffect,
    heal?: string,
    typeHeal?: healingTypes,
    typeBarrier?: barrierTypes,
    target?: targetTypes,
    trigger?: triggerTypes,
    movement?: number,
    movementType?: string,
    movementDirection?: string,
    uses?: number,
}

export interface ISpell extends Document {
    name: string,
    cost: string,
    system: system,
    AP: number,
    costHP?: string,
    costType?: costTypes,
    useType: useTypes,
    category: string,
    range: IRange,
    target: targetTypes,
    duration: string,
    description: string,
    trigger?: triggerTypes,
    concentration?: boolean,
    effect?: ISpellEffect[],
    modifier?: IModifier | IModifier[],
}

const SpellSchema = new Schema({
    name: {type: String, required: true},
    cost: {type: String, required: true},
    system: {type: String, required: true},
    AP: {type: Number, required: true},
    costHP: {type: String},
    costType: {type: String},
    type: {type: String, required: true},
    category: {type: String, required: true},
    range: {type: Object, required: true},
    target: {type: String, required: true},
    duration: {type: String, required: true},
    description: {type: String, required: true},
    trigger: {type: String},
    concentration: {type: Boolean},
    effect: {type: [ Object ]},
    modifier: {type: Schema.Types.Mixed },
});

export default model<ISpell>('Spell', SpellSchema);