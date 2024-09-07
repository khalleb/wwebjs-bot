import { writeFileSync } from 'node:fs';

import fs from 'fs/promises';
import path from 'path';
import { Store } from 'whatsapp-web.js';

import { prisma } from '@/lib/prisma';

interface IPostgresStoreOptions {
  session: string;
  path?: string;
}

class StoreWhatsApp implements Store {
  public async sessionExists(options: IPostgresStoreOptions): Promise<boolean> {
    console.info(`------------ sessionExists: `);
    const hasExistingSession = await prisma.sessionWhatsApp.findUnique({
      where: {
        session: options.session,
      },
    });

    const result = hasExistingSession !== null;
    console.info(`------------ sessionExists: ${result}`);
    return result;
  }

  public async save(options: IPostgresStoreOptions): Promise<void> {
    const sessionFilePath = path.join(options.path || '.', `${options.session}.zip`);
    console.info(`------------ save: ${sessionFilePath}`);
    const sessionData = await fs.readFile(sessionFilePath);
    console.info(`------------ save: Vai tentar salvar no banco de dados`);
    await prisma.sessionWhatsApp.create({
      data: {
        session: options.session,
        files: sessionData,
      },
    });
  }

  public async extract(options: IPostgresStoreOptions): Promise<void> {
    console.info(`------------ extract`);
    const result = await prisma.sessionWhatsApp.findUnique({
      where: {
        session: options.session,
      },
    });
    console.info(`------------ extract `);
    if (result && result.files) {
      const buffer = Buffer.from(result.files);
      const filePath = path.join(options?.path || `${result.files}.zip`, `${result.session}.zip`);
      writeFileSync(filePath, buffer);
    }
  }

  public async delete(options: IPostgresStoreOptions): Promise<void> {
    console.info(`------------ delete: `);
    await prisma.sessionWhatsApp.deleteMany({
      where: {
        session: options.session,
      },
    });
  }
}

export default StoreWhatsApp;
