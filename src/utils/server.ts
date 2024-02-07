import fastify, { FastifyReply, FastifyRequest } from 'fastify';
import fastifyJwt, { JWT } from '@fastify/jwt';
import { userSchemas } from '../modules/user/user.schema';
import userRoutes from '../modules/user/user.route';
import tweetRoutes from '../modules/tweet/tweet.route';
import { tweetSchemas } from '../modules/tweet/tweet.schema';
import swaggerConfig from './swaggerConfig';
import { withRefResolver } from 'fastify-zod';
import fastifySwaggerUi from '@fastify/swagger-ui';
import { config } from './config';

// Extend the Fastify types to include JWT related properties
declare module 'fastify' {
  interface FastifyRequest {
    jwt: JWT;
  }
  export interface FastifyInstance {
    authenticate: any;
  }
}
// Extend the JWT types to include user information
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

// Function to build the Fastify server
function buildServer() {
  const app = fastify();

  // Register Swagger plugin to generate API documentation
  app.register(require('@fastify/swagger'), {
    routePrefix: '/doc', // Define the route prefix for Swagger UI
    exposeRoute: true, // Expose Swagger JSON schema
    swagger: withRefResolver(swaggerConfig), // Use the swagger configuration
  });

  // Register JWT plugin for authentication
  app.register(fastifyJwt, {
    secret: config.JWT_SECRET, // Secret key for JWT
  });

  // Decorating the Fastify instance with an authentication method
  app.decorate(
    'authenticate',
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        await request.jwtVerify(); // Verify JWT token
      } catch (e) {
        return reply.send(e); // Handle authentication errors
      }
    }
  );

  // Define a ping route for health checks
  app.get('/ping', async () => {
    return { status: 'OK' };
  });

  // Add a preHandler hook to attach JWT to the request object
  app.addHook('preHandler', (req, reply, next) => {
    req.jwt = app.jwt; // Attach JWT to request object
    return next();
  });

  // Add schemas for user and tweet modules
  for (const schema of [...userSchemas, ...tweetSchemas]) {
    app.addSchema(schema);
  }

  // Register user and tweet routes with respective prefixes
  app.register(userRoutes, { prefix: 'api/users' });
  app.register(tweetRoutes, { prefix: 'api/tweets' });

  // Register Swagger UI to view API documentation
  app.register(fastifySwaggerUi, {
    routePrefix: '/docs', // Define the route prefix for Swagger UI
  });

  return app; // Return the configured Fastify instance
}

export default buildServer; // Export the buildServer function
