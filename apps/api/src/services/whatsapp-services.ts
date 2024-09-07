import qrcode from 'qrcode-terminal';

import WhatsappClient from '@/lib/whatsapp';
import { AppLogger } from '@/logger';

class WhatsappServices {
  private whatsappClient: WhatsappClient;

  constructor() {
    this.whatsappClient = new WhatsappClient();
  }

  public start() {
    try {
      AppLogger.error({ message: `Iniciando WhatsApp...` });
      const client = this.whatsappClient.getClient();

      client.on('qr', (qrCode: string) => {
        console.log(`------------------------------------------`);

        qrcode.generate(qrCode, { small: true });
        console.log('Escaneie o código QR acima para fazer login no WhatsApp.');
      });

      client.on('authenticated', () => {
        console.log('WhatsApp Client authenticated');
        // Salvar informações da sessão, se necessário
      });

      client.on('ready', () => {
        console.log('WhatsApp Client is ready');
        // Iniciar lógica adicional após a inicialização completa
      });

      client.on('message', async (msg) => {
        console.log('Received message:', msg.body);
        // Processar a mensagem recebida
      });

      client.on('disconnected', (reason) => {
        console.log('WhatsApp Client disconnected:', reason);
        // Lógica de reconexão, se desejado
      });
    } catch (error) {
      AppLogger.error({
        message: `Erro ao iniciar o serviço do WhatsApp: ${error}`,
      });
    }
  }
}

export default WhatsappServices;
