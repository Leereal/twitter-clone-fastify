import { buildJsonSchemas } from 'fastify-zod';
import { z } from 'zod';

// Define core user schema
const userCore = {
  name: z.string().min(2),
  username: z.string().min(4),
  email: z
    .string({
      required_error: 'Email is required',
      invalid_type_error: 'Email must be a string',
    })
    .email(),
};

// Define schema for creating a new user
const createUserSchema = z.object({
  ...userCore,
  password: z
    .string({
      required_error: 'Password is required',
      invalid_type_error: 'Password must be a string',
    })
    .min(8),
});

// Define schema for the response when creating a new user
const createUserResponseSchema = z.object({
  id: z.number(),
  ...userCore,
});

// Define schema for login input
const loginSchema = z.object({
  identifier: z
    .string({
      required_error: 'Username or Email is required',
      invalid_type_error: 'Username or Email must be a string',
    })
    .regex(/^(?=.*[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$)|(?!.*@).*$/)
    .min(3),
  password: z
    .string({
      required_error: 'Password is required',
      invalid_type_error: 'Password must be a string',
    })
    .min(8),
});

// Define schema for the response when logging in
const loginResponseSchema = z.object({
  accessToken: z.string(),
});

// Export types for input schemas
export type CreateUserInput = z.infer<typeof createUserSchema>;
export type LoginInput = z.infer<typeof loginSchema>;

// Build JSON schemas and export
export const { schemas: userSchemas, $ref } = buildJsonSchemas(
  {
    createUserSchema,
    createUserResponseSchema,
    loginSchema,
    loginResponseSchema,
  },
  { $id: 'UserSchema' }
);
