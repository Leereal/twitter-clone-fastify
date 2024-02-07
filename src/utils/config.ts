import envSchema from 'env-schema';
import { Type, Static } from '@sinclair/typebox';

// Define the schema for environment variables using TypeBox
const schema = Type.Object({
  PORT: Type.Number({
    default: 5000, // Default port number if not provided
  }),
  HOST: Type.String({
    default: '0.0.0.0', // Default host address if not provided
  }),
  DATABASE_URL: Type.String(), // Database URL is required
  JWT_SECRET: Type.String(), // JWT secret is required
});

// Define the type for environment variables based on the schema
type Env = Static<typeof schema>;

// Export the configuration object after parsing the environment variables
export const config = envSchema<Env>({
  schema, // Use the defined schema for validation
  dotenv: true, // Load variables from .env file if present
});
