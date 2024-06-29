import qrcode from 'qrcode-terminal';

import WhatsappClient from '@/lib/whatsapp';

class WhatsappServices {
  public async createConnection(): Promise<void> {
    const wwc = new WhatsappClient();
    const connection = await wwc.connect();

    connection.on('qr', (qrCode) => {
      qrcode.generate(qrCode, { small: true });
      console.log('Escaneie o código QR acima para fazer login no WhatsApp.');
    });
  }
}

export default WhatsappServices;
