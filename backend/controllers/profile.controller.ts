import {CookieOptions, Request, Response} from 'express';
import User from '../models/User';
import {saveImage} from '../functions';
import { generateAccessToken, generateRefreshToken } from '../jwt';
import { Types } from 'mongoose';

interface setObj {
    $set: {
        username: string,
        email: string,
        password?: string,
        pictureRoute?: string
    }
}

export const getProfile = async (req: Request, res: Response) => {
    const user = await User.findById(req.params.userId).select('email joinDate pictureRoute username _id');
    if (!user) return res.status(406).json('No User found');
    res.send(user);
}

export const alterProfile = async (req: Request, res: Response) => {
    if (!req.body.username || !req.body.mail || !req.body.contrasenaActual) return res.status(400).json({errMsg: 'Faltan datos'});
    const user = await User.findById(req.body.userId);
    if (!user) return res.status(406).json({errMsg: 'No User found'});
    const correctPassword: boolean = await user.validatePassword(req.body.contrasenaActual);
    if (!correctPassword) return res.status(406).json({errMsg: 'Contraseña incorrecta'});
    var setObj: setObj = {
        $set: {
            username: req.body.username,
            email: req.body.mail,
            password: '',
            pictureRoute: ''
        }
    } 
    if (req.body.contrasena == '') {
        delete setObj.$set['password']
    } else {
        const pass = await user.encryptPassword(req.body.contrasena);
        setObj.$set.password = pass;
    }
    
    var urlImage = '';
    if (req.body.image != "" && req.body.image.indexOf('http') == -1) {
        const result = await saveImage(req.body.image, user._id as Types.ObjectId, 'PROFILES');
        if (typeof(result) == 'string') {
            urlImage = result;
            setObj.$set.pictureRoute = urlImage;
        } else {
            return res.status(406).json({errMsg: 'No se pudo guardar la imagen'});
        }
    } else {
        delete setObj.$set['pictureRoute']
    }
    
    const recievedUser = await User.findOneAndUpdate(
        { _id: req.body.userId }, 
        setObj,
        {
            new: true
        }
    );
    if (!recievedUser) return res.status(406).json({errMsg: 'Error en la actualización'});
    const accessToken = generateAccessToken({_id: recievedUser._id, user: recievedUser.username, email: recievedUser.email});
    const refreshToken = generateRefreshToken({_id: recievedUser._id, user: recievedUser.username, email: recievedUser.email});
    var objectPropertiesCookie: CookieOptions = { secure: true, sameSite: 'none'};
    res.cookie('jwt', refreshToken, objectPropertiesCookie);
    res.header('auth-token', accessToken).json({
      message: 'Usuario actualizado',
      user: {_id: recievedUser._id, user: recievedUser.username, email: recievedUser.email},
      token: accessToken
    });
}