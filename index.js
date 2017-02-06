// Public intefrace
module.exports = promisedPipe

const chain = (q, fn) => q.then(fn)

function promisedPipe(...fns) {
    if (fns.length < 1) {
        throw Error('pipe requires at least one argument')
    }

    fns.forEach((fn, i) => {
        if (typeof fn !== 'function') {
            throw Error(`pipe requires each argument to be a function. Argument #${i+1} is of type "${typeof fn}"`)
        }        
    })

    // shift out the 1st function for multiple arguments
    const start = fns.shift()

    return (...args) => fns.reduce(chain, new Promise(res => res(start(...args))))
}
