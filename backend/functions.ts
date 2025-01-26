import { Request, Response} from 'express'
import * as Minio from 'minio'
import { BUCKET_KEY } from './constants'
import config from './env'
import { Types } from 'mongoose'
import { IModifier } from './models/types'

const GENERIC_BUCKET_NAME = config.GENERIC_BUCKET_NAME || ''

const minioClient = new Minio.Client({
  endPoint: config.ENDPOINT_MINIO,
  port: config.PORT_MINIO,
  useSSL: true,
  accessKey: config.ACCESS_KEY_MINIO,
  secretKey: config.SECRET_KEY_MINIO,
})

interface formatImage {
    type: string,
    data: Buffer
}

export const saveImage = async (base64: string, userId: Types.ObjectId, bucketName: string = GENERIC_BUCKET_NAME) => {
    var matches = base64.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    var response: formatImage = {
        type: "",
        data: Buffer.from('', 'base64')
    };
    if (!matches) return new Error('Invalid input string');
    if (matches.length !== 3) {
      return new Error('Invalid input string');
    }
    response.type = matches[1];
    response.data = Buffer.from(matches[2], 'base64');
    const now = new Date();

    const fileName = (now.getTime() + "." + response.type.split('/')[1])

    await minioClient.putObject(bucketName, fileName, response.data, response.data.length, { "userId": userId });

    const escritura = process.env.URL + 'dynamicFiles/' + BUCKET_KEY[bucketName] + '.' + fileName;
    return escritura;
}

export const readFile = async (key: string) => {
    const bucket = key.split('.')[0];
    const realKey = key.split('.')[1] + '.' + key.split('.')[2];
    return await minioClient.getObject(bucket, realKey);
}

export const requestFile = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        if (typeof id != "string") return;
        const result = await readFile(id);  
        
        res.write(result);
        res.end();
    } catch (e) {
        res.send({msgError: "Error solicitando el archivo", error: e})
    }
}

const stringIsNumber = (value: string | number) => isNaN(Number(value)) === false;
export function enumToArray(enumme: any) {
    return Object.keys(enumme)
        .filter(stringIsNumber)
        .map(key => enumme[key]);
}

export function arraysEqual<T>(arr1: T[], arr2: T[]): boolean {
    if (arr1.length !== arr2.length) {
        return false;
    }
    for (let i = 0; i < arr1.length; i++) {
        if (arr1[i] !== arr2[i]) {
            return false;
        }
    }
    return true;
}

export function reduceModifiers(array: IModifier[], data: any) {
    return array.filter((mod, index, self) => 
        index === self.findIndex((m) => (
            m.etiquette === mod.etiquette && 
            (
                (typeof m.value === 'number' ? m.value : data[m.value]) >= 
                (typeof mod.value === 'number' ? mod.value : data[mod.value])
            )
        ))
    ).reduce((acc: number, mod: IModifier) => {
        if (mod.state === 'INACTIVE') return acc;
        const value = typeof mod.value === 'number' ?  + mod.value : mod.value === 'advantage' ? 0 : data[mod.value];
        return acc + value;
    }, 0)
}