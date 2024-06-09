namespace NodeJS {
    interface ProcessEnv {
      MONGO_DB: string;
      SECRET: string;
    }
    interface IUser {
      user: object,
      iat: number,
      exp: number
    }
  }