'use strict';

// First we need to create a connection to our socket server
// Since we're using a basic setup, we don't need to pass in an options object
var socket = io();

// Create a reference to the message window
var $messageWindow;
$(document).ready(function () {
  $messageWindow = $('.message-window');
});

// We'll create a simple object full of functions.
// There are many other ways to do this, however this is the most simple
// For this workshop which concentrates on node and Socket.IO, we'll avoid the others
var Socket = {

  // We need a function to join a specific channel
  joinChannel: function joinChannel(channel) {
    console.log('Joining channel', channel);

    // This tells the socket server that we're joining a channel (default)
    socket.emit('join channel', channel);

    // We also need to get messages that are sent to this channel (default)
    // We'll print them in the message screen
    socket.on('user message', function (message) {
      console.log('Got user message', message);

      // We'll use a little basic jQuery to print the message to the window
      $messageWindow.append('<div><span class="username">' + message.user + '</span>: ' + message.message + '</div>');
    });
  },

  // We need a function to send a message along with the username
  sendMessage: function sendMessage(message, user) {
    console.log('Sending message', message);

    socket.emit('message', {
      message: message,
      user: user,
      channel: 'default'
    });
  }
};

window.ChatAppSocket = Socket;