import { Request, Response } from 'express';
import PersonaClass from '../models/PersonaD20/Class';

export const getClasses = async (req: Request, res: Response) => {
  try {
    const search = typeof req.query.search === 'string' ? req.query.search : undefined;
    const normalizedSearch = search?.trim();
    const query = normalizedSearch
      ? { name: { $regex: normalizedSearch, $options: 'i' } }
      : {};

    const classes = await PersonaClass.find(query, { name: 1, description: 1 })
      .sort({ name: 1 })
      .lean();

    const mappedClasses = classes.map((item) => ({
      _id: String(item._id),
      name: item.name,
      description: item.description,
      source: 'Reglas basicas',
    }));

    res.status(200).json({ classes: mappedClasses });
  } catch (error) {
    res.status(500).json({ errMsg: 'Error al obtener clases', error });
  }
};
