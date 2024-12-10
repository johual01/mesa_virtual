import {Schema, model, Document} from 'mongoose';
import { modifier } from './Modifier';

export interface ISpell extends Document {
    name: string,
    cost: number,
    AP: number,
    category: string,
    effect?: string[],
    range: string,
    target: string,
    duration: string,
    description: string,
    modifier?: modifier | modifier[]
}

const SpellSchema = new Schema({
    name: {type: String, required: true},
    cost: {type: Number, required: true},
    AP: {type: Number, required: true},
    category: {type: String, required: true},
    effect: {type: [ String ]},
    modifier: {type: Schema.Types.Mixed },
    range: {type: String, required: true},
    target: {type: String, required: true},
    duration: {type: String, required: true},
    description: {type: String, required: true}
});

export default model<ISpell>('Spell', SpellSchema);