import multer from 'multer';

// Configuración de multer para almacenamiento en memoria
const storage = multer.memoryStorage();

// Filtro para validar tipos de archivo
const fileFilter = (req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    
    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Tipo de archivo no permitido. Solo se permiten imágenes (jpeg, png, gif, webp).'));
    }
};

// Configuración principal de multer
export const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // Límite de 5MB
    }
});

// Middleware para manejar errores de multer
export const handleMulterError = (err: any, req: any, res: any, next: any) => {
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ errMsg: 'El archivo es demasiado grande. Máximo 5MB.' });
        }
        return res.status(400).json({ errMsg: 'Error al procesar el archivo.', error: err.message });
    } else if (err) {
        return res.status(400).json({ errMsg: err.message });
    }
    next();
};
