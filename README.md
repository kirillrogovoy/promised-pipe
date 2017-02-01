# promised-pipe

[![npm version](https://badge.fury.io/js/promised-pipe.svg)](https://badge.fury.io/js/promised-pipe)
[![Build Status](https://travis-ci.org/kirillrogovoy/promised-pipe.svg?branch=master)](https://travis-ci.org/kirillrogovoy/promised-pipe)

A sweet composition of [ramda.pipe](http://ramdajs.com/0.21.0/docs/#pipe) and [q.promised](https://github.com/kriskowal/q/wiki/API-Reference#qpromisedfunc) to make async pipes simple. No dependencies. Extremely lightweight.

## Requirements

You only have to have **Node 4+** or a ES5-compatible browser

## Introduction

This library is extremely useful for those who use functions pipes ([ramda.pipe](http://ramdajs.com/0.21.0/docs/#pipe), inverted [underscore.compose](http://underscorejs.org/#compose), etc.), but struggle with composing both *synchronous* and *asynchronous* (Promise returning) functions in the same pipeline.

## Install

Run:
```sh
npm i --save promised-pipe
```

Include:
```js
const pipe = require('promised-pipe')
// or
import pipe from 'promised-pipe'
```

## Usage

It is a function with the same API as `ramda.pipe`, except the created function will always return a `Promise`

```js
const resultedFn = pipe(fn1, fn2, fn3)
resultedFn(args) // => Promise
```

There is a bunch of tests in [test.js](./test.js)

## Examples

You can play and run all of these examples by `node example.js` (Node 6+ required).
Note that Ramda is an optional dependency and won't get installed when using `npm i promised-pipe`

Basic example with some simple math:
```js
const inc = x => x + 1 // synchronous function
const mul3 = x => x * 3 // synchronous function
const div2promise = x => Promise.resolve(x / 2) // asynchronous function

const mathFn = pipe(
    inc,
    div2promise,
    mul3
)

mathFn(5).then(console.log) // 5 + 1 / 2 * 3 = 9
```

Example with fs:
```js
const filePath = '/tmp/promised_pipe_example'
// "Promisify" fs modules
const readFile = path => new Promise((res, rej) => fs.readFile(path, (err, data) => err ? rej(err) : res(data)))
const writeFile = (path, data) => new Promise((res, rej) => fs.writeFile(path, data, (err) => err ? rej(err) : res(path)))

const fsFn = pipe(
    text => writeFile(filePath, text),
    path => readFile(path),
    text => text.toString(),
    text => text.toUpperCase(),
    text => writeFile(filePath, text).then(() => text)
)

fsFn('hello').then(console.log) // HELLO
```

Still isn't sexy, right? Let's add some Ramda to the previous example:
```js
const R = require('ramda')
const readFileC = R.curry(readFile)
const writeFileC = R.curry(writeFile)
const writeToTmp = writeFileC(filePath + '_ramda')

const ramdaFsFn = pipe(
    writeToTmp,
    readFileC,
    R.toString,
    R.toUpper,
    R.tap(writeToTmp)
)

ramdaFsFn('hello, ramda').then(console.log) // HELLO, RAMDA
```

So you can easily mix functions which return non-promises and functions which return promises.
