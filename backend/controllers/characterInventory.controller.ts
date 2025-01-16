import {Request, Response} from 'express';
import {Types} from 'mongoose';
import CharacterInventory, { Item, equipmentType, IEquipmentCategory } from '../models/PersonaD20/CharacterEquipment';
import Character from '../models/Character';

// getDefaultItems
export const getDefaultItems = async (req: Request, res: Response) => {
    const characterId = req.params.characterId;
    const characterObjectId = new Types.ObjectId(characterId);
    const character = await Character.findById(characterObjectId);
    if (!character) {
        return res.status(404).json({message: "El personaje no existe"});
    }
    const defaultItems = await Item.find();
    const characterItems = await CharacterInventory.find({character: characterObjectId});
    res.json({defaultItems, characterItems});
}

// addItem
export const addItem = async (req: Request, res: Response) => {
    const characterId = req.params.characterId;
    const characterObjectId = new Types.ObjectId(characterId);
    const character = await Character.findById(characterObjectId);
    if (!character) {
        return res.status(404).json({message: "El personaje no existe"});
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
    const validateFields = !name || !description || !type || !category || equipped === undefined || !proficiency || !canAttack || !provideDefense || !quantity;
    if (validateFields) {
        return res.status(400).json({message: "Por favor, llena todos los campos"});
    }
    if (!Object.values(equipmentType).includes(type)) {
        return res.status(400).json({message: "Tipo de equipo inválido"});
    }
    if (typeof equipped !== "boolean" || typeof canAttack !== "boolean" || typeof provideDefense !== "boolean") {
        return res.status(400).json({message: "Los campos equipado, puede atacar y proporcionar defensa deben ser booleanos"});
    }
    if (typeof quantity !== "number") {
        return res.status(400).json({message: "La cantidad debe ser un número"});
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
    await newItem.save();
    res.send({ success: true, message: "Equipo añadido correctamente" });
}

// editItem
export const editItem = async (req: Request, res: Response) => {
    const characterId = req.params.characterId;
    const characterObjectId = new Types.ObjectId(characterId);
    const character = await Character.findById(characterObjectId);
    if (!character) {
        return res.status(404).json({message: "El personaje no existe"});
    }
    const itemId = req.params.itemId;
    const itemObjectId = new Types.ObjectId(itemId);
    const item = await CharacterInventory.findById(itemObjectId);
    if (!item) {
        return res.status(404).json({message: "El objeto no existe"});
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
    const validateFields = !name || !description || !type || !category || equipped === undefined || !proficiency || !canAttack || !provideDefense || !quantity;
    if (validateFields) {
        return res.status(400).json({message: "Por favor, llena todos los campos"});
    }
    if (!Object.values(equipmentType).includes(type)) {
        return res.status(400).json({message: "Tipo de equipo inválido"});
    }
    if (typeof equipped !== "boolean" || typeof canAttack !== "boolean" || typeof provideDefense !== "boolean") {
        return res.status(400).json({message: "Los campos equipado, puede atacar y proporcionar defensa deben ser booleanos"});
    }
    if (typeof quantity !== "number") {
        return res.status(400).json({message: "La cantidad debe ser un número"});
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
    await item.save();
    res.send({ success: true, message: "Equipo editado correctamente" });    
}

// deleteItem
export const deleteItem = async (req: Request, res: Response) => {
    const characterId = req.params.characterId;
    const characterObjectId = new Types.ObjectId(characterId);
    const character = await Character.findById(characterObjectId);
    if (!character) {
        return res.status(404).json({message: "El personaje no existe"});
    }
    const itemId = req.params.itemId;
    const itemObjectId = new Types.ObjectId(itemId);
    const item = await CharacterInventory.findById(itemObjectId);
    if (!item) {
        return res.status(404).json({message: "El objeto no existe"});
    }
    item.state = 'DELETED';
    await item.save();
    res.send({ success: true, message: "Equipo eliminado correctamente" });
}