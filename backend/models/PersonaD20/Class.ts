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
    resourceUses?: number | number[],
    damageDie?: string
}

export interface IPersonaClass extends Document {
    name: string,
    description: string,
    PVDice: string,
    salvations: personaStadistics[],
    launchSpell: personaStadistics[], 
    levels: IClassLevel[],
    resourceType?: string | string[],
}

const ClassSchema = new Schema({
    name: {type: String, required: true},
    description: {type: String, required: true},
    PVDice: {type: String, required: true},
    salvations: {type: [String], required: true},
    launchSpell: {type: [String], required: true},
    levels: {type: [Object], required: true},
    resourceType: {type: [String]},
});

export default model<IPersonaClass>('PersonaClass', ClassSchema);