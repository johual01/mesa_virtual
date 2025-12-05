import {Schema, model, Document, Types } from 'mongoose';
import { IModifier, triggerTypes, system, useTypes, IEffect, spellCategories, ICost } from './types';

export interface ISpell extends Document {
    name: string,
    system: system,
    custom?: boolean,
    owner?: Types.ObjectId,
    class?: Types.ObjectId, // Reference to the class this spell belongs to
    subclass?: Types.ObjectId, // Reference to the subclass
    cost?: ICost[],
    useType: useTypes,
    category: spellCategories | string, // Allow custom categories
    description: string,
    trigger?: triggerTypes,
    concentration: boolean,
    effects?: IEffect[],
    modifiers?: IModifier[],
    toList?: 'list' | 'free' | 'additional',
    state: 'ACTIVE' | 'INACTIVE' | 'DELETED'
}

const SpellSchema = new Schema({
    name: {type: String, required: true},
    system: {type: String, required: true, enum: Object.values(system)},
    custom: { type: Boolean, default: false },
    owner: {type: Schema.Types.ObjectId, ref: 'Character'},
    class: {type: Schema.Types.ObjectId, ref: 'PersonaClass'},
    subclass: {type: Schema.Types.ObjectId, ref: 'PersonaSubclass'},
    cost: {type: [ Object ]},
    useType: {type: String, required: true, enum: Object.values(useTypes)},
    category: {type: String, required: true},
    description: {type: String, required: true},
    trigger: {type: String, enum: Object.values(triggerTypes)},
    concentration: {type: Boolean, required: true},
    effects: {type: [ Object ]},
    modifiers: {type: [ Object ] },
    toList: { type: String, enum: ['list', 'free', 'additional']},
    state: { type: String, enum: ['ACTIVE', 'INACTIVE', 'DELETED'], default: 'ACTIVE'}
});

export default model<ISpell>('Spell', SpellSchema);