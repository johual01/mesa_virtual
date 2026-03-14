import { Schema, model, Document, Types } from 'mongoose';

export interface IRequestHistory extends Document {
    method: string;
    path: string;
    statusCode: number;
    durationMs: number;
    hasFiles: boolean;
    origin: string;
    user?: Types.ObjectId;
    ip?: string;
    userAgent?: string;
    params?: Record<string, unknown>;
    query?: Record<string, unknown>;
    body?: unknown;
}

const requestHistorySchema = new Schema({
    method: {
        type: String,
        required: true,
    },
    path: {
        type: String,
        required: true,
    },
    statusCode: {
        type: Number,
        required: true,
    },
    durationMs: {
        type: Number,
        required: true,
    },
    hasFiles: {
        type: Boolean,
        required: true,
        default: false,
    },
    origin: {
        type: String,
        required: true,
        default: 'SYSTEM'
    },
    user: {
        type: Schema.Types.ObjectId,
        required: false,
        ref: 'Users'
    },
    ip: {
        type: String,
    },
    userAgent: {
        type: String,
    },
    params: {
        type: Schema.Types.Mixed,
    },
    query: {
        type: Schema.Types.Mixed,
    },
    body: {
        type: Schema.Types.Mixed,
    },
}, {
    timestamps: true
});

export default model<IRequestHistory>('RequestHistories', requestHistorySchema);
