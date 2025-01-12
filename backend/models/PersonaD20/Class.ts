import { Schema, model, Document, Types } from 'mongoose';
import { IFeature, personaStadistics } from '../types';

export interface IClassLevel {
    level: number,
    proficency: number,
    spells: Types.ObjectId[],
    additionalSpells?: Types.ObjectId[],
    freeSpells?: Types.ObjectId[],
    features: IFeature[],
    APGained: number,
    maxPreparedSpells: number,
    knownSecondaryFeatures?: number,
    featureIdThatGrantsSecondaryFeatures?: string,
    resourceUses?: number,
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