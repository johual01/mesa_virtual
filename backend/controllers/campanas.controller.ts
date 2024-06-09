import {Request, Response} from 'express';
import Campana, { ICampana } from '../models/Campanas';
import Personaje, { IPersonaje } from '../models/Personajes';
import { Types, disconnect } from 'mongoose';
import { saveImage } from '../functions';
import { IUser } from '../models/User';

export const getCampanas =  async (req: Request, res: Response) => {
    var id = new Types.ObjectId(req.body.userId);
    const buscarCampanas = await Campana.aggregate(
        [
            {
                $match: {
                    $or: [
                        {
                            dueno: id
                        },
                        {
                            miembros: {
                                $in: [id]
                            }
                        }
                    ]
                }
            },
            {
                $project: {
                    _id: 1,
                    name: 1,
                    imgsrc: 1
                }
            }
        ]
    );
    res.send(
        {
            campanas: buscarCampanas
        }
    )
}

export const createCampana = async (req: Request, res: Response) => {
    try {
        var objCampana = {
            name: req.body.name,
            dueno: new Types.ObjectId(req.body.userId),
            miembros: [],
            personajes: [],
            imgsrc: '',
            desc: req.body.desc,
            private_notes: req.body.private_notes,
            diario: [],
            entrada_publica: req.body.entrada_publica
        }
        if (req.body.imgsrc) {
            var srcImage = '';
            if ((req.body.imgsrc).indexOf('https://') == -1) {
                const srcImageFinal = await saveImage(req.body.imgsrc);
                if (typeof(srcImageFinal) == 'string') {
                    srcImage = srcImageFinal;
                }
            } else {
                srcImage = req.body.imgsrc;
            }
            objCampana.imgsrc = srcImage;
        }
        const campana : ICampana = new Campana(objCampana);
        const savedCampana = await campana.save();
        res.send(
            {
                message: "Campaña Creada",
                campana: savedCampana
            }
        );
    } catch (e) {
        res.status(400).json(e);
    }
}

export const deleteCampana = async (req: Request, res: Response) => {
    try {
        const objectid = req.body.userId;
        const doc = await Campana.findOne(
            {
                _id: req.body.id
            }
        );
        if (doc) {
            if (doc.dueno.toString() == objectid) {
                doc.remove();
                res.send({success: true})
            } else {
                res.send({success: false, error: 'Solo el dueño puede eliminar la campaña'})
            }
        } else {
            res.send({success: false, error: 'No se encontró la campaña'})
        }
    } catch (e) {
        res.send({success: false, error: e})
    }
}

export const openCampana = async (req: Request, res: Response) => {
    const abrirCampana = await Campana.findById(req.body.idCampana)
                        .populate<{ dueno: IUser }>('dueno', '-password -email')
                        .populate('miembros', '-password -email -join_date')
                        .populate({path: 'personajes', model: Personaje});
    if (!abrirCampana) return;
    var object = abrirCampana.toJSON();
    if (object.dueno._id.toString() != req.body.userId) {
        delete object['private_notes'];
    }
    res.send(
        {
            campanas: object
        }
    )
}

export const checkNombreCampana = async (req: Request, res: Response) => {
    const campana = await Campana.findOne({name: req.body.name});
    if (campana) {
      return res.status(200).json({
        exist: true
      })
    } else {
      return res.status(200).json({
        exist: false
      })
    }
}

export const editCampana = async (req: Request, res: Response) => {
    try {
        var objCampana = {
            name: req.body.name,
            juego: req.body.juego,
            imgsrc: '',
            desc: req.body.desc,
            private_notes: req.body.private_notes,
            entrada_publica: req.body.entrada_publica
        }
        if (req.body.imgsrc) {
            var srcImage = '';
            if ((req.body.imgsrc).indexOf('https://') == -1) {
                const srcImageFinal = await saveImage(req.body.imgsrc);
                if (typeof(srcImageFinal) == 'string') {
                    srcImage = srcImageFinal;
                }
            } else {
                srcImage = req.body.imgsrc;
            }
            objCampana.imgsrc = srcImage;
        }
        const updatedCampana = await Campana.findOneAndUpdate(
            {
                _id: req.body.id
            }, 
            {
               $set: objCampana
            },
            {
                new: true
            }
        );
        res.send(
            {
                message: "Campaña Actualizada",
                campana: updatedCampana
            }
        );
    } catch (e) {
        res.status(400).json(e);
    }
}

export const joinCampana = async (req: Request, res: Response) => {
    try {
        const objectid = req.body.userId;
        

        const updated = await Campana.findOneAndUpdate(
            {
                _id: req.body.idCampana,
                $and: [
                    { dueno: req.body.duenoId }, 
                    { dueno: {$ne: objectid} }
                ],
                miembros: {
                    $nin: [objectid]
                }
            },
            {
                $push: {
                    miembros: objectid
                }
            }
        );
        console.log(updated);
        res.send({success: true})
    } catch (e) {
        res.send({success: false, error: e})
    }
}

export const removeFromCampana = async (req: Request, res: Response) => {
    try {
        const objectid = req.body.userId;
        const player = req.body.playerId;
        const doc = await Campana.findOne(
            {
                _id: req.body.id
            }
        );
        if (doc) {
            if (doc.dueno.toString() == objectid) {
                var object = doc.toObject();
                object.miembros = object.miembros.filter(val => val.toString() != player);
                doc.populate({path: 'personajes', model: Personaje});
                object.personajes = object.personajes.filter(val => val.dueno.toString() != player);
                doc.overwrite(object);
                doc.save();
                //doc.remove();
                res.send({success: true})
            } else {
                res.send({success: false, error: 'Solo el dueño puede eliminar a un personaje'})
            }
        } else {
            res.send({success: false, error: 'No se encontró la campaña'})
        }
    } catch (e) {
        res.send({success: false, error: e})
    }
}

export const addRegister = async (req: Request, res: Response) => {
    try {
        const obj = {
            name: req.body.nombre,
            desc: req.body.desc,
            fecha: new Date()
        }
        const updated = await Campana.updateOne(
            {
                _id: req.body.idCampana
            },
            {
                $push: {
                    diario: obj
                }
            }
        );
        console.log(updated);
        res.send({success: true})
    } catch (e) {
        res.send({success: false})
    }
}

export const updateRegister = async (req: Request, res: Response) => {
    try {
        const obj = {
            name: req.body.nombre,
            desc: req.body.desc,
            fecha: new Date()
        }
        const updated = await Campana.updateOne(
            {
                _id: req.body.idCampana
            },
            {
                $set: {
                    [`diario.${req.body.position}.name`] : obj.name,
                    [`diario.${req.body.position}.desc`] : obj.desc,
                    [`diario.${req.body.position}.fecha`] : obj.fecha
                }
            }
        );
        console.log(updated);
        res.send({success: true})
    } catch (e) {
        res.send({success: false, error: e})
    }
}

export const deleteRegister = async (req: Request, res: Response) => {
    try {
        const updated = await Campana.updateOne(
            {
                _id: req.body.idCampana
            },
            [
                {
                  $set: {
                    diario: {
                      $concatArrays: [
                        {
                          $slice: [
                            `$diario`,
                            req.body.position,
                          ]
                        },
                        {
                          $slice: [
                            `$diario`,
                            req.body.position + 1,
                            {
                              $size: `$diario`
                            }
                          ]
                        }
                      ]
                    }
                  }
                }
            ]
            /*{
                $set: { diario: {
                    $concatArrays:[ 
                        {$slice:[ "$diario", req.body.position ]}, 
                        {$slice:[ "$diario", {$add:[1,req.body.position]}, {$size:"$sequence"}]}
                     ]
                }}
            }*/
        );
        console.log(updated);
        res.send({success: true})
    } catch (e) {
        res.send({success: false, error: e})
    }
}