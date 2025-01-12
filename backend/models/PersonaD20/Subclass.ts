import { Schema, model, Document, Types } from 'mongoose';
import { IClassLevel, IPersonaClass } from './Class';

export interface ISubclassLevel extends Omit<IClassLevel, "proficency" | "spells" | "APGained" | "maxPreparedSpells"> {
    spells?: Types.ObjectId[],
    additionalSpells?: Types.ObjectId[],
    freeSpells?: Types.ObjectId[],
    additionalMaxPreparedSpells?: number,
}

export interface IPersonaSubclass extends Document {
    name: string,
    description: string,
    class: Types.ObjectId | IPersonaClass,
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