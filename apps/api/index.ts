import { server } from './src/http/server';

async function initializeApplication() {
  await server.start();
}

initializeApplication();
