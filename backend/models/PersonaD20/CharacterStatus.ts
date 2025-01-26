import {Schema, model, Document, Types } from 'mongoose';
import { ISpell } from '../Spell';
import { IFeature, IModifier } from '../types';

export interface IInspiration {
    reroll: boolean,
    bonus: number,
    critic: boolean,
    automaticSuccess: boolean
}

export interface ISpells {
    list: (ISpell | Types.ObjectId)[],
    freeList: (ISpell | Types.ObjectId)[],
    additionalList: (ISpell | Types.ObjectId)[],
    preparedList: (ISpell | Types.ObjectId)[],
    maxPrepared: number
}

export interface ICharacterStatus {
    characterId: Types.ObjectId,
    inspiration: IInspiration,
    spells: ISpells,
    customModifiers?: IModifier[],
    selectedSecondaryFeatures?: IFeature[],
    inactiveFeatures?: Types.ObjectId[],
}

export interface IPersonaCharacterStatus extends ICharacterStatus, Document {}

const CharacterStatusSchema = new Schema({
    characterId: {type: Schema.Types.ObjectId, required: true},
    inspiration: {type: Object, required: true},
    spells: {
        type: {
            list: [ { type: Schema.Types.ObjectId, ref: 'Spell' } ],
            freeList: [ { type: Schema.Types.ObjectId, ref: 'Spell' } ],
            additionalList: [ { type: Schema.Types.ObjectId, ref: 'Spell' } ],
            preparedList: [ { type: Schema.Types.ObjectId, ref: 'Spell' } ],
        }, 
        required: true
    },
    customModifiers: {type: [Object]},
    selectedSecondaryFeatures: {type: [Object]},
    inactiveFeatures: {type: [String]},
});

export default model<IPersonaCharacterStatus>('PersonaCharacterStatus', CharacterStatusSchema);