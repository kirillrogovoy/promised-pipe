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
        function (x) { return x - 1 } // async
    )(-3).then(function (value) {
        t.equals(value, 1)
        return value
    })
})

function asyncAbs(x) {
    return Promise.resolve(Math.abs(x))
}
