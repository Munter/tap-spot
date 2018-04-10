'use strict';

const through = require('through2');
const parser = require('tap-parser');
const duplexer = require('duplexer');
const chalk = require('chalk');

const white = chalk.white;
const yellow = chalk.hex('cdcd00');
const green = chalk.hex('00cd00');
const blue = chalk.hex('0cdcd');
const red = chalk.hex('cd0000');

const symbols = {
  skip: yellow(','),
  ok: green('.'),
  todo: blue('!'),
  fail: red('×')
};

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

module.exports = function spot() {
  const out = through();
  const tap = new parser();

  // Hack to collect todo's for later filtering them out of the failures array
  const todos = [];

  const stream = duplexer(tap, out);

  out.push('\n');

  function outPush(str) {
    out.push('  ' + str + '\n');
  }

  tap.on('assert', function(res) {
    let char;

    if (res.skip) {
      char = symbols.skip;
    } else if (res.todo) {
      todos.push(res);
      char = symbols.todo;
    } else if (res.ok) {
      char = symbols.ok;
    } else {
      char = symbols.fail;
    }

    out.push(char);
  });

  tap.on('complete', function(res) {
    const fails = res.failures.filter(f => !todos.find(t => t === f));

    outPush('\n');

    if (todos.length > 0) {
      todos.forEach(function (todo) {
        const { operator, expected, actual, at } = todo.diag;

        outPush(blue(`! TODO ${todo.name}`));
        operator && outPush(`${blue('·') + yellow(' operator:')} ${operator}`);
        expected && outPush(`${blue('·') + yellow(' expected:')} ${expected}`);
        actual   && outPush(`${blue('·') + yellow('   actual:')} ${actual}`);
        at       && outPush(`${blue('·') + yellow('       at:')} ${at}`);

        outPush('');
      });
    }

    if (fails.length > 0) {
      stream.failed = true;

      fails.forEach(function (fail) {
        const { operator, expected, actual, at } = fail.diag;

        outPush(red(`✖ FAIL ${fail.name}`));
        operator && outPush(`${red('|') + blue(' operator:')} ${operator}`);
        expected && outPush(`${red('|') + blue(' expected:')} ${expected}`);
        actual   && outPush(`${red('|') + blue('   actual:')} ${actual}`);
        at       && outPush(`${red('|') + blue('       at:')} ${at}`);

        outPush('');
      });
    }

    const stats = {
      tests: String(res.count || 0),
      skipped: String(res.skip || 0),
      pass: String(res.pass || 0),
      todo: String(res.todo || 0),
      fail: String(fails.length || 0)
    };

    const max = Math.max(...Object.values(stats).map(v => v.length));

    outPush(strPadLen(stats.tests, ' ', max) + ' tests');

    if (stats.skipped !== '0') {
      outPush(yellow(strPadLen(stats.skipped, ' ', max) + ' skipped'));
    }

    outPush(green(strPadLen(stats.pass, ' ', max) + ' passed'));

    if (stats.todo !== '0') {
      outPush(blue(strPadLen(stats.todo, ' ', max) + ' todo'));
    }

    if (stats.fail !== '0') {
      outPush(red(strPadLen(stats.fail, ' ', max) + ' failed'));
    }

    outPush('\n');
  });

  return stream;
};
