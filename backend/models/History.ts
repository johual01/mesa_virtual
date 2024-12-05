import {Schema, model, Document} from 'mongoose';

export enum origin {
    USER = 'USER',
    SYSTEM = 'SYSTEM'
}

export enum referenceType {
    CAMPAIGN = 'CAMPAIGN',
    PROFILE = 'PROFILE',
    CHARACTER = 'CHARACTER',
    NONE = 'NONE'
}

export interface IHistory extends Document {
    event: string,
    description: string,
    user: Schema.Types.ObjectId,
    origin: origin,
    referenceType: string,
    body: any,
    reference: Schema.Types.ObjectId
}

const historySchema = new Schema({
    event: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    user: {
        type: Schema.Types.ObjectId,
        required: true
    },
    state: {
        type: String,
        enum: origin,
        required: true,
    },
    referenceType: {
        type: String,
        required: true
    },
    body: {
        type: Schema.Types.Mixed
    },
    reference: {
        type: Schema.Types.ObjectId
    }
}, {
    timestamps: true
})


export default model<IHistory>('Histories', historySchema);