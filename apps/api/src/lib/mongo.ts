import { env } from '@bot/env';
import mongoose, { Connection } from 'mongoose';

type DBConnection = {
  isConnected: boolean;
};

export const connectMongo = async (): Promise<Connection | undefined> => {
  const connection: DBConnection = { isConnected: false };
  try {
    if (connection.isConnected) return mongoose.connection;

    const db = await mongoose.connect(env.MONGODB_URI as string);
    connection.isConnected = db.connections[0].readyState === 1;
    console.log(`database server is running on ${db.connection.host} `);
    return db.connection;
  } catch (error: any) {
    console.error(error.name, 'server stopped running');
  }
};
