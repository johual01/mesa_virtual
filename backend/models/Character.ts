import {Schema, model, Document} from 'mongoose';

export interface ICharacter extends Document {
    name: string,
    dueno: Schema.Types.ObjectId
}

const characterSchema = new Schema({
    name: {
        type: String,
        required: true,
        min: 4,
        lowercase: true
    },
    dueno: {
        type: Schema.Types.ObjectId,
        required: true
    }
})


export default model<ICharacter>('Characters', characterSchema);