import jwt from 'jsonwebtoken';
import config from './env';
import { Request, Response } from 'express';
import User from './models/User';

interface IUser {
    user: {
        user: string
    } | string,
    iat: number,
    exp: number
}

export function generateAccessToken (user: object) {
    return jwt.sign(user, config.SECRET, {expiresIn: 15 * 60})
}

export function generateRefreshToken (user: object) {
    return jwt.sign(user, config.REFRESH_SECRET, {expiresIn: 365 * 24 * 60 * 60 * 1000})
}

export async function validateToken(req: Request, res: Response, next: Function) {
    const accessToken = req.header('auth-token');
    if (!accessToken) {
        return res.status(401).json('El token no fue adjuntado');
    }
    try {
        const user = jwt.verify(accessToken, config.SECRET) as IUser;
        const userFrom = await User.findById(req.body.userId || req.params.userId);
        var userFinal = "";
        if (!user) return res.status(406).json('No User found');
        if (!userFrom) return res.status(406).json('El id del usuario no fue enviado');
        if (typeof(user.user) == 'string') {
            userFinal = user.user;
        } else {
            userFinal = user.user.user;
        }
        if (userFinal != userFrom.username) return res.status(401).json('token no valido');
        next();
    } catch (e) {
        return res.status(401).json('Acceso denegado, token expirado o incorrecto');
    }
}

export function refreshToken(req: Request, res: Response) {
    if (req.cookies?.jwt) {
        const refreshToken = req.cookies.jwt;
        try {
            const user = jwt.verify(refreshToken, config.REFRESH_SECRET) as IUser;
            const accessToken = jwt.sign({user: user}, config.SECRET, {expiresIn: 15 * 60 });
            return res.header('auth-token', accessToken).status(200).json({mensaje: 'refrescado', user: user, token: accessToken});
        } catch (e) {
            console.log(e);
            return res.status(401).json({message: 'Not Verified'});
        }
    } else {
        return res.status(401).json({message: 'No Cookie'})
    }
}