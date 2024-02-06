import { test } from 'tap';
import buildServer from '../utils/server';

test('request the /ping endpoint', async (t) => {
  const fastify = buildServer();

  t.teardown(() => fastify.close());

  const response = await fastify.inject({
    method: 'GET',
    url: '/ping',
  });
  t.equal(response.statusCode, 200);
  t.same(JSON.parse(response.body), { status: 'OK' });
});
