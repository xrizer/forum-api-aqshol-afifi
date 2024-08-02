const Hapi = require('@hapi/hapi');
const errorMiddleware = require('../middleware/errorMiddleware');
const registerJwtAuthStrategy = require('../../Infrastructures/security/jwtAuthStrategy');
const registerPlugins = require('./registerPlugins');

const createServer = async (container) => {
  const server = Hapi.server({
    host: process.env.HOST,
    port: process.env.PORT,
  });

  await registerPlugins(server, container);
  await registerJwtAuthStrategy(server);
  server.route({
    method: 'GET',
    path: '/',
    handler: () => ({
      value: 'Hello world!',
    }),
    options: {
      auth: false,  
    },
  });
  server.ext('onPreResponse', errorMiddleware);

  return server;
};

module.exports = createServer;