import { env } from '@bot/env';
import fastifyCors from '@fastify/cors';
import fastifyJwt from '@fastify/jwt';
import fastify, { FastifyInstance } from 'fastify';
import { serializerCompiler, validatorCompiler, ZodTypeProvider } from 'fastify-type-provider-zod';

import { AppLogger } from '@/logger';
import WhatsappServices from '@/services/whatsapp-services';

import { errorHandler } from './error-handler';
import { registerRoutes } from './routes';
import { registerSwagger } from './swagger/swagger';

class Server {
  public app: FastifyInstance;

  constructor() {
    this.app = fastify().withTypeProvider<ZodTypeProvider>();

    this.app.setSerializerCompiler(serializerCompiler);
    this.app.setValidatorCompiler(validatorCompiler);

    this.app.setErrorHandler(errorHandler);

    this.registers();
  }

  private registers() {
    this.app.register(fastifyJwt, {
      secret: env.JWT_SECRET,
    });

    this.app.register(fastifyCors, {
      origin: '*',
    });

    registerSwagger(this.app);

    registerRoutes(this.app);
  }

  private async startWhatsApp() {
    try {
      new WhatsappServices().start();
    } catch (error) {
      AppLogger.error({ message: `Erro ao iniciar o serviço do WhatsApp: ${error}` });
      process.exit(1);
    }
  }

  public async start() {
    try {
      await this.app.listen({ port: env.SERVER_PORT });
      AppLogger.info({ message: `🚀 Server started on port ${env.SERVER_PORT}` });
      this.startWhatsApp();
    } catch (error) {
      AppLogger.error({ message: `'Erro ao iniciar o servidor: ${error}` });
      process.exit(1);
    }
  }
}

export const server = new Server();
