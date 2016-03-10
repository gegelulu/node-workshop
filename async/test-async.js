'use strict';

function callAsync (secondsDelay) {
  setTimeout(function () {
    console.log('Waited for ' + secondsDelay);
  }, secondsDelay * 1000);
}

var toLoop = [1, 5, 3, 10, 1, 3, 2, 8, 6, 10];

console.log('Start Loop');

toLoop.forEach(function (seconds) {
  callAsync(seconds);
});

console.log('End Loop');