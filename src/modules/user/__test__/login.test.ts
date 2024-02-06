import { faker } from '@faker-js/faker';
import prisma from '../../../utils/prisma';
import { test } from 'tap';
import buildServer from '../../../utils/server';
import { UserType } from '@fastify/jwt';

// Test suite for the login endpoint
test('POST `/api/users/login`', async () => {
  // Test case: given valid email and password
  test('the given email and password are correct', async (t) => {
    // Generate fake user data
    const name = faker.person.fullName();
    const email = faker.internet.email();
    const password = faker.internet.password();
    const username = faker.internet.userName();

    // Build Fastify server instance
    const fastify = buildServer();

    // Teardown function to close the Fastify server after the test
    t.teardown(async () => {
      fastify.close();
    });

    // Register the user by making a POST request to the register endpoint
    await fastify.inject({
      method: 'POST',
      url: '/api/users/register',
      payload: {
        email,
        username,
        password,
        name,
      },
    });

    // Attempt to login with the registered email and password
    const response = await fastify.inject({
      method: 'POST',
      url: '/api/users/login',
      payload: {
        identifier: email,
        password,
      },
    });

    // Assertions for successful login
    t.equal(response.statusCode, 200); // Check if the response status code is 200 OK

    // Verify the JWT token received in the response
    const verified = fastify.jwt.verify<UserType & { iat: number }>(
      response.json().accessToken
    );

    t.equal(verified.email, email); // Check if the email in the token matches the registered email
    t.equal(verified.name, name); // Check if the name in the token matches the registered name
    t.type(verified.id, 'number'); // Check if the user ID in the token is a number
    t.type(verified.iat, 'number'); // Check if the issued at timestamp in the token is a number
  });

  // Test case: given invalid email or password
  test('the given email and password are not correct', async (t) => {
    // Generate fake user data
    const name = faker.person.fullName();
    const email = faker.internet.email();
    const username = faker.internet.userName();
    const password = faker.internet.password();

    // Build Fastify server instance
    const fastify = buildServer();

    // Teardown function to close the Fastify server after the test
    t.teardown(async () => {
      fastify.close();
    });

    // Register the user by making a POST request to the register endpoint
    await fastify.inject({
      method: 'POST',
      url: '/api/users/register',
      payload: {
        email,
        username,
        password,
        name,
      },
    });

    // Attempt to login with the registered email and incorrect password
    const response = await fastify.inject({
      method: 'POST',
      url: '/api/users/login',
      payload: {
        identifier: email,
        password: 'wrongpassword',
      },
    });

    // Assertions for failed login
    t.equal(response.statusCode, 401); // Check if the response status code is 401 Unauthorized

    const json = response.json();
    t.equal(json.message, 'Invalid email or password'); // Check if the error message is as expected
  });
});

// We can add more test cases as needed
