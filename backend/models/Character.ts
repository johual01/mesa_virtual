import {Schema, model, Document} from 'mongoose';

export enum system {
    DND5E = 'DND5E',
    PERSONAD20 = 'PERSONAD20',
}
export interface ICharacter extends Document {
    name: string,
    player: Schema.Types.ObjectId,
    system: system,
    backstory: {
        history: string,
        personality: string,
        appearance: string,
        traits: string,
        defects: string,
        ideals: string,
        dreams: string,
        bonds: string,
        trauma: string,
    }
}

const characterSchema = new Schema({
    name: {
        type: String,
        required: true,
        min: 4,
        lowercase: true
    },
    player: {
        type: Schema.Types.ObjectId,
        required: true
    },
    system: {
        type: String,
        enum: system,
        required: true
    },
    backstory: {
        history: {
            type: String
        },
        personality: {
            type: String
        },
        appearance: {
            type: String
        },
        traits: {
            type: String
        },
        defects: {
            type: String
        },
        ideals: {
            type: String
        },
        dreams: {
            type: String
        },
        bonds: {
            type: String
        },
        trauma: {
            type: String
        }
    }
}, {
    timestamps: true
})


export default model<ICharacter>('Characters', characterSchema);