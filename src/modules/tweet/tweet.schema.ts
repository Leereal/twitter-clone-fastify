import { buildJsonSchemas } from 'fastify-zod';
import { z } from 'zod';

const createTweetSchema = z.object({
  content: z.string().max(280),
});

const tweetResponseSchema = z.object({
  id: z.number(),
  content: z.string(),
  userId: z.number(),
  taggedUsers: z.array(z.string()),
  createdAt: z.string(),
});

const tweetsResponseSchema = z.array(tweetResponseSchema);

export type CreateTweetInput = z.infer<typeof createTweetSchema>;

export const { schemas: tweetSchemas, $ref } = buildJsonSchemas(
  {
    createTweetSchema,
    tweetResponseSchema,
    tweetsResponseSchema,
  },
  { $id: 'TweetSchema' }
);
