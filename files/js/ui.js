'use strict';

// As per jQuery docs, wrap our UI functions inside a document.ready

$(document).ready(function () {

  // If using the same selectors in jQuery multiple times, assign them to variables
  var $headline = $('#headline'),
    $signin = $('#signin'),
    $chatapp = $('#chatapp'),
    $messageInput = $('.text-input'),
    $loading = $('.loading');

  // Start a reference for our use details scoped above everything
  // This is so we can have access to these details in all our functions
  var user;

  // Show the loading screen by default
  $loading.toggleClass('active');

  // Check localStorage for a user (see notes below in Sign In Form)
  if (localStorage.ChatsAppUser) {
    $loading.toggleClass('active');
    $chatapp.toggleClass('active');
    $headline.toggleClass('mini');

    // Assign our credentials as an array
    user = localStorage.ChatsAppUser.split(',');

    // We already have a user so lets start our chat application
    startChatting();
  } else {
    $loading.toggleClass('active');
    $signin.toggleClass('active');
  }

  /////////////////////////////
  /// Sign in form
  /////////////////////////////

  // We need to hook the sign in submit to get the data
  $signin.find('form').submit(function (e) {

    // For simplicity we'll rely on HTML5 validation and just assume our data is good
    // Totally don't do that in production
    console.log('Sign in form submitted', e);

    // Get the data entered into the form and push it into an array
    var data = [];
    data.push($signin.find('#inputUsername').val());
    data.push($signin.find('#inputPassword').val());
    user = data;

    // In order for us to skip this screen we'll store the data into localStorage
    // localStorage is a small amount of memory that the browser allocates for a domain
    // Any data is retained across browser sessions
    localStorage.setItem('ChatsAppUser', data);

    // Prevent the default form submission
    // This is better than using return false
    e.preventDefault();

    // Now lets hide the signin screen and display the chat app itself
    $signin.toggleClass('active');
    $chatapp.toggleClass('active');
    $headline.toggleClass('mini');


    // Start the chat application
    startChatting();
  });

  //////////////////////////////////////////
  /// Function to start our socket chat app
  //////////////////////////////////////////

  function startChatting() {
    // Redefining for clarity: this is our Socket client library which we've assigned to the window
    var Socket = window.ChatsAppSocket;

    // Join the default channel
    Socket.joinChannel('default');

    // We need to bind to the message input to send our message to the socket
    $messageInput.submit(function (e) {

      // Get the message and then clear the input
      var message = $messageInput.find('#message').val();
      $messageInput.find('#message').val("");

      // Send our message along with the username
      Socket.sendMessage(message, user[0]);

      // Stop the default submit of the form
      e.preventDefault();
    });
  }
});