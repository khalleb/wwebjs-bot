import { Client, LocalAuth } from 'whatsapp-web.js';

class WhatsappClient {
  private client: Client;
  constructor() {
    this.client = new Client({
      authStrategy: new LocalAuth({ dataPath: '.' }),
      webVersionCache: {
        type: 'remote',
        remotePath: `https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/2.2412.54.html`,
      },
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
