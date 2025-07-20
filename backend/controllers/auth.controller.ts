import { generateAccessToken, generateRefreshToken, validateToken } from "../jwt";
import { sendMail } from "../mail";
import {Request, Response, CookieOptions } from 'express';
import User, { IUser } from '../models/User';

export const login = async (req: Request, res: Response) => {
    if (!req.body.email || !req.body.password) return res.status(400).json({errMsg: 'Faltan datos'});
    const user = await User.findOne({email: req.body.email});
    if (!user) return res.status(406).json({errMsg: 'Usuario no valido'});
    const correctPassword: boolean = await user.validatePassword(req.body.password);
    if (!correctPassword) return res.status(406).json({errMsg: 'Contraseña incorrecta'});
    const accessToken = generateAccessToken({_id: user._id, user: user.username, email: user.email});
    const refreshToken = generateRefreshToken({_id: user._id, user: user.username, email: user.email});
    var objectPropertiesCookie: CookieOptions = { secure: true, sameSite: "strict",  maxAge: 365 * 24 * 60 * 60 * 1000};
    if (req.body.rememberMe) {
      if (req.body.rememberMe != true) {
        delete objectPropertiesCookie['maxAge'];
      }
    } else {
      delete objectPropertiesCookie['maxAge'];
    }
    
    res.cookie('jwt', refreshToken, objectPropertiesCookie);
    res.header('auth-token', accessToken).json({
      message: 'Usuario autenticado',
      user: {_id: user._id, user: user.username, email: user.email},
      token: accessToken
    })
  }

export const signup = async (req: Request, res: Response) => {
  if (!req.body.username || !req.body.email || !req.body.password) return res.status(400).json({errMsg: 'Faltan datos'});
  const user : IUser = new User({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
    join_date: new Date()
  });
  user.password = await user.encryptPassword(user.password);
  try {
    const savedUser = await user.save();
    const accessToken : string = generateAccessToken({_id: savedUser._id, user: savedUser.username, email: savedUser.email});
    const refreshToken = generateRefreshToken({_id: user._id, user: user.username, email: user.email});
    var objectPropertiesCookie: CookieOptions = { secure: true, sameSite: 'strict'};
    res.cookie('jwt', refreshToken, objectPropertiesCookie);
    res.header('auth-token', accessToken).json({
      message: 'Usuario registrado',
      user: {_id: savedUser._id, user: savedUser.username, email: savedUser.email},
      token: accessToken
    })
  } catch (e) {
    res.status(400).json(e);
  }
}

export const logout = async (req: Request, res: Response) => {
  res.clearCookie('jwt', {sameSite: "strict", secure: true});
  res.send(200);
}


export const forgotPassword = async (req: Request, res: Response) => {
    if (!req.body.email) return res.status(400).json({errMsg: 'Faltan datos'});
    const user = await User.findOne({email: req.body.email});
    if (!user) return res.status(406).json({errMsg: 'No User found'});
    const token = generateAccessToken({ _id: user._id, user: user.username, email: user.email });
    const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${token}`;
    await sendMail(
        user.email,
        'Mesa Virtual - Actualizar contraseña',
        `Ingresa en el siguiente link para crear una nueva contraseña: ${resetLink}`,
        `<p>Ingresa en el siguiente link para crear una nueva contraseña: <a href="${resetLink}">Restablecer contraseña</a></p>`
    );
    res.status(200).json({message: 'Se ha enviado un correo para recuperar la contraseña'});
}

export const resetPassword = async (req: Request, res: Response) => {
    if (!req.body.password || !req.body.token) return res.status(400).json({errMsg: 'Faltan datos'});
    try {
        await validateToken(req, res, () => {});
        if (res.statusCode !== 200 && res.statusCode != undefined) return;
    } catch (err) {
        return res.status(401).json({ errMsg: 'Token inválido o expirado' });
    }
    
    const user = await User.findById(req.body.userId);
    if (!user) return res.status(406).json({errMsg: 'No User found'});
    const pass = await user.encryptPassword(req.body.password);
    const recievedUser = await User.findOneAndUpdate(
        { _id: req.body.userId }, 
        { $set: {password: pass} },
        {
            new: true
        }
    );
    if (!recievedUser) return res.status(406).json({errMsg: 'Error en la actualización'});
    res.status(200).json({message: 'Contraseña actualizada'});
}