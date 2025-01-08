import {Schema, model, Document, Types } from 'mongoose';
import { IFeature } from '../types';

export interface ICustomFeature extends IFeature {
    character: Types.ObjectId
}

export interface IPersonaCustomFeatureDoc extends ICustomFeature, Document {}

const CustomFeatureSchema = new Schema<IPersonaCustomFeatureDoc>({
    character: { type: Schema.Types.ObjectId, required: true },
    id: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    useType: { type: String, required: true },
    action: { type: String },
    modifier: { type: [Object] },
    trigger: { type: [String] },
    cost: { type: String },
    range: { type: Object },
    target: { type: String },
    duration: { type: String },
    resource: { type: String },
    uses: { type: Number },
    triggerForRecover: { type: [String] },
    cd: { type: Schema.Types.Mixed }, // Can be number or string
    subfeatures: { type: [Object] }
});

export default model<ICustomFeature & IPersonaCustomFeatureDoc>('CustomFeature', CustomFeatureSchema);