// Public intefrace
module.exports = promisedPipe

const ensureFunctionType = (fn, i) => {
    if (typeof fn !== 'function') {
        throw Error(`pipe requires each argument to be a function. Argument #${i+1} is of type "${typeof fn}"`)
    }
}

const chain = (q, fn) => q.then(fn)

function promisedPipe(...fns) {
    if (fns.length < 1) {
        throw Error('pipe requires at least one argument')
    }

    fns.forEach(ensureFunctionType)

    // shift out the 1st function for multiple arguments
    const start = fns.shift()

    return (...args) => fns.reduce(chain, Promise.resolve(start(...args)))
}
