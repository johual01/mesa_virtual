import { Request, Response } from 'express';
import { Types } from 'mongoose';
import User from '../../models/User';
import Character, { state as characterState, ICharacter } from '../../models/Character';
import CharacterDetail, { personaSecondaryAbilities } from '../../models/PersonaD20/CharacterDetail';
import CharacterStatus from '../../models/PersonaD20/CharacterStatus';
import { elements, personaStadistics } from '../../models/types';
import { arraysEqual, saveImage, UploadedFile, parseMulterField, parseMulterNumber } from '../../functions';

// Extender Request para incluir el archivo de multer
interface MulterRequest extends Request {
    file?: Express.Multer.File;
}

export const editCharacter = async (req: MulterRequest, res: Response) => {
    try {
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

        const {
            name,
            state,
            backstory: rawBackstory,
            persona,
            money: rawMoney,
            stadistics: rawStadistics,
            element,
            weakness,
        } = req.body;

        // Parsear campos que pueden venir como strings JSON desde multipart/form-data
        const backstory = parseMulterField<ICharacter['backstory']>(rawBackstory);
        const stadistics = parseMulterField<Record<personaStadistics, number>>(rawStadistics);
        const money = parseMulterNumber(rawMoney);

        if (!name || !state || !persona || money === undefined || !element || !backstory || !stadistics || !weakness) {
            return res.status(400).json({ errMsg: 'Faltan campos obligatorios' });
        }

        if (!Object.values(elements).includes(element)) {
            return res.status(400).json({ errMsg: 'Elemento inválido' });
        }

        if (!Object.values(elements).includes(weakness)) {
            return res.status(400).json({ errMsg: 'Debilidad inválida' });
        }

        if (!Object.values(characterState).includes(state)) {
            return res.status(400).json({ errMsg: 'Estado inválido' });
        }

        const requiredStats = Object.values(personaStadistics);
        const providedStats = Object.keys(stadistics);
        if (!arraysEqual(providedStats.sort(), requiredStats.sort())) {
            return res.status(400).json({ errMsg: 'Faltan estadísticas' });
        }

        const user = await User.findById(req.body.userId);
        if (!user) {
            return res.status(404).json({ errMsg: 'Usuario no encontrado' });
        }

        const userIdObj = new Types.ObjectId(req.body.userId);
        const characterDetail = await CharacterDetail.findOne({ _id: character.characterData });

        if (!characterDetail) {
            return res.status(404).json({ errMsg: 'Detalle del personaje no encontrado' });
        }

        character.name = name;
        character.backstory = backstory;
        character.state = state;

        // Procesar imagen si se proporciona un archivo
        if (req.file) {
            const uploadedFile: UploadedFile = {
                buffer: req.file.buffer,
                mimetype: req.file.mimetype,
                originalname: req.file.originalname,
                size: req.file.size
            };
            const savedImage = await saveImage(uploadedFile, userIdObj, 'characters');
            if (typeof savedImage === 'string') {
                character.pictureRoute = savedImage;
            } else {
                return res.status(500).json({ errMsg: 'No se pudo guardar la imagen' });
            }
        }

        characterDetail.persona = persona;
        characterDetail.money = money;
        characterDetail.stadistics = stadistics;
        characterDetail.markModified('secondaryAbilities');
        characterDetail.combatData.elements.affinity = element;
        characterDetail.combatData.elements.weakness = [ weakness ];
        characterDetail.markModified('combatData');

        await character.save();
        await characterDetail.save();

        res.status(200).json({ message: 'Personaje actualizado' });
    } catch (e) {
        res.status(500).json({ errMsg: 'Error al editar personaje', error: e });
    }
};

export const deleteCharacter = async (req: Request, res: Response) => {
    try {
        const characterId = new Types.ObjectId(req.params.characterId);
        const character = await Character.findById(characterId);

        if (!character) {
            return res.status(404).json({ errMsg: 'Personaje no encontrado' });
        }

        if (character.state === characterState.DELETED) {
            return res.status(400).json({ errMsg: 'El personaje ya está eliminado' });
        }

        if (character.player.toString() !== req.body.userId) {
            return res.status(403).json({ errMsg: 'No tienes permisos para eliminar este personaje' });
        }

        character.state = characterState.DELETED;
        await character.save();

        res.status(200).json({ message: 'Personaje eliminado' });
    } catch (e) {
        res.status(500).json({ errMsg: 'Error al eliminar personaje', error: e });
    }
};

export const updateXP = async (req: Request, res: Response) => {
    try {
        const characterId = new Types.ObjectId(req.params.characterId);
        const { xp } = req.body;

        if (xp === undefined) {
            return res.status(400).json({ errMsg: 'Falta la experiencia' });
        }

        if (typeof xp !== 'number') {
            return res.status(400).json({ errMsg: 'La experiencia debe ser un número' });
        }

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

        const characterDetail = await CharacterDetail.findOne({ _id: character.characterData });
        if (!characterDetail) {
            return res.status(404).json({ errMsg: 'Detalle del personaje no encontrado' });
        }

        characterDetail.experience = xp;
        await characterDetail.save();

        res.status(200).json({ message: 'Experiencia actualizada' });
    } catch (e) {
        res.status(500).json({ errMsg: 'Error al actualizar experiencia', error: e });
    }
};

export const updateMoney = async (req: Request, res: Response) => {
    try {
        const characterId = new Types.ObjectId(req.params.characterId);
        const { money } = req.body;

        if (money === undefined) {
            return res.status(400).json({ errMsg: 'Falta el dinero' });
        }

        if (typeof money !== 'number') {
            return res.status(400).json({ errMsg: 'El dinero debe ser un número' });
        }

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

        const characterDetail = await CharacterDetail.findOne({ _id: character.characterData });
        if (!characterDetail) {
            return res.status(404).json({ errMsg: 'Detalle del personaje no encontrado' });
        }

        characterDetail.money = money;
        await characterDetail.save();

        res.status(200).json({ message: 'Dinero actualizado' });
    } catch (e) {
        res.status(500).json({ errMsg: 'Error al actualizar dinero', error: e });
    }
};

export const updateInspiration = async (req: Request, res: Response) => {
    try {
        const characterId = new Types.ObjectId(req.params.characterId);
        const { inspiration } = req.body;

        if (!inspiration) {
            return res.status(400).json({ errMsg: 'Falta la inspiración' });
        }

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

        characterStatus.inspiration = inspiration;
        await characterStatus.save();

        res.status(200).json({ message: 'Inspiración actualizada' });
    } catch (e) {
        res.status(500).json({ errMsg: 'Error al actualizar inspiración', error: e });
    }
};
