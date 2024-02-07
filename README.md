# Twitter Clone API

This is a simple Twitter clone API built with Fastify and TypeScript.

## Setup

### Prerequisites

- Node.js Version 20 or higher
- npm or yarn

### Installation

1. Clone the repository
2. Navigate to the project directory
3. Install dependencies

```
npm install
```

## Configuration

Create a postgres database using any tool of your choice and create a .env file based on the .env.example file. Configure the environment variables.

## Running Migration

```
npx prisma migrate dev --name init
```

## Running the Server in Development

For development, run:

```
npm run dev
```

This restarts the server when files change.

Server runs on port 5000. Access at http://localhost:5000

## API Documentation

API docs at /docs route.

## Scripts

- `npm run dev` - Start in development mode
- `npm run build` - Compile TypeScript

## Testing

To run tests create a test database and add database string to .env.test then run the following command and that's it. Without database tests will fail

```
npm test
```

## Folder Structure

```
|── prisma/
├── src/
|   ├── __tests__/
│   ├── modules/
│   ├── utils/
├── .env.example
├── .eslintrc.js
├── tsconfig.json
├── package.json
└── README.md
```
