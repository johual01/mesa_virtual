import {Schema, model, Document, Types } from 'mongoose';
import { ISpell } from '../Spell';

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
}

export interface ICharacterStatus {
    characterId: Types.ObjectId,
    inspiration: IInspiration,
    spells: ISpells
}

export interface IPersonaCharacterStatus extends ICharacterStatus, Document {}

const CharacterStatusSchema = new Schema({
    characterId: {type: Schema.Types.ObjectId, required: true},
    inspiration: {type: Object, required: true},
    spells: {type: Object, required: true}
});

export default model<IPersonaCharacterStatus>('PersonaCharacterStatus', CharacterStatusSchema);