import { Request, Response } from 'express';
import { Types } from 'mongoose';
import Character, { state as characterState } from '../../models/Character';
import CharacterStatus from '../../models/PersonaD20/CharacterStatus';

export const addCustomModifier = async (req: Request, res: Response) => {
    try {
        const {
            value,
            type,
            description,
            addTo,
            target,
            duration,
            stadistic,
            replaceStadistic,
        } = req.body;

        if (!value || !type || !description) {
            return res.status(400).json({ errMsg: 'Faltan campos obligatorios' });
        }

        if (type === 'stadistic' && !stadistic) {
            return res.status(400).json({ errMsg: 'Falta la estadística' });
        }

        const characterId = new Types.ObjectId(req.params.characterId);
        const character = await Character.findById(characterId);

        if (!character) {
            return res.status(404).json({ errMsg: 'Personaje no encontrado' });
        }

        if (character.state === characterState.DELETED) {
            return res.status(400).json({ errMsg: 'El personaje está eliminado' });
        }

        if (character.player.toString() !== req.body.userId) {
            return res.status(403).json({ errMsg: 'No tienes permisos para editar este personaje' });
        }

        await CharacterStatus.updateOne(
            { characterId },
            {
                $push: {
                    customModifiers: {
                        value,
                        type,
                        description,
                        addTo,
                        target,
                        duration,
                        stadistic,
                        replaceStadistic,
                        modifierId: new Types.ObjectId().toString()
                    }
                },
                $setOnInsert: { characterId }
            },
            { upsert: true }
        );

        res.status(201).json({ message: 'Modificador agregado' });
    } catch (e) {
        res.status(500).json({ errMsg: 'Error al agregar modificador', error: e });
    }
};

export const removeCustomModifier = async (req: Request, res: Response) => {
    try {
        const modifierId = req.params.modifierId;
        const characterId = new Types.ObjectId(req.params.characterId);
        const character = await Character.findById(characterId);

        if (!character) {
            return res.status(404).json({ errMsg: 'Personaje no encontrado' });
        }

        if (character.state === characterState.DELETED) {
            return res.status(400).json({ errMsg: 'El personaje está eliminado' });
        }

        if (character.player.toString() !== req.body.userId) {
            return res.status(403).json({ errMsg: 'No tienes permisos para editar este personaje' });
        }

        const characterStatus = await CharacterStatus.findOne({ characterId });
        if (!characterStatus) {
            return res.status(404).json({ errMsg: 'Estado del personaje no encontrado' });
        }

        const modifier = characterStatus.customModifiers?.find(e => e.modifierId === modifierId);
        if (!modifier) {
            return res.status(404).json({ errMsg: 'Modificador no encontrado' });
        }

        characterStatus.customModifiers = characterStatus.customModifiers?.filter(e => e.modifierId !== modifierId);
        await characterStatus.save();

        res.status(200).json({ message: 'Modificador eliminado' });
    } catch (e) {
        res.status(500).json({ errMsg: 'Error al eliminar modificador', error: e });
    }
};
