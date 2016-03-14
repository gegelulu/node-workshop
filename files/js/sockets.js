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
  // First, add a console.log() with a short message and the 'channel' variable
  // We'll emit the join channel event to our socket server, passing the 'channel' variable with it
  // We also need to capture messages that are sent to this channel. Listen for the 'user message' event
  // In the 'user message' callback, use a console.log() to show the info
  // Also use $messageWindow.append('<div><span class="username">' + [sent by this user] + '</span>: ' + [message received] + '</div>'); to add it to the chat window
  joinChannel: function joinChannel(channel) {
    
  },

  // We need a function to send a message along with the username
  sendMessage: function sendMessage(message, user) {
    
  }
};

window.ChatsAppSocket = Socket;