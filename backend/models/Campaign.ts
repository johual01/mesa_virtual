import {Schema, model, Document, Types} from 'mongoose';
import { ICharacter } from './Character';
import { IUser } from './User';
import { INote } from './Note';
import { IHistory } from './History';

export enum campaignState {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
    DELETED = 'DELETED'
}

export interface ICampaign extends Document {
    name: string,
    owner: Schema.Types.ObjectId | IUser,
    players: [ Types.ObjectId | IUser ],
    characters: [ Types.ObjectId | ICharacter],
    image?: string,
    description?: string,
    notes?: [ Types.ObjectId | INote ],
    publicEntries?: [ Types.ObjectId | INote ],
    history: [ Types.ObjectId | IHistory ],
    state: campaignState,
    stadistics?: {
        //muchas cosas, sí
    }
}

const campaignSchema = new Schema({
    name: {
        type: String,
        required: true,
        min: 4
    },
    owner: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Users'
    },
    state: {
        type: String,
        enum: campaignState,
        default: campaignState.ACTIVE
    },
    players: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Users'
        }
    ],
    characters: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Characters'
        }
    ],
    image: {
        type: String
    },
    description: {
        type: String
    },
    notes: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Notes'
        }
    ],
    publicEntries: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Notes'
        }
    ],
    history: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Histories'
        }
    ],
}, {
    timestamps: true
})


export default model<ICampaign>('Campaign', campaignSchema);