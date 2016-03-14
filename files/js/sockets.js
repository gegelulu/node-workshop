'use strict';

// First we need to create a connection to our socket server
// Since we're using a basic setup, we don't need to pass in an options object
var socket = io();

// Create a reference to the message window
var $messageWindow;
$(document).ready(function () {
  $messageWindow = $('.message-window');
});

// We need an object called 'Socket'
// Inside this object there will be two functions, 'joinChannel' and 'sendMessage'


// Then assign this object to 'window'