import {Schema, model, Document} from 'mongoose';
import { IFeature, personaStadistics } from '../types';
import { IClassLevel, IPersonaClass } from './Class';
import { ISpell } from '../Spell';

export interface ISubclassLevel extends Omit<IClassLevel, "proficency" | "spells" | "APGained" | "knownSpells"> {
    spells?: ISpell[]
}

export interface IPersonaSubclass extends Document {
    name: string,
    description: string,
    class: Schema.Types.ObjectId | IPersonaClass,
    levels: ISubclassLevel[],
    resourceType?: string | string[],   
}

const SubclassSchema = new Schema({
    name: {type: String, required: true},
    description: {type: String, required: true},
    class: {type: Schema.Types.ObjectId, ref: 'PersonaClass', required: true},
    levels: {type: [Object], required: true},
    resourceType: {type: [String]},
});

export default model<IPersonaSubclass>('PersonaSubclass', SubclassSchema);