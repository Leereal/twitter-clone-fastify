import { FastifyInstance } from 'fastify';
import {
  createTweetHandler,
  getUserTimelineHandler,
  getFeedsHandler,
} from './tweet.controller';
import { $ref } from './tweet.schema';

async function tweetRoutes(server: FastifyInstance) {
  server.post(
    '/',
    {
      // preHandler: [server.authenticate],
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
      // preHandler: [server.authenticate],
      schema: {
        response: {
          '200': $ref('tweetsResponseSchema'),
        },
      },
    },
    getUserTimelineHandler
  );
  server.get(
    '/feed',
    {
      //Since this is "public" feed there is no need for authentication
      schema: {
        response: {
          '200': $ref('tweetsResponseSchema'),
        },
      },
    },
    getFeedsHandler
  );
}

export default tweetRoutes;
