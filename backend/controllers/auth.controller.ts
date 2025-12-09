import { generateAccessToken, generateRefreshToken, validateToken } from "../jwt";
import { sendMail } from "../mail";
import {Request, Response, CookieOptions } from 'express';
import User, { IUser } from '../models/User';

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

    const tokenPayload = { _id: user._id, user: user.username, email: user.email };
    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);

    const cookieOptions: CookieOptions = {
        secure: true,
        sameSite: 'strict',
        httpOnly: true,
        ...(req.body.rememberMe && { maxAge: 365 * 24 * 60 * 60 * 1000 })
    };

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
        const tokenPayload = { _id: savedUser._id, user: savedUser.username, email: savedUser.email };
        const accessToken = generateAccessToken(tokenPayload);
        const refreshToken = generateRefreshToken(tokenPayload);

        const cookieOptions: CookieOptions = {
            secure: true,
            sameSite: 'strict',
            httpOnly: true
        };

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
    if (!req.body.password || !req.body.token) {
        return res.status(400).json({ errMsg: 'Faltan datos' });
    }

    try {
        await validateToken(req, res, () => {});
        if (res.statusCode !== 200 && res.statusCode !== undefined) {
            return;
        }
    } catch (err) {
        return res.status(401).json({ errMsg: 'Token inválido o expirado' });
    }

    try {
        const user = await User.findById(req.body.userId);
        if (!user) {
            return res.status(404).json({ errMsg: 'Usuario no encontrado' });
        }

        const encryptedPassword = await user.encryptPassword(req.body.password);
        const updatedUser = await User.findOneAndUpdate(
            { _id: req.body.userId },
            { $set: { password: encryptedPassword } },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(500).json({ errMsg: 'Error al actualizar la contraseña' });
        }

        res.status(200).json({ message: 'Contraseña actualizada correctamente' });
    } catch (error) {
        res.status(500).json({ errMsg: 'Error al actualizar la contraseña' });
    }
}