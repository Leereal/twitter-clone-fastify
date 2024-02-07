import { FastifyReply, FastifyRequest } from 'fastify';
import {
  createUser,
  findUserByEmail,
  findUserByUsername,
  getUsers,
} from './user.service';
import { CreateUserInput, LoginInput } from './user.schema';
import { verifyPassword } from '../../utils/hash';

// Handler function for registering a new user
export async function registerUserHandler(
  request: FastifyRequest<{
    Body: CreateUserInput; // Define request body type as CreateUserInput
  }>,
  reply: FastifyReply
) {
  const body = request.body;
  try {
    const user = await createUser(body); // Create a new user with the provided data
    reply.code(201).send(user); // Send a success response with the created user
  } catch (error) {
    reply.code(400).send(error); // Send an error response if registration fails
  }
}

// Handler function for user login
export async function loginHandler(
  request: FastifyRequest<{ Body: LoginInput }>,
  reply: FastifyReply
) {
  const { identifier, password } = request.body;

  // Find user by email or username
  const user =
    (await findUserByEmail(identifier)) ||
    (await findUserByUsername(identifier));

  // If user is not found, return unauthorized error
  if (!user) {
    return reply.code(401).send('Invalid email or password');
  }

  // Verify user password
  const correctPassword = verifyPassword({
    candidatePassword: password,
    salt: user.salt,
    hash: user.password,
  });

  // If password is correct, generate JWT token and return it
  if (correctPassword) {
    const { password, ...rest } = user; // Exclude password from user data
    const token = request.jwt.sign(rest); // Sign JWT token with user data
    return {
      accessToken: token, // Return access token in response
    };
  }

  // If password is incorrect, return unauthorized error
  return reply.code(401).send({
    message: 'Invalid email or password',
  });
}

// Handler function for retrieving all users
export async function getUsersHandler() {
  const users = await getUsers(); // Retrieve all users from the database
  return users; // Return the list of users
}
