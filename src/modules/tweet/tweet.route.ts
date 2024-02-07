import { FastifyInstance } from 'fastify';
import {
  createTweetHandler,
  getUserTimelineHandler,
  getFeedsHandler,
} from './tweet.controller';
import { $ref } from './tweet.schema';

// Define routes related to tweets
async function tweetRoutes(server: FastifyInstance) {
  // Route for creating a new tweet
  server.post(
    '/',
    {
      preHandler: [server.authenticate], // Authentication middleware required
      schema: {
        body: $ref('createTweetSchema'), // Validate request body using schema
        response: {
          '201': $ref('tweetResponseSchema'), // Define response schema for successful creation
        },
      },
    },
    createTweetHandler // Handler function for creating a new tweet
  );

  // Route for retrieving user timeline
  server.get(
    '/',
    {
      preHandler: [server.authenticate], // Authentication middleware required
      schema: {
        response: {
          '200': $ref('tweetsResponseSchema'), // Define response schema for successful retrieval
        },
      },
    },
    getUserTimelineHandler // Handler function for retrieving user timeline
  );

  // Route for retrieving tweets feed
  server.get(
    '/feed',
    {
      // No authentication required for public feed
      schema: {
        response: {
          '200': $ref('tweetsResponseSchema'), // Define response schema for successful retrieval
        },
      },
    },
    getFeedsHandler // Handler function for retrieving tweets feed
  );
}

export default tweetRoutes;
