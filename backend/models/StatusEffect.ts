import {Schema, model, Document} from 'mongoose';
import { IModifier, triggerTypes } from './types';

export interface IStatusEffect extends Document {
    name: string,
    category: string,
    duration: string,
    description: string,
    trigger?: triggerTypes,
    modifier?: IModifier | IModifier[],
}

const StatusEffectSchema = new Schema({
    name: {type: String, required: true},
    category: {type: String, required: true},
    duration: {type: String, required: true},
    description: {type: String, required: true},
    trigger: {type: String},
    modifier: {type: Schema.Types.Mixed },
});

export default model<IStatusEffect>('StatusEffect', StatusEffectSchema);