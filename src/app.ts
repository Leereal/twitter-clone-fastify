import { config } from './utils/config';
import { logger } from './utils/logger';
import buildServer from './utils/server';
const app = buildServer();
async function start() {
  try {
    await app.listen({
      port: config.PORT,
      host: config.HOST, //So that docker won't have issues
    });

    // Logging a message indicating that the server is listening
    logger.info(`Server listening at port : ${config.PORT}`);
  } catch (err) {
    // Handling errors that may occur during server startup
    logger.error('Error starting the server:', err);
    process.exit(1);
  }
}

start();
