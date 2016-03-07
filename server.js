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
// The 'connection' event is built into Socket.IO
// All custom listeners should be made inside this callback
// These logs are going through our Good plugin
io.on('connection', function (socket) {
  server.log('Socket', 'User connected with ID ' + socket.id);

  // We'll also bind to the socket's disconnection so we know when it goes away
  socket.on('disconnect', function () {
    server.log('Socket', 'User ' + socket.id + ' disconnected');
  });

  // The following listeners are specific ones we'll create and are not part of Socket.IO by default
  // Their names should reflect the event coming through the socket

  // Now we need to create a room for the sockets to join
  // You could use this to manage channels in the chat app
  // We will only use one default room for this workshop
  socket.on('join channel', function (channel) {
    server.log('Socket', 'User ' + socket.id + ' joined channel ' + channel);

    // We need to tell the socket server that this socket wants to join a room
    socket.join(channel);
  });

  // Now we need to have a listener for incoming messages
  socket.on('message', function (message) {
    server.log('Socket', 'User ' + message.user + ' sent a message to channel ' + message.channel + ': ' + message.message);
    // We need to broadcast this message to anyone that is currently in the room
    // The to() method has a sister in() method, but both accomplish this the same way
    // Note that we need to create a listener on our client side to handle 'user message'
    io.to(message.channel).emit('user message', {
      user: message.user,
      message: message.message
    });
  });

});


//Start the server when all plugins/sockets are built
server.start(function () {
  server.log('info', 'Server running at: ' + server.info.uri);
});
