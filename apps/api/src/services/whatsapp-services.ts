import qrcode from 'qrcode-terminal';
import { Socket } from 'socket.io';

import WhatsappClient from '@/lib/whatsapp';
import { AppLogger } from '@/logger';

class WhatsappServices {
  private whatsappClient: WhatsappClient;
  private socket: Socket;

  constructor(socket: Socket) {
    this.whatsappClient = new WhatsappClient();
    this.socket = socket;
  }

  public start() {
    try {
      AppLogger.error({ message: `Iniciando WhatsApp...` });
      const client = this.whatsappClient.getClient();

      client.on('qr', (qrCode: string) => {
        this.socket.emit('qr', qrCode);
        qrcode.generate(qrCode, { small: true });
        console.log('Escaneie o código QR acima para fazer login no WhatsApp.');
      });

      client.on('authenticated', (session) => {
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
