import {Request, Response} from 'express';
import Campaign, { ICampaign, campaignState } from '../models/Campaign';
import Note, { noteState } from '../models/Note';
import History, { referenceType, origin } from '../models/History';
import { ICharacter } from '../models/Character';
import { Types } from 'mongoose';
import { saveImage } from '../functions';
import { IUser } from '../models/User';

export const getCampaigns =  async (req: Request, res: Response) => {
    var id = new Types.ObjectId(req.body.userId);
    const buscarCampanas = await Campaign.aggregate(
        [
            {
                $match: {
                    $or: [
                        {
                            owner: id
                        },
                        {
                            players: {
                                $in: [id]
                            }
                        }
                    ],
                    state: campaignState.ACTIVE
                }
            },
            {
                $project: {
                    _id: 1,
                    name: 1,
                    image: 1
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

export const createCampaign = async (req: Request, res: Response) => {
    try {
        if (!req.body.name || !req.body.description || !req.body.notes || !req.body.publicEntries) return res.status(400).json({errMsg: 'Faltan datos'});
        var objCampana = {
            name: req.body.name,
            owner: new Types.ObjectId(req.body.userId),
            players: [],
            characters: [],
            image: '',
            description: req.body.description,
            notes: req.body.notes || [],
            history: [],
            publicEntries: req.body.publicEntries || [],
            state: campaignState.ACTIVE,
        }
        if (req.body.image) {
            var srcImage = '';
            if ((req.body.image).indexOf('https://') == -1) {
                const srcImageFinal = await saveImage(req.body.image,  new Types.ObjectId(req.body.userId), 'profilePics');
                if (typeof(srcImageFinal) == 'string') {
                    srcImage = srcImageFinal;
                }
            } else {
                srcImage = req.body.image;
            }
            objCampana.image = srcImage;
        }
        const campaign: ICampaign = new Campaign(objCampana);
        const savedCampaign = await campaign.save();
        const history = new History(
            {
                event: 'Campaña creada',
                description: 'La campaña ha sido creada',
                user: new Types.ObjectId(req.body.userId),
                origin: origin.USER,
                referenceType: referenceType.CAMPAIGN,
                reference: savedCampaign._id,
                body: req.body
            }
        )
        const savedHistory = await history.save();
        savedCampaign.history.push(savedHistory._id as Types.ObjectId);
        await savedCampaign.save();
        res.send(
            {
                message: "Campaña Creada",
                campaign: savedCampaign
            }
        );
    } catch (e) {
        res.status(400).json(e);
    }
}

export const deleteCampaign = async (req: Request, res: Response) => {
    try {
        const objectid = new Types.ObjectId(req.body.userId);
        const doc = await Campaign.findOne(
            {
                _id: new Types.ObjectId(req.params.campaignId)
            }
        );
        if (doc) {
            if (doc.owner as unknown as Types.ObjectId == objectid) {
                doc.state = campaignState.DELETED;
                const history = new History(
                    {
                        event: 'Campaña eliminada',
                        description: 'La campaña ha sido eliminada',
                        user: objectid,
                        origin: origin.USER,
                        referenceType: referenceType.CAMPAIGN,
                        reference: doc._id
                    }
                )
                const savedHistory = await history.save();
                doc.history.push(savedHistory._id as Types.ObjectId);
                await doc.save();
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

export const openCampaign = async (req: Request, res: Response) => {
    const campaign = await Campaign.findById(new Types.ObjectId(req.params.campaignId))
                        .populate<{ owner: IUser }>('owner', '-password -email')
                        .populate<{ players: IUser }>('players', '-password -email -joinDate')
                        .populate('characters')
                        .populate('publicEntries')
                        .populate('notes')
    if (!campaign) return res.send({success: false, error: 'No se encontró la campaña'});
    var object = campaign.toJSON();
    if (object.owner._id.toString() != req.params.userId) {
        delete object['notes'];
    }
    res.send(
        {
            campaign: object
        }
    )
}

export const editCampaign = async (req: Request, res: Response) => {
    try {
        if (!req.body.name || !req.body.description || !req.body.notes || !req.body.publicEntries) return res.status(400).json({errMsg: 'Faltan datos'});
        const campaign = await Campaign.findById(new Types.ObjectId(req.params.campaignId));
        if (!campaign) return res.status(400).json({errMsg: 'No se encontró la campaña'});
        var objCampana = {
            name: req.body.name,
            image: '',
            description: req.body.description,
            notes: req.body.notes,
            publicEntries: req.body.publicEntries
        }
        if (req.body.image) {
            var srcImage = '';
            if ((req.body.image).indexOf('https://') == -1) {
                const srcImageFinal = await saveImage(req.body.image, new Types.ObjectId(req.body.userId), 'campaignPics');
                if (typeof(srcImageFinal) == 'string') {
                    srcImage = srcImageFinal;
                }
            } else {
                srcImage = req.body.image;
            }
            objCampana.image = srcImage;
        }
        const history = new History(
            {
                event: 'Campaña actualizada',
                description: 'La campaña ha sido actualizada',
                user: new Types.ObjectId(req.body.userId),
                origin: origin.USER,
                referenceType: referenceType.CAMPAIGN,
                reference: new Types.ObjectId(req.params.campaignId),
                body: req.body
            }
        )
        const savedHistory = await history.save();
        const updatedCampaign = await Campaign.findOneAndUpdate(
            {
                _id: new Types.ObjectId(req.params.campaignId)
            }, 
            {
               $set: objCampana,
               $push: { history: savedHistory._id }
            },
            {
                new: true
            }
        );
        res.send(
            {
                message: "Campaña Actualizada",
                campaign: updatedCampaign
            }
        );
    } catch (e) {
        res.status(400).json(e);
    }
}

export const joinCampaign = async (req: Request, res: Response) => {
    try {
        const objectid = req.body.userId;
        const campaign = await Campaign.findOne({ _id: new Types.ObjectId(req.params.campaignId) });
        if (!campaign) return res.send({success: false, error: 'No se encontró la campaña'});
        if (campaign.owner == objectid) return res.send({success: false, error: 'No puedes unirte a tu propia campaña'});
        if (campaign.players.includes(objectid)) return res.send({success: false, error: 'Ya estás en la campaña'});
        const history = new History(
            {
                event: 'Se ha unido un nuevo jugador',
                description: 'El jugador ' + objectid + ' se ha unido a la campaña.',
                user: new Types.ObjectId(req.body.userId),
                origin: origin.USER,
                referenceType: referenceType.CAMPAIGN,
                reference: new Types.ObjectId(req.params.campaignId)
            }
        )
        const savedHistory = await history.save();
        const updated = await Campaign.findOneAndUpdate(
            {
                _id: new Types.ObjectId(req.params.campaignId),
                owner: {$ne: objectid},
                players: {
                    $nin: [objectid]
                }
            },
            {
                $push: {
                    players: objectid,
                    history: savedHistory._id
                }
            }
        );
        console.log(updated);
        res.send({success: true})
    } catch (e) {
        res.send({success: false, error: e})
    }
}

export const removeFromCampaign = async (req: Request, res: Response) => {
    try {
        const user = new Types.ObjectId(req.body.userId);
        const player = new Types.ObjectId(req.body.playerId);
        const campaign = new Types.ObjectId(req.body.campaignId);
        const doc = await Campaign.findOne(
            {
                _id: campaign
            }
        );
        if (doc) {
            if (doc.owner as unknown as Types.ObjectId == user || user == player) {
                const history = new History(
                    {
                        event: 'Un jugador ha abandonado la campaña',
                        description: 'El jugador ' + player + ' ha abandonado la campaña.',
                        user,
                        origin: origin.USER,
                        referenceType: referenceType.CAMPAIGN,
                        reference: doc._id
                    }
                )
                const savedHistory = await history.save();
                var object = doc.toObject();
                object.players = object.players.filter(val => val != player);
                await doc.populate('characters');
                object.characters = (object.characters as ICharacter[]).filter(val => val.player as unknown as Types.ObjectId != player);
                doc.overwrite(object);
                doc.history.push(savedHistory._id as Types.ObjectId);
                await doc.save();
                res.send({success: true})
            } else {
                res.send({success: false, error: 'Solo el dueño puede eliminar a otro jugador'})
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
        if (!req.body.title || !req.body.text || !req.body.campaignId) return res.status(400).json({errMsg: 'Faltan datos'});
        const campaign = await Campaign.findById(new Types.ObjectId(req.body.campaignId));
        if (!campaign) return res.send({success: false, error: 'No se encontró la campaña'});
        const obj = new Note({
            title: req.body.title,
            text: req.body.text,
            owner: new Types.ObjectId(req.body.userId)
        })
        const note = await obj.save()
        const updateBody: any = {
            $push: {}
        }
        if (req.body.isPrivate) {
            updateBody.$push['notes'] = note._id
        } else {
            updateBody.$push['publicEntries'] = note._id
        }
        const updated = await Campaign.updateOne(
            {
                _id: new Types.ObjectId(req.body.campaignId)
            },
            updateBody
        );
        console.log(updated);
        res.send({success: true, note })
    } catch (e) {
        res.send({success: false})
    }
}

export const updateRegister = async (req: Request, res: Response) => {
    try {
        if (!req.body.title || !req.body.text) return res.status(400).json({errMsg: 'Faltan datos'});
        const note = await Note.findOne({ _id: new Types.ObjectId(req.params.registerId) });
        if (!note) return res.send({success: false, error: 'No se encontró la nota'});
        const updateNote = await Note.updateOne(
            {
                _id: new Types.ObjectId(req.params.registerId)
            },
            {
                title: req.body.title,
                text: req.body.text,
            }
        )
        console.log(updateNote);
        res.send({success: true, note: updateNote })
    } catch (e) {
        res.send({success: false, error: e})
    }
}

export const deleteRegister = async (req: Request, res: Response) => {
    try {
        if (!req.body.campaignId) return res.status(400).json({errMsg: 'Faltan datos'});
        const note = await Note.findOne({ _id: new Types.ObjectId(req.params.registerId) });
        if (!note) return res.send({success: false, error: 'No se encontró la nota'});
        const updatedNote = await Note.updateOne(
            {
                _id: new Types.ObjectId(req.params.registerId)
            },
            {
                state: noteState.DELETED
            }
        )
        const campaign = await Campaign.updateOne(
            {
                _id: new Types.ObjectId(req.body.campaignId)
            },
            {
                $pull: { notes: req.params.registerId, publicEntries: req.params.registerId }
            }
        )
        console.log(updatedNote, campaign);
        res.send({success: true, campaign })
    } catch (e) {
        res.send({success: false, error: e})
    }
}