import { test } from 'tap';
import buildServer from '../../../utils/server';

test('GET `/api/tweets/feed`', async () => {
  test('get tweets feed', async (t) => {
    const fastify = buildServer();

    t.teardown(async () => {
      fastify.close();
    });

    // Make a GET request to fetch tweets feed without including the access token
    const response = await fastify.inject({
      method: 'GET',
      url: '/api/tweets/feed',
    });

    // Assertions for the response
    t.equal(response.statusCode, 200); // Check if the request was successful
    // Add more assertions as needed
  });
});

//We can add more tests needed here
