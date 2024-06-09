import { connect } from "mongoose";
import config from './env';

export const startConnection = async (): Promise<void> => {
  try {
    const db = await connect(config.MONGO_DB, {dbName: "fichas"});  //|| 'mongodb://localhost/mevn-database');
    console.log(db.connection.name);
  } catch (error) {
    console.error(error);
  }
};
