/**
 * Script para ejecutar documentos de clases en MongoDB
 * Uso: node runDocument.js <nombre_archivo>
 * Ejemplo: node runDocument.js Commander.js
 */

require('dotenv').config();
const { MongoClient, ObjectId } = require('mongodb');
const fs = require('fs');
const path = require('path');

async function runDocument(fileName) {
    const uri = process.env.MONGO_DB;
    
    if (!uri) {
        console.error('Error: MONGO_DB no está configurado en el archivo .env');
        process.exit(1);
    }

    const client = new MongoClient(uri);
    
    try {
        await client.connect();
        console.log('Conectado a MongoDB');
        
        const database = client.db('fichas');
        
        // Crear un objeto db con las colecciones
        const db = {
            class: database.collection('class'),
            spells: database.collection('spells'),
            subclass: database.collection('subclass'),
            features: database.collection('features')
        };

        // Leer el archivo del documento
        const documentPath = path.join(__dirname, 'documents', fileName);
        
        if (!fs.existsSync(documentPath)) {
            console.error(`Error: No se encontró el archivo ${documentPath}`);
            process.exit(1);
        }

        console.log(`Ejecutando documento: ${fileName}`);
        
        // Leer el archivo del documento
        let scriptContent = fs.readFileSync(documentPath, 'utf-8');
        
        // Remover las líneas de require que no son necesarias en este contexto
        scriptContent = scriptContent.replace(/^const\s*{\s*ObjectId\s*}\s*=\s*require\s*\([^)]+\)\s*;?\s*$/gm, '');
        scriptContent = scriptContent.replace(/^const\s*\w+\s*=\s*require\s*\([^)]+\)\s*;?\s*$/gm, '');
        
        // Envolver el script en una función async
        const asyncFunction = new Function('db', 'ObjectId', `
            return (async () => {
                ${scriptContent}
                return { success: true };
            })();
        `);

        const result = await asyncFunction(db, ObjectId);
        
        console.log('Documento ejecutado exitosamente');
        console.log('Resultado:', result);
        
    } catch (error) {
        console.error('Error al ejecutar el documento:', error);
    } finally {
        await client.close();
        console.log('Conexión cerrada');
    }
}

// Obtener el nombre del archivo desde los argumentos
const fileName = process.argv[2];

if (!fileName) {
    console.log('Uso: node runDocument.js <nombre_archivo>');
    console.log('Ejemplo: node runDocument.js Commander.js');
    process.exit(1);
}

runDocument(fileName);
