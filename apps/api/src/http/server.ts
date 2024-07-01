import { env } from '@bot/env';
import fastifyCors from '@fastify/cors';
import fastifyJwt from '@fastify/jwt';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUI from '@fastify/swagger-ui';
import fastify, { FastifyInstance } from 'fastify';
import { jsonSchemaTransform, serializerCompiler, validatorCompiler, ZodTypeProvider } from 'fastify-type-provider-zod';
import { Server as SocketIOServer, Socket } from 'socket.io';

import { AppLogger } from '@/logger';
import WhatsappServices from '@/services/whatsapp-services';

import { errorHandler } from './error-handler';
import { authenticateWithPassword } from './routes/auth/authenticate-with-password';
import { createAccount } from './routes/auth/create-account';
import { getProfile } from './routes/auth/get-profile';
import { requestPasswordRecover } from './routes/auth/request-password-recover';
import { resetPassword } from './routes/auth/reset-password';

class Server {
  public app: FastifyInstance;
  private io: SocketIOServer;

  constructor() {
    this.app = fastify().withTypeProvider<ZodTypeProvider>();

    this.app.setSerializerCompiler(serializerCompiler);
    this.app.setValidatorCompiler(validatorCompiler);

    this.app.setErrorHandler(errorHandler);

    this.registerSwagger();

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

  private registerSwagger() {
    this.app.register(fastifySwagger, {
      openapi: {
        info: {
          title: 'WhatsApp Bot',
          description: 'Service WhatsApp Bot',
          version: '1.0.0',
        },
        components: {
          securitySchemes: {
            bearerAuth: {
              type: 'http',
              scheme: 'bearer',
              bearerFormat: 'JWT',
            },
          },
        },
      },
      transform: jsonSchemaTransform,
    });

    this.app.register(fastifySwaggerUI, {
      routePrefix: '/docs',
    });
  }

  private registers() {
    this.app.register(fastifyJwt, {
      secret: env.JWT_SECRET,
    });

    this.app.register(fastifyCors, {
      origin: '*',
    });

    this.app.register(createAccount);
    this.app.register(authenticateWithPassword);
    this.app.register(requestPasswordRecover);
    this.app.register(resetPassword);
    this.app.register(getProfile);
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
      this.startWhatsApp(socket);
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
