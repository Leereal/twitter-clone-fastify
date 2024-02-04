import { buildServer } from "./utils/server";

async function start() {
  const app = await buildServer();
}
start();
