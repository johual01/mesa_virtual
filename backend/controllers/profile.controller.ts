import {CookieOptions, Request, Response} from 'express';
import User from '../models/User';
import {saveImage} from '../functions';
import { generateAccessToken, generateRefreshToken } from '../jwt';

interface setObj {
    $set: {
        username: string,
        email: string,
        password?: string,
        picture_route?: string
    }
}

export const profile = async (req: Request, res: Response) => {
    const user = await User.findById(req.body.userId);
    if (!user) return res.status(406).json('No User found');
    res.send({
        email: user.email,
        join_date: user.join_date,
        picture_route: user.picture_route,
        username: user.username,
        _id: user._id
    });
}

export const alterProfile = async (req: Request, res: Response) => {
    const user = await User.findById(req.body.userId);
    if (!user) return res.status(406).json({errMsg: 'No User found'});
    const correctPassword: boolean = await user.validatePassword(req.body.contrasenaActual);
    if (!correctPassword) return res.status(406).json({errMsg: 'Contraseña incorrecta'});
    var setObj: setObj = {
        $set: {
            username: req.body.username,
            email: req.body.mail,
            password: '',
            picture_route: ''
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
        const result = await saveImage(req.body.image, user, 'PROFILES');
        if (typeof(result) == 'string') {
            urlImage = result;
            setObj.$set.picture_route = urlImage;
        } else {
            return res.status(406).json({errMsg: 'No se pudo guardar la imagen'});
        }
    } else {
        delete setObj.$set['picture_route']
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