import fastify, { FastifyReply, FastifyRequest } from 'fastify';
import { logger } from './logger';
import { config } from './config';
import fastifyJwt, { JWT } from '@fastify/jwt';
import { userSchemas } from '../modules/user/user.schema';
import userRoutes from '../modules/user/user.route';
import tweetRoutes from '../modules/tweet/tweet.route';
import { tweetSchemas } from '../modules/tweet/tweet.schema';

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
      username: string;
    };
  }
}
function buildServer() {
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

  for (const schema of [...userSchemas, ...tweetSchemas]) {
    app.addSchema(schema);
  }

  app.register(userRoutes, { prefix: 'api/users' });
  app.register(tweetRoutes, { prefix: 'api/tweets' });

  return app;
}

export default buildServer;
