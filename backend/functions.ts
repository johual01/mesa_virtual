import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { Request, Response} from 'express'

const AWS_BUCKET_NAME = process.env.AWS_BUCKET_NAME;
const AWS_BUCKET_REGION = process.env.AWS_BUCKET_REGION;
const AWS_PUBLIC_KEY = process.env.AWS_PUBLIC_KEY || "";
const AWS_SECRET_KEY = process.env.AWS_SECRET_KEY || "";

const client = new S3Client(
    {
        region: AWS_BUCKET_REGION,
        credentials: {
            accessKeyId: AWS_PUBLIC_KEY,
            secretAccessKey: AWS_SECRET_KEY
        }
    }
)

interface formatImage {
    type: string,
    data: Buffer
}

export const saveImage = async (base64: string) => {

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

    const uploadParams = {
        Bucket: AWS_BUCKET_NAME,
        Key: (now.getTime() + "." + response.type.split('/')[1]),
        Body: Buffer.from(matches[2], 'base64')
    } 

    const command = new PutObjectCommand(uploadParams);
    await client.send(command);
    const escritura = process.env.URL + 'dynamicFiles/' + (now.getTime() + "." + response.type.split('/')[1]);
    return escritura;
}

export const readFile = async (key: string) => {
    const command = new GetObjectCommand({
        Bucket: AWS_BUCKET_NAME,
        Key: key
     })
     return await client.send(command);
}

export const requestFile = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        if (typeof id != "string") return;
        const result = await readFile(id);        
        if (!result.Body) return;
        const stringResult = await result.Body.transformToString('base64');
        const buffer = Buffer.from(stringResult, "base64");
        res.writeHead(200, {
            'Content-Type': 'image/' + id.split('.')[1],
            'Content-Length': buffer.length
        });
        res.end(buffer); 
    } catch (e) {
        res.send({msgError: "Error solicitando el archivo", error: e})
    }
}