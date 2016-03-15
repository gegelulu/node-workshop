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
  if (process.platform == 'win32') {
    exec('PING -n 3 -w 1000 127.1 >NUL');
  } else {
    exec('sleep 3');
  }
}, 5000);
