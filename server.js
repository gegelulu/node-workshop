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

// THE FOLLOWING SHOULD BE WRITTEN INSIDE THE CALLBACK FUNCTION

  // We'll also bind to the socket's disconnection so we know when it goes away
  // The event to listen to is 'disconnect'
  // Add a callback function that performs a server.log()

  // The following listeners are specific ones we'll create and are not part of Socket.IO by default
  // Their names should reflect the event coming through the socket

  // Create a listener for when a use joins a room
  // Rooms are specific for Socket.IO but can be replicated in any socket service using some simple logic
  // We need a listener to mange clients connecting and joining a room
  // Include a server.log() that contains which channel was joined and by what socket connection
  // The event that should be listened to will be called 'join room'
  // Use the join() function to tell the socket server that the socket is joining a room

  // Now we need to have a listener for incoming messages
  // The event that we need to listen for is called 'message'
  // The data received will be an object 'message' that contains the properties 'content', 'user' and 'channel'
  // 'message' will be passed into the callback function
  // Using the to() function on 'io', broadcast to the channel by emitting the event 'user message'
  // Send an object with the keys 'user' and 'message' with the 'user message' event
  // 'user' and 'message' will use the data inside the 'message' object

//Start the server when all plugins/sockets are built
server.start(function () {
  server.log('info', 'Server running at: ' + server.info.uri);
});
