# promised-pipe

[![npm version](https://badge.fury.io/js/promised-pipe.svg)](https://badge.fury.io/js/promised-pipe)
[![Build Status](https://travis-ci.org/kirillrogovoy/promised-pipe.svg?branch=master)](https://travis-ci.org/kirillrogovoy/promised-pipe)

A sweet composition of [ramda.pipe](http://ramdajs.com/0.21.0/docs/#pipe) and [q.promised](https://github.com/kriskowal/q/wiki/API-Reference#qpromisedfunc) to make async pipes simple

## Introduction

This library is extremely useful for those who use functions pipes ([ramda.pipe](http://ramdajs.com/0.21.0/docs/#pipe),
  inverted [underscore.compose](http://underscorejs.org/#compose), etc.),
but struggle with composing both *synchronous* and *asynchronous* functions in the same pipeline.

## Install

Run: `npm i --save promised-pipe`

Include: `const pipe = require('promised-pipe')`

## Usage

The exported file is a function with the same API as `ramda.pipe`, except the created function will always return a `Promise`

Here's how it works (see [test.js](https://github.com/flashhhh/promised-pipe/blob/master/test.js))

    test('works with a mix of functions', function(t) {
        return pipe(
            function (x) { return x + 1 }, // sync
            asyncAbs, // async
            function (x) { return x - 1 } // sync
        )(-3).then(function (value) {
            t.equals(value, 1)
            return value
        })
    })

    function asyncAbs(x) {
        return Promise.resolve(Math.abs(x))
    }

So you can easily mix functions which return non-promises and functions which return promises.
