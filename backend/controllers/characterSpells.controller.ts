import {Request, Response} from 'express';
import { Types } from 'mongoose';
import Character from '../models/Character';
import Spell from '../models/Spell';
import CharacterStatus from '../models/PersonaD20/CharacterStatus';

// prepareSpell
export const prepareSpell = async (req: Request, res: Response) => {
    const { characterId, spellId } = req.params;
    const characterObjectId = new Types.ObjectId(characterId);
    const character = await Character.findById(characterObjectId);
    if (!character) {
        return res.status(404).json({message: 'Personaje no encontrado'});
    }
    const spellObjectId = new Types.ObjectId(spellId);
    const spell = await Spell.findById(spellObjectId);
    if (!spell) {
        return res.status(404).json({message: 'Hechizo no encontrado'});
    }
    const characterStatus = await CharacterStatus.findOne({characterId: characterObjectId});
    if (!characterStatus) {
        return res.status(404).json({message: 'Estado del personaje no encontrado'});
    }
    if (characterStatus.spells.preparedList.length >= characterStatus.spells.maxPrepared) {
        return res.status(400).json({message: 'No puedes preparar más hechizos'});
    }
    characterStatus.spells.preparedList.push(spellObjectId);
    await characterStatus.save();
    return res.status(200).json({message: 'Hechizo preparado', success: true});
}

// clearPreparedSpells
export const clearPreparedSpells = async (req: Request, res: Response) => {
    const { characterId } = req.params;
    const characterObjectId = new Types.ObjectId(characterId);
    const character = await Character.findById(characterObjectId);
    if (!character) {
        return res.status(404).json({message: 'Personaje no encontrado'});
    }
    const characterStatus = await CharacterStatus.findOne({characterId: characterObjectId});
    if (!characterStatus) {
        return res.status(404).json({message: 'Estado del personaje no encontrado'});
    }
    characterStatus.spells.preparedList = [];
    await characterStatus.save();
    return res.status(200).json({message: 'Todos los hechizos preparados fueron removidos'});
}

// addSpell
export const addSpell = async (req: Request, res: Response) => {
    const { characterId } = req.params;
    const characterObjectId = new Types.ObjectId(characterId);
    const character = await Character.findById(characterObjectId);
    if (!character) {
        return res.status(404).json({message: 'Personaje no encontrado'});
    }
    const {
        name,
        cost,
        AP,
        costHP,
        costType,
        useType,
        category,
        description,
        trigger,
        concentration,
        effects,
        modifiers,
        toList
    } = req.body;
    if (!name || !cost || !AP || !useType || !category || !description || !concentration || !toList) {
        return res.status(400).json({ message: 'Faltan parámetros para crear el hechizo' })
    }
    if (cost == 'AP and HP' && !costHP) {
        return res.status(400).json({ message: 'Falta la indicación del coste de vida' })
    }
    if (!['list', 'free', 'additional'].includes(toList)) {
        return res.status(400).json({ message: 'El listado indicado no es válido' })
    }
    const spellDoc = new Spell({
        name,
        system: character.system,
        custom: true,
        owner: req.body.userId,
        cost,
        AP,
        costHP,
        costType,
        useType,
        category,
        description,
        trigger,
        concentration,
        effects,
        modifiers,
        toList,
        state: 'ACTIVE'
    })
    await spellDoc.save();
    return res.status(200).json({message: 'Hechizo personalizado agregado', success: true});
}

// editSpell
export const editSpell = async (req: Request, res: Response) => {
    const { characterId, spellId } = req.params;
    const characterObjectId = new Types.ObjectId(characterId);
    const spellObjectId = new Types.ObjectId(spellId);
    const character = await Character.findById(characterObjectId);
    if (!character) {
        return res.status(404).json({message: 'Personaje no encontrado'});
    }
    const spell = await Spell.findById(spellObjectId);
    if (!spell) {
        return res.status(404).json({message: 'Hechizo no encontrado'});
    }
    const {
        name,
        cost,
        AP,
        costHP,
        costType,
        useType,
        category,
        description,
        trigger,
        concentration,
        effects,
        modifiers,
        toList,
        state
    } = req.body;
    if (!name || !cost || !AP || !useType || !category || !description || !concentration || !toList) {
        return res.status(400).json({ message: 'Faltan parámetros para crear el hechizo' })
    }
    if (cost == 'AP and HP' && !costHP) {
        return res.status(400).json({ message: 'Falta la indicación del coste de vida' })
    }
    if (!['list', 'free', 'additional'].includes(toList)) {
        return res.status(400).json({ message: 'El listado indicado no es válido' })
    }
    spell.name = name;
    spell.cost = cost;
    spell.AP = AP;
    spell.costHP = costHP;
    spell.costType = costType;
    spell.useType = useType;
    spell.category = category;
    spell.description = description;
    spell.trigger = trigger;
    spell.concentration = concentration;
    spell.effects = effects;
    spell.modifiers = modifiers;
    spell.toList = toList;
    spell.state = state;
    await spell.save();
    return res.status(200).json({message: 'Hechizo personalizado editado', success: true});
}

// deleteSpell
export const deleteSpell = async (req: Request, res: Response) => {
    const { characterId, spellId } = req.params;
    const characterObjectId = new Types.ObjectId(characterId);
    const spellObjectId = new Types.ObjectId(spellId);
    const character = await Character.findById(characterObjectId);
    if (!character) {
        return res.status(404).json({message: 'Personaje no encontrado'});
    }
    const spell = await Spell.findById(spellObjectId);
    if (!spell) {
        return res.status(404).json({message: 'Hechizo no encontrado'});
    }
    spell.state = 'DELETED';
    await spell.save();
    return res.status(200).json({message: 'Hechizo personalizado eliminado', success: true});
}