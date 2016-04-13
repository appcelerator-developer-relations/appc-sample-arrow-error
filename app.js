var Arrow = require('arrow'),
  server = new Arrow();

var middleware = require('./lib/middleware');

// lifecycle examples
server.on('starting', function() {
  server.logger.debug('server is starting!');
});

server.on('started', function() {
  server.logger.debug('server started!');

  server.app.use(middleware.pageNotFound);
  server.app.use(middleware.errorHandler);
});

// start the server
server.start();
