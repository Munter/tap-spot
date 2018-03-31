'use strict';

const through = require('through2');
const parser = require('tap-parser');
const duplexer = require('duplexer');
const chalk = require('chalk');

function strPadLen(str, char, len) {
  str = String(str);
  const space = fill(char, len - str.length);
  return space + str;
}

function fill(char, len) {
  let str = '';
  for(let i = 0; i < len; i++) { str += char; }
  return str;
}

module.exports = function dot() {
  const out = through();
  const tap = parser();

  const stream = duplexer(tap, out);

  const extra = [];
  let assertCount = 0;
  let lastComment;

  out.push('\n');

  function outPush(str) {
    out.push('  ' + str);
  }

  tap.on('comment', function(comment) {
    lastComment = comment;
  });

  tap.on('assert', function(res) {
    // console.log('test');
    const char = res.ok ? chalk.green('.') : chalk.red('x');
    (++assertCount > 1) ? out.push(char) : outPush(char);
  });

  tap.on('extra', function(str) {
    if(str !== '') { extra.push(str); }
  });

  tap.on('complete', function(res) {
    const fails = res.failures;
    const failCount = fails.length;

    if(failCount || !assertCount) {
      stream.failed = true;

      outPush('\n\n\n');

      fails.forEach(function(failure) {
        outPush(chalk.white('---') + '\n');
        const diag = failure.diag;
        const name = 'x ' + failure.name;
        const dashes = fill('-', name.length);

        outPush(chalk.red(name) + '\n');
        outPush(chalk.red(dashes) + '\n');
        outPush(chalk.cyan('  operator: ' + diag.operator) + '\n');
        outPush(chalk.cyan('  expected: ' + diag.expected) + '\n');
        outPush(chalk.cyan('  actual: ' + diag.actual) + '\n');
        outPush(chalk.cyan('  at: ' + diag.at) + '\n');

        outPush(chalk.white('...') + '\n');
      });

      outputExtra();

      statsOutput();

      const past = (failCount === 1) ? 'was' : 'were';
      const plural = (failCount === 1) ? 'failure' : 'failures';

      outPush('\n\n');
      outPush(chalk.red('Failed Tests: '));
      outPush('There ' + past + ' ' + chalk.red(failCount) + ' ' + plural + '\n\n');

      fails.forEach(function(error) {
        outPush('  ' + chalk.red('x ' + error.name) + '\n');
      });

      outPush('\n');
    } else {
      statsOutput();

      outPush('\n\n');
      outPush(chalk.green('Pass!') + '\n');
    }

    function statsOutput() {
      const total = String(res.count || 0);
      const pass = String(res.pass || 0);
      const fail = String(res.fail || 0);

      const max = Math.max(total.length, Math.max(pass.length, fail.length));

      outPush('\n\n');
      outPush(strPadLen(total, ' ', max) + ' tests\n');
      outPush(chalk.green(strPadLen(pass, ' ', max) + ' passed\n'));
      if(fail !== '0') { outPush(chalk.red(strPadLen(fail, ' ', max) + ' failed')); }
    }
  });

  function outputExtra() {
    console.log(extra.join('\n'));
  }

  return stream;
};
