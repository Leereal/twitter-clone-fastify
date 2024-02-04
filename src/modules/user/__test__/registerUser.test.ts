import { faker } from "@faker-js/faker";
import { test } from "tap";
import buildServer from "../../../server";
import { ImportMock } from "ts-mock-imports";
import * as userService from "../user.service";
import prisma from "../../../utils/prisma";

// Test case for successful user creation using mock `createUser` function
test("POST `/api/users` - create user successfully with mock createUser", async (t) => {
  // Generate fake user data
  const name = faker.person.fullName();
  const email = faker.internet.email();
  const password = faker.internet.password();
  const id = Math.floor(Math.random() * 1_000);

  // Build Fastify server instance
  const fastify = buildServer();

  // Mock the `createUser` function with predefined data
  const stub = ImportMock.mockFunction(userService, "createUser", {
    name,
    email,
    id,
  });

  // Teardown function to close the Fastify server and restore the mocked function
  t.teardown(() => {
    fastify.close();
    stub.restore();
  });

  // Make a POST request to create a user
  const response = await fastify.inject({
    method: "POST",
    url: "/api/users",
    payload: {
      name,
      email,
      password,
    },
  });

  // Assertions for the response
  // Check if the status code is as expected
  t.equal(response.statusCode, 201);

  // Check if the content type header is correct
  t.equal(response.headers["content-type"], "application/json; charset=utf-8");

  // Parse the response JSON and check if the data matches the expected values
  const json = response.json();
  t.equal(json.name, name);
  t.equal(json.email, email);
  t.equal(json.id, id);

  // Restore the mocked function
  stub.restore();
});

// Test case for successful user creation using a test database (empty for now)
test("POST `/api/users` - create user successfully with test database", async (t) => {
  // Generate fake user data
  const name = faker.person.fullName();
  const email = faker.internet.email();
  const password = faker.internet.password();

  // Build Fastify server instance
  const fastify = buildServer();

  // Teardown function to close the Fastify server and restore the mocked function
  t.teardown(async () => {
    fastify.close();
    //When done delete all the users in our database
    await prisma.user.deleteMany({});
  });

  // Make a POST request to create a user
  const response = await fastify.inject({
    method: "POST",
    url: "/api/users",
    payload: {
      name,
      email,
      password,
    },
  });

  // Assertions for the response
  // Check if the status code is as expected
  t.equal(response.statusCode, 201);

  // Check if the content type header is correct
  t.equal(response.headers["content-type"], "application/json; charset=utf-8");

  // Parse the response JSON and check if the data matches the expected values
  const json = response.json();
  t.equal(json.name, name);
  t.equal(json.email, email);
  t.equal(json.id, "number");
});

// Test case for failing to create a user (empty for now)
test("POST `/api/users` - fail to create user", async (t) => {
  // Generate fake user data
  const name = faker.person.fullName();
  const email = faker.internet.email();
  const password = faker.internet.password();

  // Build Fastify server instance
  const fastify = buildServer();

  // Teardown function to close the Fastify server and restore the mocked function
  t.teardown(async () => {
    fastify.close();
    //When done delete all the users in our database
    await prisma.user.deleteMany({});
  });

  // Make a POST request to create a user
  const response = await fastify.inject({
    //Let's remove email to trigger the error
    method: "POST",
    url: "/api/users",
    payload: {
      name,
      password,
    },
  });

  // Assertions for the response
  // Check if the status code is as expected
  t.equal(response.statusCode, 400);

  // Parse the response JSON and check if the data matches the expected values
  const json = response.json();
  t.equal(json.message, "body should have required property 'email'");
});
