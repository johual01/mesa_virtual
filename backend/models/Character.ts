import {Schema, model, Document} from 'mongoose';

export interface ICharacter extends Document {
    name: string,
    player: Schema.Types.ObjectId
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
    }
}, {
    timestamps: true
})


export default model<ICharacter>('Characters', characterSchema);