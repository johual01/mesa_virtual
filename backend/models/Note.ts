import {Schema, model, Document, Types } from 'mongoose';

export enum noteState {
    ACTIVE = 'ACTIVE',
    DELETED = 'DELETED'
}

export interface INote extends Document {
    title: string,
    text: string,
    owner: Types.ObjectId,
    state: noteState
}

const noteSchema = new Schema({
    title: {
        type: String,
    },
    text: {
        type: String,
        required: true,
    },
    owner: {
        type: Schema.Types.ObjectId,
        required: true
    },
    state: {
        type: String,
        enum: noteState,
        default: noteState.ACTIVE
    }
}, {
    timestamps: true
})


export default model<INote>('Notes', noteSchema);