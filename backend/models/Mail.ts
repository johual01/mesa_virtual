import { Schema, model, Document } from 'mongoose';

export interface IMail extends Document {
    from: string;
    to: string;
    subject: string;
    text: string;
    html?: string;
    sentAt: Date;
    status: 'pending' | 'sent' | 'failed';
}

const mailSchema = new Schema({
    from: {
        type: String,
        required: true
    },
    to: {
        type: String,
        required: true
    },
    subject: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true
    },
    html: {
        type: String
    },
    sentAt: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['pending', 'sent', 'failed'],
        default: 'pending'
    }
}, {
    timestamps: true
});

export default model<IMail>('Mail', mailSchema);
