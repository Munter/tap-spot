# tap-spot

Compact dot reporter for TAP output. Supports skip and todo, reports errors and final stats.

![Screenshot of tap-spot output](https://i.imgur.com/tvan2YY.png)

## Install

```
npm install tap-spot --save-dev
```

## Usage

### Streaming

```js
const spot = require('tap-spot');
const tape = require('tape'); // Or another TAP reporter

tape.createStream()
  .pipe(spot())
  .pipe(process.stdout);
```

### CLI

**package.json**

```json
{
  "name": "module-name",
  "scripts": {
    "test": "node ./test/tap-test.js | tap-spot"
  }
}
```

Then run with `npm test`

**Terminal**

```
tape test/index.js | node_modules/.bin/tap-spot
```

**Testling**

```
npm install testling -g
testling test/index.js | node_modules/.bin/tap-spot
```


**NOTE**

Originaly forked by [Toke Voltelen](https://github.com/Tokimon) from the excellent [tap-dot](https://github.com/scottcorgan/tap-dot) by [scottcorgan](https://github.com/scottcorgan), because the [tap-out](https://github.com/scottcorgan/tap-out) parser doesn't work properly with in-script streams. Toke Voltelen switched the TAP parser to [tap-parser](https://github.com/tapjs/tap-parser) and released [tap-reporter-dot](https://github.com/Tokimon/tap-reporter-dot).

Since forked by [Peter Müller](https://github.com/Munter) and released as [tap-spot](https://github.com/Munter/tap-spot) in order to gain support for TAP skip and todo directives as well as less duplication in error output.


## License

MIT License

Copyright (c) 2018 Peter Brandt Müller

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
