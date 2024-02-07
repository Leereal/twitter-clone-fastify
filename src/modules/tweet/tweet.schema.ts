import { buildJsonSchemas } from 'fastify-zod';
import { z } from 'zod';

// Define schema for creating a new tweet
const createTweetSchema = z.object({
  content: z.string().max(280), // Content of the tweet with maximum length of 280 characters
});

// Define schema for response of a single tweet
const tweetResponseSchema = z.object({
  id: z.number(), // Unique identifier for the tweet
  content: z.string(), // Content of the tweet
  userId: z.number(), // ID of the user who created the tweet
  taggedUsers: z.array(z.string()), // Array of usernames tagged in the tweet
  createdAt: z.string(), // Date and time when the tweet was created
});

// Define schema for response of multiple tweets
const tweetsResponseSchema = z.array(tweetResponseSchema);

// Define type for input when creating a new tweet
export type CreateTweetInput = z.infer<typeof createTweetSchema>;

// Generate JSON schemas and reference
export const { schemas: tweetSchemas, $ref } = buildJsonSchemas(
  {
    createTweetSchema,
    tweetResponseSchema,
    tweetsResponseSchema,
  },
  { $id: 'TweetSchema' }
);
