import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve("./.env") })
  interface ENV {
    MONGO_DB: string | undefined;
    SECRET: string | undefined;
    REFRESH_SECRET: string | undefined;
    SECRET_KEY_MINIO: string | undefined;
    ACCESS_KEY_MINIO: string | undefined;
    PORT_MINIO: number;
    ENDPOINT_MINIO: string | undefined;
    GENERIC_BUCKET_NAME: string | undefined;
  }
  
  interface Config {
    MONGO_DB: string;
    SECRET: string;
    REFRESH_SECRET: string;
    SECRET_KEY_MINIO: string;
    ACCESS_KEY_MINIO: string;
    PORT_MINIO: number;
    ENDPOINT_MINIO: string;
    GENERIC_BUCKET_NAME: string;
  }
  
  // Loading process.env as ENV interface
  
  const getConfig = (): ENV => {
    return {
      MONGO_DB: process.env.MONGO_DB,
      SECRET: process.env.SECRET,
      REFRESH_SECRET: process.env.REFRESH_SECRET,
      ENDPOINT_MINIO: process.env.ENDPOINT_MINIO,
      PORT_MINIO: Number.parseInt(process.env.PORT_MINIO || '9000'),
      ACCESS_KEY_MINIO: process.env.ACCESS_KEY_MINIO,
      SECRET_KEY_MINIO: process.env.SECRET_KEY_MINIO,
      GENERIC_BUCKET_NAME: process.env.GENERIC_BUCKET_NAME,
    };
  };
  
  const getSanitzedConfig = (config: ENV): Config => {
    for (const [key, value] of Object.entries(config)) {
      if (value === undefined) {
        throw new Error(`Missing key ${key} in config.env`);
      }
    }
    return config as Config;
  };
  
  const config = getConfig();
  
  const sanitizedConfig = getSanitzedConfig(config);
  
export default sanitizedConfig;