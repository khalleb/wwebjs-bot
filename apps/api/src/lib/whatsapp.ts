import Whatsapp, { ClientOptions } from 'whatsapp-web.js';
const { Client, LocalAuth } = Whatsapp;

interface Config {
  client: ClientOptions;
}

const config: Config = {
  client: {
    authStrategy: new LocalAuth(),
    webVersionCache: {
      type: 'remote',
      remotePath: `https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/2.2412.54.html`,
    },
  },
};
const client = new Client(config.client);
client.initialize();

export { client as default };
