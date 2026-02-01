import {CookieOptions, Request, Response} from 'express';
import User from '../models/User';
import {saveImage, UploadedFile} from '../functions';
import { generateAccessToken, generateRefreshToken } from '../jwt';
import { Types } from 'mongoose';

interface UpdateData {
    username: string;
    email: string;
    password?: string;
    pictureRoute?: string;
}

// Extender Request para incluir el archivo de multer
interface MulterRequest extends Request {
    file?: Express.Multer.File;
}

export const getProfile = async (req: Request, res: Response) => {
    try {
        const user = await User.findById(req.params.userId).select('email joinDate pictureRoute username _id');
        
        if (!user) {
            return res.status(404).json({ errMsg: 'Usuario no encontrado' });
        }

        res.status(200).json(user);
    } catch (e) {
        res.status(500).json({ errMsg: 'Error al obtener perfil', error: e });
    }
}

export const alterProfile = async (req: MulterRequest, res: Response) => {
    try {
        if (!req.body.username || !req.body.email || !req.body.currentPassword) {
            return res.status(400).json({ errMsg: 'Faltan datos' });
        }

        const user = await User.findById(req.body.userId);
        if (!user) {
            return res.status(404).json({ errMsg: 'Usuario no encontrado' });
        }

        const correctPassword = await user.validatePassword(req.body.currentPassword);
        if (!correctPassword) {
            return res.status(401).json({ errMsg: 'Contraseña incorrecta' });
        }

        const updateData: UpdateData = {
            username: req.body.username,
            email: req.body.email
        };

        // Actualizar contraseña si se proporciona
        if (req.body.password && req.body.password.trim() !== '') {
            const encryptedPassword = await user.encryptPassword(req.body.password);
            updateData.password = encryptedPassword;
        }

        // Procesar imagen si se proporciona un archivo
        if (req.file) {
            const uploadedFile: UploadedFile = {
                buffer: req.file.buffer,
                mimetype: req.file.mimetype,
                originalname: req.file.originalname,
                size: req.file.size
            };
            const savedImageUrl = await saveImage(uploadedFile, user._id as Types.ObjectId, 'profiles');
            
            if (typeof savedImageUrl === 'string') {
                updateData.pictureRoute = savedImageUrl;
            } else {
                return res.status(500).json({ errMsg: 'No se pudo guardar la imagen' });
            }
        } else if (req.body.imageUrl && req.body.imageUrl.startsWith('http')) {
            // Permitir URLs externas directamente
            updateData.pictureRoute = req.body.imageUrl;
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.body.userId,
            { $set: updateData },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(500).json({ errMsg: 'Error en la actualización' });
        }

        const tokenPayload = { 
            _id: updatedUser._id, 
            user: updatedUser.username, 
            email: updatedUser.email 
        };
        const accessToken = generateAccessToken(tokenPayload);
        const refreshToken = generateRefreshToken(tokenPayload);

        const cookieOptions: CookieOptions = { 
            secure: true, 
            sameSite: 'none',
            httpOnly: true
        };

        res.cookie('jwt', refreshToken, cookieOptions);
        res.header('auth-token', accessToken).json({
            message: 'Usuario actualizado',
            user: { 
                _id: updatedUser._id, 
                user: updatedUser.username, 
                email: updatedUser.email 
            },
            token: accessToken
        });
    } catch (e) {
        res.status(500).json({ errMsg: 'Error al actualizar perfil', error: e });
    }
}