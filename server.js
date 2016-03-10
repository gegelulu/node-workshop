'use strict';

var Hapi = require ('hapi'),
  path = require('path');

////////////////////////////////////////////////////////////////////////////
/// Create the Hapi server, load its plugins, and create any routes we need 
////////////////////////////////////////////////////////////////////////////

var server = new Hapi.Server({
  connections: {
    routes: {
      files: {
        relativeTo: __dirname
      }
    }
  }
});

// Here we're creating and labeling our webserver connection
server.connection({
  host: 'localhost',
  port: 8080,
  labels: ['webserver']
});

// Next, we'll add the 'inert' plugin which gives us some methods to return static content a little easier
server.register(require('inert'), function (err) {
  if (err) {
    console.error('Failed to load plugin:', err);
  }
});

// Next, we'll register our server logger so we can see what is being requested in our terminal
// Register our server logger
server.register({
  register: require('good'),
  options: {
    reporters: [{
      reporter: require('good-console'),
      events: {
        response: '*',
        log: '*'
      }
    }]
  }
}, function (err) {
  if (err) {
    throw err;
  }
});

// Next, we'll register our Hapi plugin for socket.io
server.register({
  register: require('hapi-io')
});

// Next, we'll create the base route that will be used to serve our index.html file.
server.route({
  method: 'GET',
  path: '/',
  handler: function (req, rep) {
    rep.file('files/index.html');
  }
});

// Finally, we'll create the route that will be used to serve all the static files.
// These will include all hosted css, js, fonts, and image files.
server.route({
  method: 'GET',
  path: '/{param*}',
  handler: function (req, rep) {
    rep.file(path.join('files', req.params.param));
  }
});

////////////////////////////////////
/// Create the socket and listeners 
////////////////////////////////////

// Grab a reference to the socket server
var io = server.plugins['hapi-io'].io;

// Lets create a listener for initial connections so we know when a user is connected
// The 'connection' event is built into Socket.IO and should be what the listener uses
// The listener needs a callback function which the variable socket is passed to
// Add a server.log() function that tells us a user has connected. Include the socket identifier with socket.id. Use standard string concatenation.



//Start the server when all plugins/sockets are built
server.start(function () {
  server.log('info', 'Server running at: ' + server.info.uri);
});
