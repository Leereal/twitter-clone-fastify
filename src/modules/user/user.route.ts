import { FastifyInstance } from 'fastify';
import {
  getUsersHandler,
  loginHandler,
  registerUserHandler,
} from './user.controller';
import { $ref } from './user.schema';

// Define routes for user-related endpoints
async function userRoutes(server: FastifyInstance) {
  // Route for user registration
  server.post(
    '/register',
    {
      schema: {
        body: $ref('createUserSchema'), // Validate request body against createUserSchema
        response: {
          '201': $ref('createUserResponseSchema'), // Define response schema for successful registration
        },
      },
    },
    registerUserHandler // Handler function for user registration
  );

  // Route for user login
  server.post(
    '/login',
    {
      schema: {
        body: $ref('loginSchema'), // Validate request body against loginSchema
        response: {
          '200': $ref('loginResponseSchema'), // Define response schema for successful login
        },
      },
    },
    loginHandler // Handler function for user login
  );

  // Route for retrieving user information
  server.get(
    '/',
    { preHandler: [server.authenticate] }, // Authenticate user before processing the request
    getUsersHandler // Handler function for retrieving user information
  );
}

export default userRoutes;
