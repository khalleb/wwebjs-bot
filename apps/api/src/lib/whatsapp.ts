import { Client, RemoteAuth } from 'whatsapp-web.js';

import StoreWhatsApp from './store-whatsapp';

class WhatsappClient {
  private client: Client;
  constructor() {
    const store = new StoreWhatsApp();
    this.client = new Client({
      authStrategy: new RemoteAuth({ store, backupSyncIntervalMs: 60000 * 5 }),
    });

    this.initialize();
  }

  private async initialize() {
    await this.client.initialize();
    console.log('WhatsApp Client initialized');
  }

  public getClient(): Client {
    return this.client;
  }
}

export default WhatsappClient;
