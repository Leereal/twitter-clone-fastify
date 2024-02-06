import prisma from '../../utils/prisma';
import { CreateTweetInput } from './tweet.schema';

export async function createTweet(userId: number, input: CreateTweetInput) {
  const { content } = input;
  const tweet = await prisma.tweet.create({
    data: {
      content,
      userId,
    },
  });
  return tweet;
}

export async function getTweetsByUserId(userId: number) {
  const tweets = await prisma.tweet.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
  return tweets;
}
