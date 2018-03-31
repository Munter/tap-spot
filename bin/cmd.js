#!/usr/bin/env node

const spot = require('../')();

process.stdin
  .pipe(spot)
  .pipe(process.stdout);

process.on('exit', (status) => {
  if(spot.failed || status === 1) {
    process.exit(1);
  }
});
