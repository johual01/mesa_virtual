import {Schema, model, Document, Types} from 'mongoose';
import { IPersonaje } from '../models/Personajes';

export interface ICampana extends Document {
    name: string,
    juego: string,
    dueno: Schema.Types.ObjectId,
    miembros: [Types.ObjectId],
    personajes: [IPersonaje],
    imgsrc?: string,
    desc?: string,
    private_notes?: string,
    diario?: [],
    entrada_publica: boolean
}

const campanaSchema = new Schema({
    name: {
        type: String,
        required: true,
        min: 4
    },
    juego: {
        type: String,
        required: true
    },
    dueno: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    miembros: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    personajes: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Personaje'
        }
    ],
    imgsrc: {
        type: String,
        required: false
    },
    desc: {
        type: String,
        required: false
    },
    private_notes: {
        type: String,
        required: false
    },
    diario: {
        type: Array,
        required: false
    },
    entrada_publica: {
        type: Boolean,
        required: true
    }
})


export default model<ICampana>('Campana', campanaSchema);