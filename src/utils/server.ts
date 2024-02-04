import fastify, { FastifyReply, FastifyRequest } from 'fastify';
import { logger } from './logger';
import { config } from './config';
import fastifyJwt, { JWT } from '@fastify/jwt';
import { userSchemas } from '../modules/user/user.schema';
import userRoutes from '../modules/user/user.route';

declare module 'fastify' {
  interface FastifyRequest {
    jwt: JWT;
  }
  export interface FastifyInstance {
    authenticate: any;
  }
}

declare module '@fastify/jwt' {
  interface FastifyJWT {
    user: {
      id: number;
      email: string;
      name: string;
    };
  }
}
export async function buildServer() {
  const app = fastify();

  app.register(fastifyJwt, {
    secret: 'uhdfeie8etk783ekjodfbjkepojvd',
  });

  app.decorate(
    'authenticate',
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        await request.jwtVerify();
      } catch (e) {
        return reply.send(e);
      }
    }
  );

  app.get('/ping', async () => {
    return { status: 'OK' };
  });

  app.addHook('preHandler', (req, reply, next) => {
    req.jwt = app.jwt;
    return next();
  });

  for (const schema of userSchemas) {
    app.addSchema(schema);
  }

  app.register(userRoutes, { prefix: 'api/users' });

  try {
    await app.listen({
      port: config.PORT,
      host: config.HOST, //So that docker won't have issues
    });

    // Logging a message indicating that the server is listening
    logger.info(`Server listening at port : ${config.PORT}`);
  } catch (err) {
    // Handling errors that may occur during server startup
    logger.error('Error starting the server:', err);
    process.exit(1);
  }
}
