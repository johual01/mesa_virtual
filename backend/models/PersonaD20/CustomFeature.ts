import {Schema, model, Document, Types } from 'mongoose';
import { IFeature, useTypes, actions, targetTypes, triggerTypes } from '../types';

export interface ICustomFeature extends IFeature {
    character: Types.ObjectId
}

export interface IPersonaCustomFeatureDoc extends ICustomFeature, Document {}

const CustomFeatureSchema = new Schema<IPersonaCustomFeatureDoc>({
    character: { type: Schema.Types.ObjectId, required: true, ref: 'Character' },
    featureId: { type: Schema.Types.ObjectId, required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    useType: { type: String, required: true, enum: Object.values(useTypes) },
    action: { type: String, enum: Object.values(actions) },
    alternativeAction: { type: String, enum: Object.values(actions) },
    modifiers: { type: [Object] },
    trigger: { type: Schema.Types.Mixed },
    condition: { type: String },
    cost: { type: [Object] },
    alternativeCost: { type: [Object] },
    range: { type: Object },
    target: { type: String, enum: Object.values(targetTypes) },
    duration: { type: Object },
    uses: { type: Number },
    triggerForRecover: { type: Schema.Types.Mixed },
    cd: { type: Schema.Types.Mixed },
    cooldown: { type: Object },
    subFeatures: { type: [Object] },
    origin: { type: String, default: 'custom' },
    state: { type: String, required: true, enum: ['ACTIVE', 'INACTIVE', 'DELETED'], default: 'ACTIVE' },
    addUsesToParent: { type: Boolean },
    addAsSubfeatureToParent: { type: Boolean },
    effects: { type: [Object], required: true },
    parent: { type: Schema.Types.ObjectId }
});

export default model<ICustomFeature & IPersonaCustomFeatureDoc>('CustomFeature', CustomFeatureSchema);