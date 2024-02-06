import { FastifyReply, FastifyRequest } from 'fastify';
import {
  createUser,
  findUserByEmail,
  findUserByUsername,
  getUsers,
} from './user.service';
import { CreateUserInput, LoginInput } from './user.schema';
import { verifyPassword } from '../../utils/hash';

export async function registerUserHandler(
  request: FastifyRequest<{
    Body: CreateUserInput;
  }>,
  reply: FastifyReply
) {
  const body = request.body;
  try {
    const user = await createUser(body);
    reply.code(201).send(user);
  } catch (error) {
    reply.code(400).send(error);
  }
}

export async function loginHandler(
  request: FastifyRequest<{ Body: LoginInput }>,
  reply: FastifyReply
) {
  const { identifier, password } = request.body;

  // Find user by email or username
  const user =
    (await findUserByEmail(identifier)) ||
    (await findUserByUsername(identifier));

  if (!user) {
    return reply.code(401).send('Invalid email or password');
  }

  const correctPassword = verifyPassword({
    candidatePassword: password,
    salt: user.salt,
    hash: user.password,
  });

  if (correctPassword) {
    const { password, ...rest } = user;
    const token = request.jwt.sign(rest);
    return {
      accessToken: token,
    };
  }

  return reply.code(401).send({
    message: 'Invalid email or password',
  });
}

export async function getUsersHandler() {
  const users = await getUsers();
  return users;
}
