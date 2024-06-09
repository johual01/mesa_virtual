import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve("./.env") })
  interface ENV {
    MONGO_DB: string | undefined;
    SECRET: string | undefined;
    REFRESH_SECRET: string | undefined;
  }
  
  interface Config {
    MONGO_DB: string;
    SECRET: string;
    REFRESH_SECRET: string;
  }
  
  // Loading process.env as ENV interface
  
  const getConfig = (): ENV => {
    return {
      MONGO_DB: process.env.MONGO_DB,
      SECRET: process.env.SECRET,
      REFRESH_SECRET: process.env.REFRESH_SECRET
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