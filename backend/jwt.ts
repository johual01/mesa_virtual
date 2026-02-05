import jwt from 'jsonwebtoken';
import config from './env';
import { Request, Response } from 'express';
import User from './models/User';

export interface TokenPayload {
    _id: string;
    user: string;
    email: string;
    iat?: number;
    exp?: number;
}

const ACCESS_TOKEN_EXPIRY = '15m';
const REFRESH_TOKEN_EXPIRY = '365d';

export function generateAccessToken(user: object): string {
    return jwt.sign(user, config.SECRET, { expiresIn: ACCESS_TOKEN_EXPIRY });
}

export function generateRefreshToken(user: object): string {
    return jwt.sign(user, config.REFRESH_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRY });
}

export async function validateToken(req: Request, res: Response, next: Function, isResetPassword: boolean = false) {
    const accessToken = req.header('Authorization')?.replace('Bearer ', '');
    if (!accessToken) {
        return res.status(401).json({ message: 'Acceso denegado, token no enviado' });
    }

    try {
        const decoded = jwt.verify(accessToken, config.SECRET) as TokenPayload;
        if (isResetPassword) {
            return next(decoded);
        }

        console.log('validateToken - Decoded token:', decoded); // Debug log
        console.log('validateToken - Request body userId:', req.body.userId); // Debug log
        console.log('validateToken - Request params userId:', req.params.userId); // Debug log
        const userId = req.body.userId || req.params.userId;

        if (!userId) {
            return res.status(400).json({ message: 'El id del usuario no fue enviado' });
        }

        const userFromDb = await User.findById(userId);
        if (!userFromDb) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        if (decoded.user !== userFromDb.username) {
            return res.status(403).json({ message: 'Token no válido para este usuario' });
        }

        next();
    } catch (e) {
        return res.status(401).json({ message: 'Acceso denegado, token expirado o incorrecto' });
    }
}

export function refreshToken(req: Request, res: Response) {
    const refreshTokenCookie = req.cookies?.jwt;

    if (!refreshTokenCookie) {
        return res.status(401).json({ message: 'No se encontró token de refresco' });
    }

    try {
        const decoded = jwt.verify(refreshTokenCookie, config.REFRESH_SECRET) as TokenPayload;
        const tokenPayload = { _id: decoded._id, user: decoded.user, email: decoded.email };
        const accessToken = generateAccessToken(tokenPayload);

        return res.header('auth-token', accessToken).status(200).json({
            message: 'Token refrescado',
            user: tokenPayload,
            token: accessToken
        });
    } catch (e) {
        return res.status(401).json({ message: 'Token de refresco inválido o expirado' });
    }
}