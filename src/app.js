require('dotenv').config();
const createServer = require('./Infrastructures/http/createServer');
const container = require('./Infrastructures/container');

const start = async () => {
  const server = await createServer(container);
  await server.start();
  console.log('Registered Routes:');
  server.table().forEach(route => {
    const routeObj = {
      method: route.method.toUpperCase(),
      path: route.path,
      options: route.settings.options || {},
      handler: route.settings.handler.name || 'Anonymous',
    };
    console.log('');
    console.log(`${routeObj.method} ${routeObj.path}`);
    console.log('------------------------------------------------');
  });

  console.log(`server start at ${server.info.uri}`);
};

start();