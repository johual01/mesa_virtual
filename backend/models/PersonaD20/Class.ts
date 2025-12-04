import { Schema, model, Document, Types } from 'mongoose';
import { IFeature, personaStadistics, resourceTypes } from '../types';

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
    resourceUses?: number,
    damageDie?: string,
    selectSubclass?: boolean,
    gainSubclassFeature?: boolean,
    gainSecondaryAffinity?: boolean,
    gainStatIncrease?: boolean,
}

export interface IPersonaClass extends Document {
    name: string,
    description: string,
    HPDice: string,
    salvations: personaStadistics[],
    levels: IClassLevel[],
    resourceType?: resourceTypes | resourceTypes[] | string | string[],
    featureIdThatGrantsSecondaryFeatures?: Types.ObjectId,
}

const ClassSchema = new Schema({
    name: {type: String, required: true},
    description: {type: String, required: true},
    HPDice: {type: String, required: true},
    salvations: {type: [String], required: true, enum: Object.values(personaStadistics)},
    levels: {type: [Object], required: true},
    resourceType: {type: Schema.Types.Mixed},
    featureIdThatGrantsSecondaryFeatures: {type: Schema.Types.ObjectId},
});

export default model<IPersonaClass>('PersonaClass', ClassSchema);