import {Request, Response} from 'express';
import { Types } from 'mongoose';
import Character from '../models/Character';
import Spell from '../models/Spell';
import CharacterStatus from '../models/PersonaD20/CharacterStatus';

// Función auxiliar para validar datos del hechizo
const validateSpellData = (data: any): string | null => {
    const {
        name,
        cost,
        AP,
        costHP,
        useType,
        category,
        description,
        concentration,
        toList
    } = data;

    if (!name || !useType || !category || !description || concentration === undefined || !toList) {
        return 'Faltan parámetros para crear el hechizo';
    }

    // Validar estructura de cost
    if (!cost || typeof cost !== 'object') {
        return 'El coste del hechizo debe ser un objeto válido';
    }

    // Validar campos de cost según su tipo
    if (cost.type === 'AP and HP') {
        if (!cost.AP || !cost.HP) {
            return 'Debe especificar tanto AP como HP para el coste';
        }
    } else if (cost.type === 'AP') {
        if (!cost.AP) {
            return 'Debe especificar AP para el coste';
        }
    } else if (cost.type === 'HP') {
        if (!cost.HP) {
            return 'Debe especificar HP para el coste';
        }
    } else {
        return 'Tipo de coste inválido';
    }

    if (!['list', 'free', 'additional'].includes(toList)) {
        return 'El listado indicado no es válido';
    }

    return null;
};

// prepareSpell
export const prepareSpell = async (req: Request, res: Response) => {
    try {
        const { characterId, spellId } = req.params;
        const characterObjectId = new Types.ObjectId(characterId);
        const spellObjectId = new Types.ObjectId(spellId);

        const character = await Character.findById(characterObjectId);
        if (!character) {
            return res.status(404).json({ errMsg: 'Personaje no encontrado' });
        }

        const spell = await Spell.findById(spellObjectId);
        if (!spell) {
            return res.status(404).json({ errMsg: 'Hechizo no encontrado' });
        }

        const characterStatus = await CharacterStatus.findOne({ characterId: characterObjectId });
        if (!characterStatus) {
            return res.status(404).json({ errMsg: 'Estado del personaje no encontrado' });
        }

        // Verificar si ya está preparado
        const alreadyPrepared = characterStatus.spells.preparedList.some(
            s => s.toString() === spellObjectId.toString()
        );

        if (alreadyPrepared) {
            // Si ya está preparado, lo despreparamos
            characterStatus.spells.preparedList = characterStatus.spells.preparedList.filter(
                s => s.toString() !== spellObjectId.toString()
            );
            await characterStatus.save();
            return res.status(200).json({ message: 'Hechizo depreparado' });
        }

        // Verificar si hay espacio para preparar más
        if (characterStatus.spells.preparedList.length >= characterStatus.spells.maxPrepared) {
            return res.status(400).json({ errMsg: 'No puedes preparar más hechizos' });
        }

        characterStatus.spells.preparedList.push(spellObjectId);
        await characterStatus.save();

        return res.status(200).json({ message: 'Hechizo preparado' });
    } catch (e) {
        return res.status(500).json({ errMsg: 'Error al preparar hechizo', error: e });
    }
}

// clearPreparedSpells
export const clearPreparedSpells = async (req: Request, res: Response) => {
    try {
        const { characterId } = req.params;
        const characterObjectId = new Types.ObjectId(characterId);

        const character = await Character.findById(characterObjectId);
        if (!character) {
            return res.status(404).json({ errMsg: 'Personaje no encontrado' });
        }

        const characterStatus = await CharacterStatus.findOne({ characterId: characterObjectId });
        if (!characterStatus) {
            return res.status(404).json({ errMsg: 'Estado del personaje no encontrado' });
        }

        characterStatus.spells.preparedList = [];
        await characterStatus.save();

        return res.status(200).json({ message: 'Todos los hechizos preparados fueron removidos' });
    } catch (e) {
        return res.status(500).json({ errMsg: 'Error al limpiar hechizos preparados', error: e });
    }
}

// addSpell
export const addSpell = async (req: Request, res: Response) => {
    try {
        const { characterId } = req.params;
        const characterObjectId = new Types.ObjectId(characterId);

        const character = await Character.findById(characterObjectId);
        if (!character) {
            return res.status(404).json({ errMsg: 'Personaje no encontrado' });
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

        // Validaciones usando la función auxiliar
        const validationError = validateSpellData(req.body);
        if (validationError) {
            return res.status(400).json({ errMsg: validationError });
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
        });

        const savedSpell = await spellDoc.save();

        return res.status(201).json({ 
            message: 'Hechizo personalizado agregado',
            spell: savedSpell
        });
    } catch (e) {
        return res.status(500).json({ errMsg: 'Error al agregar hechizo', error: e });
    }
}

// editSpell
export const editSpell = async (req: Request, res: Response) => {
    try {
        const { characterId, spellId } = req.params;
        const characterObjectId = new Types.ObjectId(characterId);
        const spellObjectId = new Types.ObjectId(spellId);

        const character = await Character.findById(characterObjectId);
        if (!character) {
            return res.status(404).json({ errMsg: 'Personaje no encontrado' });
        }

        const spell = await Spell.findById(spellObjectId);
        if (!spell) {
            return res.status(404).json({ errMsg: 'Hechizo no encontrado' });
        }

        const {
            name,
            cost,
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

        // Validaciones usando la función auxiliar
        const validationError = validateSpellData(req.body);
        if (validationError) {
            return res.status(400).json({ errMsg: validationError });
        }

        spell.name = name;
        spell.cost = cost;
        spell.useType = useType;
        spell.category = category;
        spell.description = description;
        spell.trigger = trigger;
        spell.concentration = concentration;
        spell.effects = effects;
        spell.modifiers = modifiers;
        spell.toList = toList;
        spell.state = state;

        const updatedSpell = await spell.save();

        return res.status(200).json({ 
            message: 'Hechizo personalizado editado',
            spell: updatedSpell
        });
    } catch (e) {
        return res.status(500).json({ errMsg: 'Error al editar hechizo', error: e });
    }
}

// deleteSpell
export const deleteSpell = async (req: Request, res: Response) => {
    try {
        const { characterId, spellId } = req.params;
        const characterObjectId = new Types.ObjectId(characterId);
        const spellObjectId = new Types.ObjectId(spellId);

        const character = await Character.findById(characterObjectId);
        if (!character) {
            return res.status(404).json({ errMsg: 'Personaje no encontrado' });
        }

        const spell = await Spell.findById(spellObjectId);
        if (!spell) {
            return res.status(404).json({ errMsg: 'Hechizo no encontrado' });
        }

        spell.state = 'DELETED';
        await spell.save();

        return res.status(200).json({ message: 'Hechizo personalizado eliminado' });
    } catch (e) {
        return res.status(500).json({ errMsg: 'Error al eliminar hechizo', error: e });
    }
}