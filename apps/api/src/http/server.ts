import { env } from '@bot/env';
import fastifyCors from '@fastify/cors';
import fastifyJwt from '@fastify/jwt';
import fastify, { FastifyInstance } from 'fastify';
import { serializerCompiler, validatorCompiler, ZodTypeProvider } from 'fastify-type-provider-zod';
import { Server as SocketIOServer, Socket } from 'socket.io';

import { AppLogger } from '@/logger';
import WhatsappServices from '@/services/whatsapp-services';

import { errorHandler } from './error-handler';
import { registerRoutes } from './routes';
import { registerSwagger } from './swagger/swagger';

class Server {
  public app: FastifyInstance;
  private io: SocketIOServer;

  constructor() {
    this.app = fastify().withTypeProvider<ZodTypeProvider>();

    this.app.setSerializerCompiler(serializerCompiler);
    this.app.setValidatorCompiler(validatorCompiler);

    this.app.setErrorHandler(errorHandler);

    this.registers();

    const httpServer = this.app.server;
    this.io = new SocketIOServer(httpServer, {
      cors: {
        origin: '*',
        methods: ['GET', 'POST'],
      },
    });

    this.socketStart();
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

  private async startWhatsApp(socket: Socket) {
    try {
      new WhatsappServices(socket).start();
    } catch (error) {
      AppLogger.error({ message: `Erro ao iniciar o serviço do WhatsApp: ${error}` });
      process.exit(1);
    }
  }

  private socketStart() {
    this.io.on('connection', (socket) => {
      AppLogger.info({ message: 'Novo cliente conectado ao socket.' });
    });
    AppLogger.info({ message: 'Socket.io server iniciado.' });
  }

  public async start() {
    try {
      await this.app.listen({ port: env.SERVER_PORT });
      AppLogger.info({ message: `🚀 Server started on port ${env.SERVER_PORT}` });
    } catch (error) {
      AppLogger.error({ message: `'Erro ao iniciar o servidor: ${error}` });
      process.exit(1);
    }
  }
}

export const server = new Server();
