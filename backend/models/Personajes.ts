import {Schema, model, Document} from 'mongoose';

export interface IPersonaje extends Document {
    name: string,
    dueno: Schema.Types.ObjectId
}

const personajeSchema = new Schema({
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


export default model<IPersonaje>('Personaje', personajeSchema);