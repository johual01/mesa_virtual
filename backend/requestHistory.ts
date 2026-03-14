import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { Types } from 'mongoose';
import config from './env';
import RequestHistory from './models/RequestHistory';

const SENSITIVE_KEYS = new Set([
    'password',
    'newpassword',
    'confirmpassword',
    'token',
    'refreshtoken',
    'accesstoken',
    'authorization',
    'credential',
    'secret',
]);

const sanitizeValue = (value: unknown): unknown => {
    if (value === null || value === undefined) {
        return value;
    }

    if (Buffer.isBuffer(value)) {
        return '[BINARY_DATA]';
    }

    if (Array.isArray(value)) {
        return value.map(sanitizeValue);
    }

    if (typeof value !== 'object') {
        return value;
    }

    const obj = value as Record<string, unknown>;
    const sanitized: Record<string, unknown> = {};

    for (const [key, current] of Object.entries(obj)) {
        if (SENSITIVE_KEYS.has(key.toLowerCase())) {
            sanitized[key] = '[REDACTED]';
            continue;
        }

        sanitized[key] = sanitizeValue(current);
    }

    return sanitized;
};

const extractUserIdFromToken = (req: Request): Types.ObjectId | undefined => {
    const authHeader = req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return undefined;
    }

    const token = authHeader.replace('Bearer ', '').trim();

    try {
        const decoded = jwt.verify(token, config.SECRET);
        if (typeof decoded === 'object' && decoded !== null) {
            const payload = decoded as JwtPayload & { _id?: string };
            if (payload._id && Types.ObjectId.isValid(payload._id)) {
                return new Types.ObjectId(payload._id);
            }
        }
    } catch {
        return undefined;
    }

    return undefined;
};

export const requestHistoryMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const start = Date.now();

    res.on('finish', () => {
        if (req.path === '/health') {
            return;
        }

        const userFromBody = req.body?.userId;
        const userId =
            (typeof userFromBody === 'string' && Types.ObjectId.isValid(userFromBody)
                ? new Types.ObjectId(userFromBody)
                : undefined) || extractUserIdFromToken(req);

        const body = sanitizeValue(req.body);
        const hasFiles = Boolean((req as Request & { file?: unknown }).file) || Boolean((req as Request & { files?: unknown }).files);

        void RequestHistory.create({
            method: req.method,
            path: req.originalUrl || req.url,
            statusCode: res.statusCode,
            durationMs: Date.now() - start,
            hasFiles,
            origin: userId ? 'USER' : 'SYSTEM',
            user: userId,
            ip: req.ip,
            userAgent: req.headers['user-agent'],
            params: sanitizeValue(req.params),
            query: sanitizeValue(req.query),
            body,
        }).catch((error: unknown) => {
            console.error('Error guardando request history:', error);
        });
    });

    next();
};
