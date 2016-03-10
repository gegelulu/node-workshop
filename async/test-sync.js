'use strict';

var exec = require('child_process').execSync;

setInterval(function () {
  console.log('A message');
}, 500);

setInterval(function () {
  console.log('A second message');
}, 500);

setInterval(function () {
  console.log('Running a thread blocking process');
  exec('sleep 3');
}, 5000);