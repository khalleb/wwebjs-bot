import { env } from '@bot/env';
import fastifyCors from '@fastify/cors';
import fastifyJwt from '@fastify/jwt';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUI from '@fastify/swagger-ui';
import fastify, { FastifyInstance } from 'fastify';
import WhatsappServices from '@/services/whatsapp-services';

import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from 'fastify-type-provider-zod';

import { errorHandler } from './error-handler';
import { authenticateWithPassword } from './routes/auth/authenticate-with-password';
import { createAccount } from './routes/auth/create-account';
import { getProfile } from './routes/auth/get-profile';
import { requestPasswordRecover } from './routes/auth/request-password-recover';
import { resetPassword } from './routes/auth/reset-password';

class Server {
  public app: FastifyInstance;

  constructor() {
    this.app = fastify().withTypeProvider<ZodTypeProvider>();

    this.app.setSerializerCompiler(serializerCompiler);
    this.app.setValidatorCompiler(validatorCompiler);

    this.app.setErrorHandler(errorHandler);

    this.registerSwagger();

    this.registers();

    this.createConnectionWhatsApp();
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

    this.app.register(fastifyCors);

    this.app.register(createAccount);
    this.app.register(authenticateWithPassword);
    this.app.register(requestPasswordRecover);
    this.app.register(resetPassword);
    this.app.register(getProfile);
  }

  private createConnectionWhatsApp() {
    const clientWhasApp = new WhatsappServices();
    clientWhasApp.createConnection();
  }

  public async start() {
    this.app
      .listen({ port: env.SERVER_PORT })
      .then(() => {
        console.log('HTTP server running!');
      })
      .catch((error) => {
        console.log(error);
        process.exit(1);
      });
  }
}

export const server = new Server();
