import { FastifyReply, FastifyRequest } from 'fastify';
import {
  createTweet,
  getTimeline,
  getTweetsByUserId,
  getTweetsFeed,
} from './tweet.service';
import { CreateTweetInput } from './tweet.schema';

// Handler function for creating a new tweet
export async function createTweetHandler(
  request: FastifyRequest<{ Body: CreateTweetInput }>,
  reply: FastifyReply
) {
  const userId = request.user.id; // Get user ID from authenticated request
  const body = request.body;

  try {
    const tweet = await createTweet(userId, body); // Create a new tweet with the provided data
    return tweet; // Return the created tweet
  } catch (error) {
    reply.code(400).send(error); // Send an error response if tweet creation fails
  }
}

// Handler function for retrieving user timeline
export async function getUserTimelineHandler(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const userId = request.user.id; // Get user ID from authenticated request
  const username = request.user.username; // Get username from authenticated request
  const tweets = await getTimeline(userId, username); // Retrieve user timeline tweets
  return tweets; // Return the user timeline
}

// Handler function for retrieving tweets feed
export async function getFeedsHandler(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const tweets = await getTweetsFeed(); // Retrieve tweets feed
  return tweets; // Return the tweets feed
}
