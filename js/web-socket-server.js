function _createWebSocketServer(port, serverName, webSocketConnectionHandler) {
  var app = createExpressApp(serverName);
  var httpServer = createHTTPServer(app, port, serverName);
  createWebSocketServer(httpServer, webSocketConnectionHandler);
}

function createExpressApp(serverName) {
  var express = require('express');
  var app = express();
  app.get('/*', function(request, response) {
    response.send(httpConnectionResponse(request));
  });
  return app;

  function httpConnectionResponse(request) {
    return 'Please connect to the ' + serverName +
      ' websocket at ws://' + request.get('host');
  }
}

function createHTTPServer(app, port, serverName) {
  var http = require('http');
  var httpServer = http.createServer(app);
  httpServer.listen(port);
  console.log('%s listening on port %d', serverName, port);
  return httpServer;
}

function createWebSocketServer(httpServer, webSocketConnectionHandler) {
  var ws = require('ws');
  var webSocketServer = new ws.Server({ server: httpServer });
  webSocketServer.on('connection', webSocketConnectionHandler);
}

module.exports = _createWebSocketServer;
