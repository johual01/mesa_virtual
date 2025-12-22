import {Request, Response} from 'express';
import {Types} from 'mongoose';
import CharacterInventory, { IWeaponProperties, Item, equipmentType } from '../models/PersonaD20/CharacterEquipment';
import Character from '../models/Character';
import { ICharacterPersonaDetail } from '../models/PersonaD20/CharacterDetail';
import { rangeTypes } from '../models/types';

// Función auxiliar para validar datos del item
const validateItemData = (data: any): string | null => {
    const {
        name,
        description,
        type,
        category,
        equipped,
        proficiency,
        canAttack,
        provideDefense,
        quantity
    } = data;

    if (!name || !description || !type || !category || equipped === undefined || 
        !proficiency || canAttack === undefined || provideDefense === undefined || !quantity) {
        return 'Por favor, llena todos los campos requeridos';
    }

    if (!Object.values(equipmentType).includes(type)) {
        return 'Tipo de equipo inválido';
    }

    if (typeof equipped !== 'boolean' || typeof canAttack !== 'boolean' || typeof provideDefense !== 'boolean') {
        return 'Los campos equipado, puede atacar y proporcionar defensa deben ser booleanos';
    }

    if (typeof quantity !== 'number') {
        return 'La cantidad debe ser un número';
    }

    return null;
};

// getDefaultItems
export const getDefaultItems = async (req: Request, res: Response) => {
    try {
        const characterId = req.params.characterId;
        const characterObjectId = new Types.ObjectId(characterId);
        const character = await Character.findById(characterObjectId);

        if (!character) {
            return res.status(404).json({ errMsg: 'El personaje no existe' });
        }

        const defaultItems = await Item.find();
        const characterItems = await CharacterInventory.find({ character: characterObjectId });

        res.status(200).json({ defaultItems, characterItems });
    } catch (e) {
        res.status(500).json({ errMsg: 'Error al obtener items', error: e });
    }
}

// addItem
export const addItem = async (req: Request, res: Response) => {
    try {
        const characterId = req.params.characterId;
        const characterObjectId = new Types.ObjectId(characterId);
        const character = await Character.findById(characterObjectId);

        if (!character) {
            return res.status(404).json({ errMsg: 'El personaje no existe' });
        }

        const {
            name,
            description,
            type,
            category,
            equipped,
            proficiency,
            canAttack,
            provideDefense,
            quantity,
            properties,
            modifiers,
            additionalProperties
        } = req.body;

        // Validaciones
        const validationError = validateItemData(req.body);
        if (validationError) {
            return res.status(400).json({ errMsg: validationError });
        }

        const newItem = new CharacterInventory({
            character: characterObjectId,
            state: 'ACTIVE',
            equipmentName: name,
            description,
            type,
            category,
            equipped,
            proficiency,
            canAttack,
            provideDefense,
            quantity,
            properties,
            modifiers,
            additionalProperties
        });

        const savedItem = await newItem.save();

        res.status(201).json({ 
            message: 'Equipo añadido correctamente',
            item: savedItem
        });
    } catch (e) {
        res.status(500).json({ errMsg: 'Error al añadir equipo', error: e });
    }
}

// editItem
export const editItem = async (req: Request, res: Response) => {
    try {
        const characterId = req.params.characterId;
        const characterObjectId = new Types.ObjectId(characterId);
        const character = await Character.findById(characterObjectId);

        if (!character) {
            return res.status(404).json({ errMsg: 'El personaje no existe' });
        }

        const itemId = req.params.itemId;
        const itemObjectId = new Types.ObjectId(itemId);
        const item = await CharacterInventory.findById(itemObjectId);

        if (!item) {
            return res.status(404).json({ errMsg: 'El objeto no existe' });
        }

        const {
            name,
            description,
            type,
            category,
            equipped,
            proficiency,
            canAttack,
            provideDefense,
            quantity,
            properties,
            modifiers,
            additionalProperties
        } = req.body;

        // Validaciones
        const validationError = validateItemData(req.body);
        if (validationError) {
            return res.status(400).json({ errMsg: validationError });
        }

        item.equipmentName = name;
        item.description = description;
        item.type = type;
        item.category = category;
        item.equipped = equipped;
        item.proficiency = proficiency;
        item.canAttack = canAttack;
        item.provideDefense = provideDefense;
        item.quantity = quantity;
        item.properties = properties;
        item.modifiers = modifiers;
        item.additionalProperties = additionalProperties;

        const updatedItem = await item.save();

        res.status(200).json({ 
            message: 'Equipo editado correctamente',
            item: updatedItem
        });
    } catch (e) {
        res.status(500).json({ errMsg: 'Error al editar equipo', error: e });
    }
}

// deleteItem
export const deleteItem = async (req: Request, res: Response) => {
    try {
        const characterId = req.params.characterId;
        const characterObjectId = new Types.ObjectId(characterId);
        const character = await Character.findById(characterObjectId);

        if (!character) {
            return res.status(404).json({ errMsg: 'El personaje no existe' });
        }

        const itemId = req.params.itemId;
        const itemObjectId = new Types.ObjectId(itemId);
        const item = await CharacterInventory.findById(itemObjectId);

        if (!item) {
            return res.status(404).json({ errMsg: 'El objeto no existe' });
        }

        item.state = 'DELETED';
        await item.save();

        res.status(200).json({ message: 'Equipo eliminado correctamente' });
    } catch (e) {
        res.status(500).json({ errMsg: 'Error al eliminar equipo', error: e });
    }
}

export const getEquippedItems = async (req: Request, res: Response) => {
    try {
        const characterId = req.params.characterId;
        const character = await Character.findById(characterId);
        if (!character) {
            return res.status(404).json({ errMsg: 'El personaje no existe' });
        }

        const characterData = character.characterData as ICharacterPersonaDetail

        const characterObjectId = new Types.ObjectId(characterId);
        const equippedItems = await CharacterInventory.find({
            character: characterObjectId,
            equipped: true,
            state: 'ACTIVE'
        });

        const rangeModifiers = characterData.combatData.range;

        equippedItems.forEach((item) => {
            if (item.type === equipmentType.WEAPON) {
                item.properties = item.properties as IWeaponProperties;
                if (item.properties.range.type === rangeTypes.RANGED) {
                    item.properties.range.range = (item.properties.range.range || 0) + 
                        rangeModifiers.weaponRangedRangeModifiers.reduce((total, mod) => total + (typeof mod.value === 'number' ? mod.value : 0), 0);
                }
                if (item.properties.range.type === rangeTypes.MELEE) {
                    item.properties.range.type = rangeTypes.RANGED;
                    item.properties.range.range = rangeModifiers.weaponMeleeRangeModifiers.reduce((total, mod) => total + (typeof mod.value === 'number' ? mod.value : 0), 0);
                }
            }
        });

        res.status(200).json({ equippedItems });
    } catch (e) {
        res.status(500).json({ errMsg: 'Error al obtener items equipados', error: e });
    }
}