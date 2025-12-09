import {Request, Response} from 'express';
import Campaign, { ICampaign, campaignState } from '../models/Campaign';
import Note, { noteState } from '../models/Note';
import History, { referenceType, origin } from '../models/History';
import { ICharacter } from '../models/Character';
import { Types } from 'mongoose';
import { saveImage } from '../functions';
import { IUser } from '../models/User';

export const getCampaigns = async (req: Request, res: Response) => {
    try {
        const userId = new Types.ObjectId(req.body.userId);
        const campaigns = await Campaign.aggregate([
            {
                $match: {
                    $or: [
                        { owner: userId },
                        { players: { $in: [userId] } }
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
        ]);

        res.status(200).json({ campaigns });
    } catch (e) {
        res.status(500).json({ errMsg: 'Error al obtener campañas', error: e });
    }
}

export const createCampaign = async (req: Request, res: Response) => {
    try {
        if (!req.body.name || !req.body.description) {
            return res.status(400).json({ errMsg: 'Faltan datos' });
        }

        const userId = new Types.ObjectId(req.body.userId);
        let imageUrl = '';

        if (req.body.image) {
            if (!req.body.image.startsWith('https://')) {
                const savedImage = await saveImage(req.body.image, userId, 'profilePics');
                if (typeof savedImage === 'string') {
                    imageUrl = savedImage;
                }
            } else {
                imageUrl = req.body.image;
            }
        }

        const campaignData = {
            name: req.body.name,
            owner: userId,
            players: [],
            characters: [],
            image: imageUrl,
            description: req.body.description,
            notes: req.body.notes || [],
            history: [],
            publicEntries: req.body.publicEntries || [],
            state: campaignState.ACTIVE,
        };
        const campaign: ICampaign = new Campaign(campaignData);
        const savedCampaign = await campaign.save();

        const history = new History({
            event: 'Campaña creada',
            description: 'La campaña ha sido creada',
            user: userId,
            origin: origin.USER,
            referenceType: referenceType.CAMPAIGN,
            reference: savedCampaign._id,
            body: req.body
        });

        const savedHistory = await history.save();
        savedCampaign.history.push(savedHistory._id as Types.ObjectId);
        await savedCampaign.save();

        res.json({
            message: 'Campaña creada',
            campaign: savedCampaign
        });
    } catch (e) {
        res.status(500).json({ errMsg: 'Error al crear campaña', error: e });
    }
}

export const deleteCampaign = async (req: Request, res: Response) => {
    try {
        const userId = new Types.ObjectId(req.body.userId);
        const campaignId = new Types.ObjectId(req.params.campaignId);
        const campaign = await Campaign.findById(campaignId);

        if (!campaign) {
            return res.status(404).json({ errMsg: 'No se encontró la campaña' });
        }

        if (campaign.owner.toString() !== userId.toString()) {
            return res.status(403).json({ errMsg: 'Solo el dueño puede eliminar la campaña' });
        }

        campaign.state = campaignState.DELETED;

        const history = new History({
            event: 'Campaña eliminada',
            description: 'La campaña ha sido eliminada',
            user: userId,
            origin: origin.USER,
            referenceType: referenceType.CAMPAIGN,
            reference: campaign._id
        });

        const savedHistory = await history.save();
        campaign.history.push(savedHistory._id as Types.ObjectId);
        await campaign.save();

        res.status(200).json({ message: 'Campaña eliminada' });
    } catch (e) {
        res.status(500).json({ errMsg: 'Error al eliminar campaña', error: e });
    }
}

export const openCampaign = async (req: Request, res: Response) => {
    try {
        const campaignId = new Types.ObjectId(req.params.campaignId);
        const campaign = await Campaign.findById(campaignId)
            .populate<{ owner: IUser }>('owner', '-password -email')
            .populate<{ players: IUser }>('players', '-password -email -joinDate')
            .populate('publicEntries')
            .populate('notes');

        if (!campaign) {
            return res.status(404).json({ errMsg: 'No se encontró la campaña' });
        }

        const campaignData = campaign.toJSON();

        // Solo el dueño puede ver las notas privadas
        if (campaignData.owner._id.toString() !== req.params.userId) {
            delete campaignData.notes;
        }

        res.status(200).json({ campaign: campaignData });
    } catch (e) {
        res.status(500).json({ errMsg: 'Error al abrir campaña', error: e });
    }
}

export const editCampaign = async (req: Request, res: Response) => {
    try {
        if (!req.body.name || !req.body.description) {
            return res.status(400).json({ errMsg: 'Faltan datos' });
        }

        const campaignId = new Types.ObjectId(req.params.campaignId);
        const campaign = await Campaign.findById(campaignId);

        if (!campaign) {
            return res.status(404).json({ errMsg: 'No se encontró la campaña' });
        }

        let imageUrl = '';

        if (req.body.image) {
            if (!req.body.image.startsWith('https://')) {
                const savedImage = await saveImage(req.body.image, new Types.ObjectId(req.body.userId), 'campaignPics');
                if (typeof savedImage === 'string') {
                    imageUrl = savedImage;
                }
            } else {
                imageUrl = req.body.image;
            }
        }

        const updateData = {
            name: req.body.name,
            image: imageUrl,
            description: req.body.description,
            notes: req.body.notes,
            publicEntries: req.body.publicEntries
        };
        const userId = new Types.ObjectId(req.body.userId);
        const history = new History({
            event: 'Campaña actualizada',
            description: 'La campaña ha sido actualizada',
            user: userId,
            origin: origin.USER,
            referenceType: referenceType.CAMPAIGN,
            reference: campaignId,
            body: req.body
        });

        const savedHistory = await history.save();
        const updatedCampaign = await Campaign.findOneAndUpdate(
            { _id: campaignId },
            {
                $set: updateData,
                $push: { history: savedHistory._id }
            },
            { new: true }
        );

        res.status(200).json({
            message: 'Campaña actualizada',
            campaign: updatedCampaign
        });
    } catch (e) {
        res.status(500).json({ errMsg: 'Error al actualizar campaña', error: e });
    }
}

export const joinCampaign = async (req: Request, res: Response) => {
    try {
        const userId = new Types.ObjectId(req.body.userId);
        const campaignId = new Types.ObjectId(req.params.campaignId);
        const campaign = await Campaign.findById(campaignId);

        if (!campaign) {
            return res.status(404).json({ errMsg: 'No se encontró la campaña' });
        }

        if (campaign.owner.toString() === userId.toString()) {
            return res.status(400).json({ errMsg: 'No puedes unirte a tu propia campaña' });
        }

        if (campaign.players.some(player => player.toString() === userId.toString())) {
            return res.status(400).json({ errMsg: 'Ya estás en la campaña' });
        }

        const history = new History({
            event: 'Se ha unido un nuevo jugador',
            description: `El jugador ${userId} se ha unido a la campaña.`,
            user: userId,
            origin: origin.USER,
            referenceType: referenceType.CAMPAIGN,
            reference: campaignId
        });

        const savedHistory = await history.save();
        await Campaign.findOneAndUpdate(
            {
                _id: campaignId,
                owner: { $ne: userId },
                players: { $nin: [userId] }
            },
            {
                $push: {
                    players: userId,
                    history: savedHistory._id
                }
            }
        );

        res.status(200).json({ message: 'Te has unido a la campaña' });
    } catch (e) {
        res.status(500).json({ errMsg: 'Error al unirse a la campaña', error: e });
    }
}

export const removeFromCampaign = async (req: Request, res: Response) => {
    try {
        const userId = new Types.ObjectId(req.body.userId);
        const playerId = new Types.ObjectId(req.body.playerId);
        const campaignId = new Types.ObjectId(req.body.campaignId);
        const campaign = await Campaign.findById(campaignId);

        if (!campaign) {
            return res.status(404).json({ errMsg: 'No se encontró la campaña' });
        }

        // Solo el dueño puede remover a otros, o el jugador puede salirse
        if (campaign.owner.toString() !== userId.toString() && userId.toString() !== playerId.toString()) {
            return res.status(403).json({ errMsg: 'Solo el dueño puede eliminar a otro jugador' });
        }

        const history = new History({
            event: 'Un jugador ha abandonado la campaña',
            description: `El jugador ${playerId} ha abandonado la campaña.`,
            user: userId,
            origin: origin.USER,
            referenceType: referenceType.CAMPAIGN,
            reference: campaign._id
        });

        const savedHistory = await history.save();
        const campaignData = campaign.toObject();
        campaignData.players = campaignData.players.filter(player => player.toString() !== playerId.toString());

        await campaign.populate('characters');
        campaignData.characters = (campaignData.characters as ICharacter[]).filter(
            char => !(char.player as Types.ObjectId).equals(playerId)
        );

        campaign.overwrite(campaignData);
        campaign.history.push(savedHistory._id as Types.ObjectId);
        await campaign.save();

        res.status(200).json({ message: 'Jugador removido de la campaña' });
    } catch (e) {
        res.status(500).json({ errMsg: 'Error al remover jugador', error: e });
    }
}

export const addRegister = async (req: Request, res: Response) => {
    try {
        if (!req.body.title || !req.body.text || !req.body.campaignId) {
            return res.status(400).json({ errMsg: 'Faltan datos' });
        }

        const campaignId = new Types.ObjectId(req.body.campaignId);
        const campaign = await Campaign.findById(campaignId);

        if (!campaign) {
            return res.status(404).json({ errMsg: 'No se encontró la campaña' });
        }

        const note = new Note({
            title: req.body.title,
            text: req.body.text,
            owner: new Types.ObjectId(req.body.userId)
        });

        const savedNote = await note.save();

        const updateField = req.body.isPrivate ? 'notes' : 'publicEntries';
        await Campaign.updateOne(
            { _id: campaignId },
            { $push: { [updateField]: savedNote._id } }
        );

        res.status(201).json({ message: 'Registro creado', note: savedNote });
    } catch (e) {
        res.status(500).json({ errMsg: 'Error al crear registro', error: e });
    }
}

export const updateRegister = async (req: Request, res: Response) => {
    try {
        if (!req.body.title || !req.body.text || !req.body.campaignId) {
            return res.status(400).json({ errMsg: 'Faltan datos' });
        }

        const registerId = new Types.ObjectId(req.params.registerId);
        const campaignId = new Types.ObjectId(req.body.campaignId as string);
        const note = await Note.findById(registerId);
        
        const campaign = await Campaign.findById(campaignId);
            
        if (!campaign) {
            return res.status(404).json({ errMsg: 'No se encontró la campaña' });
        }

        if (!note) {
            return res.status(404).json({ errMsg: 'No se encontró la nota' });
        }

        const updatedNote = await Note.findByIdAndUpdate(
            registerId,
            {
                title: req.body.title,
                text: req.body.text
            },
            { new: true }
        );

        // Manejar cambio de visibilidad (pública/privada)
        if (req.body.isPrivate !== undefined) {
            const isCurrentlyPrivate = campaign.notes?.some(n => n.toString() === registerId.toString()) || false;
            const isCurrentlyPublic = campaign.publicEntries?.some(e => e.toString() === registerId.toString()) || false;
            const shouldBePrivate = req.body.isPrivate;

            // Si debe cambiar de pública a privada
            if (shouldBePrivate && isCurrentlyPublic) {
                await Campaign.updateOne(
                    { _id: campaignId },
                    {
                        $pull: { publicEntries: registerId },
                        $push: { notes: registerId }
                    }
                );
            }
            // Si debe cambiar de privada a pública
            else if (!shouldBePrivate && isCurrentlyPrivate) {
                await Campaign.updateOne(
                    { _id: campaignId },
                    {
                        $pull: { notes: registerId },
                        $push: { publicEntries: registerId }
                    }
                );
            }
        }

        res.status(200).json({ message: 'Registro actualizado', note: updatedNote });
    } catch (e) {
        res.status(500).json({ errMsg: 'Error al actualizar registro', error: e });
    }
}

export const deleteRegister = async (req: Request, res: Response) => {
    try {
        if (!req.body.campaignId) {
            return res.status(400).json({ errMsg: 'Faltan datos' });
        }

        const registerId = new Types.ObjectId(req.params.registerId);
        const campaignId = new Types.ObjectId(req.body.campaignId);
        const note = await Note.findById(registerId);

        if (!note) {
            return res.status(404).json({ errMsg: 'No se encontró la nota' });
        }

        await Note.updateOne(
            { _id: registerId },
            { state: noteState.DELETED }
        );

        await Campaign.updateOne(
            { _id: campaignId },
            { $pull: { notes: registerId, publicEntries: registerId } }
        );

        res.status(200).json({ message: 'Registro eliminado' });
    } catch (e) {
        res.status(500).json({ errMsg: 'Error al eliminar registro', error: e });
    }
}