import { FastifyInstance } from 'fastify';
import { createTweetHandler, getUserTweetsHandler } from './tweet.controller';
import { $ref } from './tweet.schema';

async function tweetRoutes(server: FastifyInstance) {
  server.post(
    '/',
    {
      preHandler: [server.authenticate],
      schema: {
        body: $ref('createTweetSchema'),
        response: {
          '201': $ref('tweetResponseSchema'),
        },
      },
    },
    createTweetHandler
  );

  server.get(
    '/',
    {
      preHandler: [server.authenticate],
      schema: {
        response: {
          '200': $ref('tweetsResponseSchema'),
        },
      },
    },
    getUserTweetsHandler
  );
}

export default tweetRoutes;
