import { generateAccessToken, generateRefreshToken, validateToken } from "../jwt";
import { sendMail } from "../mail";
import {Request, Response, CookieOptions } from 'express';
import User, { IUser } from '../models/User';
import { TokenPayload } from "../jwt";
import { OAuth2Client } from 'google-auth-library';
import crypto from 'node:crypto';

const buildCookieOptions = (rememberMe?: boolean): CookieOptions => ({
    secure: true,
    sameSite: 'strict',
    httpOnly: true,
    ...(rememberMe && { maxAge: 365 * 24 * 60 * 60 * 1000 })
});

const buildAuthPayload = (user: { _id: unknown; username: string; email: string }) => ({
    _id: user._id,
    user: user.username,
    email: user.email
});

const sanitizeUsername = (value: string) => {
    const cleaned = value
        .toLowerCase()
        .replace(/[^a-z0-9_]/g, '_')
        .replace(/_+/g, '_')
        .replace(/^_+|_+$/g, '');

    if (cleaned.length >= 4) {
        return cleaned;
    }

    return `${cleaned}${'user'.slice(0, 4 - cleaned.length)}`;
};

const getAvailableUsername = async (base: string) => {
    const sanitizedBase = sanitizeUsername(base);
    let username = sanitizedBase;
    let suffix = 1;

    while (await User.exists({ username })) {
        username = `${sanitizedBase}_${suffix}`;
        suffix += 1;
    }

    return username;
};

export const login = async (req: Request, res: Response) => {
    if (!req.body.email || !req.body.password) {
        return res.status(400).json({ errMsg: 'Faltan datos' });
    }

    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        return res.status(401).json({ errMsg: 'Credenciales inválidas' });
    }

    const correctPassword = await user.validatePassword(req.body.password);
    if (!correctPassword) {
        return res.status(401).json({ errMsg: 'Credenciales inválidas' });
    }

    const tokenPayload = buildAuthPayload(user);
    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);

    const cookieOptions = buildCookieOptions(req.body.rememberMe);

    res.cookie('jwt', refreshToken, cookieOptions);
    res.header('auth-token', accessToken).json({
        message: 'Usuario autenticado',
        user: { _id: user._id, user: user.username, email: user.email },
        token: accessToken
    });
}

export const signup = async (req: Request, res: Response) => {
    if (!req.body.username || !req.body.email || !req.body.password) {
        return res.status(400).json({ errMsg: 'Faltan datos' });
    }

    const user: IUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        join_date: new Date()
    });

    user.password = await user.encryptPassword(user.password);

    try {
        const savedUser = await user.save();
        const tokenPayload = buildAuthPayload(savedUser);
        const accessToken = generateAccessToken(tokenPayload);
        const refreshToken = generateRefreshToken(tokenPayload);

        const cookieOptions = buildCookieOptions();

        res.cookie('jwt', refreshToken, cookieOptions);
        res.header('auth-token', accessToken).json({
            message: 'Usuario registrado',
            user: { _id: savedUser._id, user: savedUser.username, email: savedUser.email },
            token: accessToken
        });
    } catch (e) {
        res.status(400).json({ errMsg: 'Error al registrar usuario', error: e });
    }
}

export const logout = async (req: Request, res: Response) => {
    res.clearCookie('jwt', { sameSite: 'strict', secure: true, httpOnly: true });
    res.status(200).json({ message: 'Sesión cerrada' });
}

export const googleLogin = async (req: Request, res: Response) => {
    const credential = req.body?.credential;
    if (!credential) {
        return res.status(400).json({ errMsg: 'Credencial de Google inválida' });
    }

    const googleClientId = process.env.GOOGLE_CLIENT_ID;
    if (!googleClientId) {
        return res.status(500).json({ errMsg: 'Google OAuth no está configurado' });
    }

    try {
        const client = new OAuth2Client(googleClientId);
        const ticket = await client.verifyIdToken({ idToken: credential, audience: googleClientId });
        const payload = ticket.getPayload();

        if (!payload?.email) {
            return res.status(400).json({ errMsg: 'No se pudo verificar el correo de Google' });
        }

        const email = payload.email.toLowerCase();
        let user = await User.findOne({ email });

        if (!user) {
            const baseUsername = payload.name || email.split('@')[0] || 'user';
            const username = await getAvailableUsername(baseUsername);
            const randomPassword = crypto.randomBytes(32).toString('hex');

            const newUser = new User({
                username,
                email,
                password: randomPassword,
                joinDate: new Date(),
                pictureRoute: payload.picture || undefined
            });

            newUser.password = await newUser.encryptPassword(newUser.password);
            user = await newUser.save();
        } else if (payload.picture && user.pictureRoute !== payload.picture) {
            user.pictureRoute = payload.picture;
            await user.save();
        }

        if (!user) {
            return res.status(500).json({ errMsg: 'No se pudo crear la cuenta de Google' });
        }

        const tokenPayload = buildAuthPayload(user);
        const accessToken = generateAccessToken(tokenPayload);
        const refreshToken = generateRefreshToken(tokenPayload);

        res.cookie('jwt', refreshToken, buildCookieOptions(true));
        return res.header('auth-token', accessToken).json({
            message: 'Usuario autenticado con Google',
            user: { _id: user._id, user: user.username, email: user.email },
            token: accessToken
        });
    } catch (error) {
        return res.status(401).json({ errMsg: 'No se pudo autenticar con Google' });
    }
}


export const forgotPassword = async (req: Request, res: Response) => {
    if (!req.body.email) {
        return res.status(400).json({ errMsg: 'Faltan datos' });
    }

    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        // Por seguridad, no revelar si el usuario existe o no
        return res.status(200).json({ message: 'Si el correo existe, se ha enviado un enlace de recuperación' });
    }

    try {
        const token = generateAccessToken({ _id: user._id, user: user.username, email: user.email });
        const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${token}`;

        await sendMail(
            user.email,
            'Mesa Virtual - Actualizar contraseña',
            `Ingresa en el siguiente link para crear una nueva contraseña: ${resetLink}`,
            `<p>Ingresa en el siguiente link para crear una nueva contraseña: <a href="${resetLink}">Restablecer contraseña</a></p>`
        );

        res.status(200).json({ message: 'Si el correo existe, se ha enviado un enlace de recuperación' });
    } catch (error) {
        res.status(500).json({ errMsg: 'Error al enviar el correo de recuperación' });
    }
}

export const resetPassword = async (req: Request, res: Response) => {
    if (!req.body.password) {
        return res.status(400).json({ errMsg: 'Faltan datos' });
    }

    let tokenDecoded;
    try {
        tokenDecoded = await validateToken(req, res, (decoded: TokenPayload) => { return decoded }, true);
        if (res.statusCode !== 200 && res.statusCode !== undefined) {
            return;
        }
    } catch (err) {
        return res.status(401).json({ errMsg: 'Token inválido o expirado' });
    }

    try {
        const user = await User.findById(tokenDecoded._id);
        if (!user) {
            return res.status(404).json({ errMsg: 'Usuario no encontrado' });
        }

        const encryptedPassword = await user.encryptPassword(req.body.password);
        const updatedUser = await User.findOneAndUpdate(
            { _id: tokenDecoded._id },
            { $set: { password: encryptedPassword } },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(500).json({ errMsg: 'Error al actualizar la contraseña' });
        }

        res.status(200).json({ message: 'Contraseña actualizada correctamente' });
    } catch (error) {
        console.log('Error al actualizar la contraseña:', error);
        res.status(500).json({ errMsg: 'Error al actualizar la contraseña' });
    }
}
