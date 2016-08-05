var test = require('blue-tape')
var pipe = require('./index.js')

test('works with a sync function', function(t) {
    return pipe(Math.abs)(-3).then(function (value) {
        t.equals(value, 3)
        return value
    })
})

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

test('fails when there is an error inside the chain', function(t) {
    return t.shouldFail(pipe(
        function (x) { return x + 1 },
        function () { throw Error('test') },
        function (x) { return console.log('I should not be called') }
    )(-3), Error)
})

test('fails when there is a rejection inside the chain', function(t) {
    return t.shouldFail(pipe(
        function (x) { return x + 1 },
        function () { return Promise.reject(Error('test'))  },
        function (x) { return console.log('I should not be called') }
    )(-3), Error)
})

function asyncAbs(x) {
    return Promise.resolve(Math.abs(x))
}
