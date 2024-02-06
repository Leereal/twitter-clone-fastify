import { FastifyReply, FastifyRequest } from 'fastify';
import { createTweet, getTweetsByUserId } from './tweet.service';
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

export async function getUserTweetsHandler(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const userId = request.user.id; // Assuming you have user authentication middleware

  const tweets = await getTweetsByUserId(userId);
  return tweets;
}
