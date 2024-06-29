import { Client, RemoteAuth } from 'whatsapp-web.js';
import { MongoStore } from 'wwebjs-mongo';

import { connectMongo } from './mongo';

class WhatsappClient {
  public async connect(): Promise<Client> {
    const mongoConnection = await connectMongo();
    const client = new Client({
      authStrategy: new RemoteAuth({
        store: new MongoStore({ mongoose: mongoConnection }),
        backupSyncIntervalMs: 300000,
      }),
      webVersionCache: {
        type: 'remote',
        remotePath: `https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/2.2412.54.html`,
      },
    });
    client.initialize();
    return client;
  }
}

export default WhatsappClient;
