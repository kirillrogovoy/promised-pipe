// Public intefrace
module.exports = promisedPipe

function promisedPipe(...fns) {
    if (fns.length < 1) {
        throw Error('pipe requires at least one argument')
    }

    /*
     * Does the same as q.promised
     * https://github.com/kriskowal/q/wiki/API-Reference#qpromisedfunc
     *
     * Creates a new version of func that accepts any combination of promise and non-promise
     * values, converting them to their fulfillment values before calling the original func.
     * The returned version also always returns a promise: if func does a return or throw,
     * then Q.promised(func) will return fulfilled or rejected promise, respectively.
     *
     */
    const promised = fn => (...args) => Promise.all(args).then(_args => fn.apply(null, _args))

    /*
     * Does the same as Ramda.pipe
     * http://ramdajs.com/docs/#pipe
     *
     * Performs left-to-right function composition. The leftmost function may have any arity;
     * the remaining functions must be unary.
     */
    return (...args) => fns.map(promised).reduce((acc, cur) => [cur.apply(null, acc)], args)[0]
}
