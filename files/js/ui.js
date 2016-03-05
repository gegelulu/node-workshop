'use strict';

// As per jQuery docs, wrap our UI functions inside a document.ready

$(document).ready(function () {

  /////////////////////////////
  /// Sign in form
  /////////////////////////////

  // We need to hook the sign in submit to get the data submitted
  var $signin = $('.form-signin');
  console.log($signin);

  $signin.submit(function (e) {
    console.log('Sign in form submitted', e);

    // Prevent the default for submission
    e.preventDefault();
  });
});