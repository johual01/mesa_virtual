import {Schema, model, Document, Types } from 'mongoose';
import { IModifier, triggerTypes, costTypes, system, useTypes, IEffect } from './types';

export interface ISpell extends Document {
    name: string,
    system: system,
    custom?: boolean,
    owner?: Types.ObjectId,
    cost: string,
    AP: number,
    costHP?: string,
    costType?: costTypes,
    useType: useTypes,
    category: string,
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
    system: {type: String, required: true},
    custom: { type: Boolean },
    owner: {type: Schema.Types.ObjectId, ref: 'Character'},
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
    modifiers: {type: [ Object ] },
    toList: { type: String, enum: ['list', 'free', 'additional']},
    state: { type: String, enum: ['ACTIVE', 'INACTIVE', 'DELETED'], default: 'ACTIVE'}
});

export default model<ISpell>('Spell', SpellSchema);