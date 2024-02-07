import { Prisma, User } from '@prisma/client';
import prisma from '../../utils/prisma';
import { CreateTweetInput } from './tweet.schema';

export async function createTweet(userId: number, input: CreateTweetInput) {
  try {
    const { content } = input;

    // Extract usernames tagged in the tweet content
    const taggedUsernames =
      content?.match(/@(\w+)/g)?.map((username) => username.slice(1)) || [];

    const tweet = await prisma.tweet.create({
      data: {
        content,
        userId,
        taggedUsers: { set: taggedUsernames }, // Store tagged users in the database
      },
    });

    return tweet;
  } catch (error: any) {
    // Handle the error appropriately, log it, and/or throw a custom error
    throw new Error(`Error creating tweet: ${error.message}`);
  }
}

export async function getTweetsByUserId(userId: number) {
  try {
    const tweets = await prisma.tweet.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return tweets;
  } catch (error: any) {
    // Handle the error appropriately, log it, and/or throw a custom error
    throw new Error(`Error getting tweets by user ID: ${error.message}`);
  }
}

export async function getTimeline(userId: number, username: string) {
  try {
    // 1. Get all tweets by the user and also tweets they are tagged on
    const tweets = await prisma.tweet.findMany({
      where: {
        OR: [
          { userId },
          {
            taggedUsers: {
              has: username,
            },
          },
        ],
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return tweets;
  } catch (error: any) {
    // Handle the error appropriately, log, and/or throw a custom error
    throw new Error(`Error fetching user timeline: ${error.message}`);
  }
}

//getTweetsFeed
export async function getTweetsFeed() {
  try {
    //Implement a public feed that displays tweets from all users displayed chronologically
    const tweets = await prisma.tweet.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
    return tweets;
  } catch (error: any) {
    throw new Error(`Error fetching feeds: ${error.message}`);
  }
}
