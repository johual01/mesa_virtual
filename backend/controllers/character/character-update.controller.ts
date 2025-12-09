import { Request, Response } from 'express';
import { Types } from 'mongoose';
import User from '../../models/User';
import Character, { state as characterState } from '../../models/Character';
import CharacterDetail, { personaSecondaryAbilities } from '../../models/PersonaD20/CharacterDetail';
import CharacterStatus from '../../models/PersonaD20/CharacterStatus';
import { elements, personaStadistics } from '../../models/types';
import { arraysEqual, saveImage } from '../../functions';

export const editCharacter = async (req: Request, res: Response) => {
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
            backstory,
            pictureRoute,        
            persona,
            money,
            stadistics,
            proficency,
            element,
            weakness,
        } = req.body;

        if (!name || !state || !persona || money === undefined || !element || !backstory || !stadistics || !proficency || !weakness) {
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

        if (!arraysEqual(Object.keys(stadistics), Object.keys(personaStadistics))) {
            return res.status(400).json({ errMsg: 'Faltan estadísticas' });
        }

        if (typeof money !== 'number') {
            return res.status(400).json({ errMsg: 'El dinero debe ser un número' });
        }

        const invalidProficency = proficency.some((p: any) => !Object.values(personaSecondaryAbilities).includes(p));
        if (proficency.length === 0 || invalidProficency) {
            return res.status(400).json({ errMsg: 'Habilidades de proficiencia inválidas' });
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

        // Procesar imagen
        if (pictureRoute && pictureRoute.trim() !== '') {
            if (!pictureRoute.startsWith('http')) {
                const savedImage = await saveImage(pictureRoute, userIdObj, 'PROFILES');
                if (typeof savedImage === 'string') {
                    character.pictureRoute = savedImage;
                } else {
                    return res.status(500).json({ errMsg: 'No se pudo guardar la imagen' });
                }
            } else {
                character.pictureRoute = pictureRoute;
            }
        }

        characterDetail.persona = persona;
        characterDetail.money = money;
        characterDetail.stadistics = stadistics;
        characterDetail.secondaryAbilities.acrobatics.isProficient = proficency.includes(personaSecondaryAbilities.Acrobatics);
        characterDetail.secondaryAbilities.art.isProficient = proficency.includes(personaSecondaryAbilities.Art);
        characterDetail.secondaryAbilities.athletics.isProficient = proficency.includes(personaSecondaryAbilities.Athletics);
        characterDetail.secondaryAbilities.consciousness.isProficient = proficency.includes(personaSecondaryAbilities.Consciousness);
        characterDetail.secondaryAbilities.empathy.isProficient = proficency.includes(personaSecondaryAbilities.Empathy);
        characterDetail.secondaryAbilities.expression.isProficient = proficency.includes(personaSecondaryAbilities.Expression);
        characterDetail.secondaryAbilities.folklore.isProficient = proficency.includes(personaSecondaryAbilities.Folklore);
        characterDetail.secondaryAbilities.handcraft.isProficient = proficency.includes(personaSecondaryAbilities.Handcraft);
        characterDetail.secondaryAbilities.investigation.isProficient = proficency.includes(personaSecondaryAbilities.Investigation);
        characterDetail.secondaryAbilities.meditation.isProficient = proficency.includes(personaSecondaryAbilities.Meditation);
        characterDetail.secondaryAbilities.mysticism.isProficient = proficency.includes(personaSecondaryAbilities.Mysticism);
        characterDetail.secondaryAbilities.orientation.isProficient = proficency.includes(personaSecondaryAbilities.Orientation);
        characterDetail.secondaryAbilities.quibble.isProficient = proficency.includes(personaSecondaryAbilities.Quibble);
        characterDetail.secondaryAbilities.reflexes.isProficient = proficency.includes(personaSecondaryAbilities.Reflexes);
        characterDetail.secondaryAbilities.speed.isProficient = proficency.includes(personaSecondaryAbilities.Speed);
        characterDetail.secondaryAbilities.stealth.isProficient = proficency.includes(personaSecondaryAbilities.Stealth);
        characterDetail.secondaryAbilities.strength.isProficient = proficency.includes(personaSecondaryAbilities.Strength);
        characterDetail.secondaryAbilities.technology.isProficient = proficency.includes(personaSecondaryAbilities.Technology);
        characterDetail.secondaryAbilities.streetwise.isProficient = proficency.includes(personaSecondaryAbilities.Streetwise);
        characterDetail.secondaryAbilities.willpower.isProficient = proficency.includes(personaSecondaryAbilities.Willpower);
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
