import { FastifyReply, FastifyRequest } from 'fastify';
import {
  createTweet,
  getTimeline,
  getTweetsByUserId,
  getTweetsFeed,
} from './tweet.service';
import { CreateTweetInput } from './tweet.schema';

export async function createTweetHandler(
  request: FastifyRequest<{ Body: CreateTweetInput }>,
  reply: FastifyReply
) {
  const userId = request.user.id; // Assuming you have user authentication middleware
  const body = request.body;

  try {
    const tweet = await createTweet(userId, body);
    return tweet;
  } catch (error) {
    reply.code(400).send(error);
  }
}

export async function getUserTimelineHandler(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const userId = request.user.id; // Assuming you have user authentication middleware
  const username = request.user.username;
  const tweets = await getTimeline(userId, username);
  return tweets;
}

export async function getFeedsHandler(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const tweets = await getTweetsFeed();
  return tweets;
}
