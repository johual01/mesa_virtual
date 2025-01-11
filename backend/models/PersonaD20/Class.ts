import {Schema, model, Document} from 'mongoose';
import { IFeature, personaStadistics } from '../types';
import { ISpell } from '../Spell';

export interface IClassLevel {
    level: number,
    proficency: number,
    spells: ISpell[],
    features: IFeature[],
    APGained: number,
    knownSpells: number,
    knownSecondaryFeatures?: number,
    featureIdThatGrantsSecondaryFeatures?: string,
    resourceUses?: number | number[],
    damageDie?: string,
    selectSubclass?: boolean,
    gainSubclassFeature?: boolean,
}

export interface IPersonaClass extends Document {
    name: string,
    description: string,
    HPDice: string,
    salvations: personaStadistics[],
    levels: IClassLevel[],
    resourceType?: string | string[],
}

const ClassSchema = new Schema({
    name: {type: String, required: true},
    description: {type: String, required: true},
    HPDice: {type: String, required: true},
    salvations: {type: [String], required: true},
    levels: {type: [Object], required: true},
    resourceType: {type: [String]},
});

export default model<IPersonaClass>('PersonaClass', ClassSchema);