var test = require('blue-tape')
var pipe = require('./index.js')

test('works with a sync function', t => {
    return pipe(Math.abs)(-3).then(value => {
        t.equals(value, 3)
        return value
    })
})

test('works with multiple arguments', t => {
    return pipe(Math.pow)(2, 3).then(value => {
        t.equals(value, 8)
        return value
    })
})

test('works with an array as an input', t => {
    const sum = numbers => numbers.reduce((acc, cur) => acc + cur, 0)
    return pipe(sum)([1, 5, 9]).then(value => {
        t.equals(value, 15)
        return value
    })
})

test('works with a mix of functions', t => {
    return pipe(
        x => x + 1, // sync
        asyncAbs, // async
        x => x - 1 // sync
    )(-3).then(value => {
        t.equals(value, 1)
        return value
    })
})

test('fails when there is an error inside the chain', t => {
    return t.shouldFail(pipe(
        x => x + 1,
        () => { throw Error('test') },
        x => { return console.log('I should not be called') }
    )(-3), Error)
})

test('fails when there is a rejection inside the chain', t => {
    return t.shouldFail(pipe(
        x => x + 1,
        () => { return Promise.reject(Error('test'))  },
        x => { return console.log('I should not be called') }
    )(-3), Error)
})

test('fails when no arguments supplied', t => {
    t.throws(() => {
        pipe()
    }, 'pipe requires at least one argument')
    t.end()
})

const asyncAbs = x => Promise.resolve(Math.abs(x))

