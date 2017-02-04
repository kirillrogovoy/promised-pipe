const path = require('path')
const prettyTime = require('pretty-hrtime')
const pipe = require(path.join(__dirname, process.env.PROMISED_PIPE_LIB_FILE || 'index.js'))

const PIPE_SIZE = 1e3
const CREATION_LOOP_SIZE = 1e4 * 2
const EXECUTION_LOOP_SIZE = 1e3

const inc = x => x + 1
const fns = Array(PIPE_SIZE).fill(inc)
const formatTime = x => prettyTime(x, { precise: true })
var t1

// creation
t1 = process.hrtime()

for (var i = 0; i < CREATION_LOOP_SIZE; i++) {
    pipe.apply(null, fns)
}

console.log('creation:', formatTime(process.hrtime(t1)))

// execution
t1 = process.hrtime()

const fn = pipe.apply(null, fns)

Array(EXECUTION_LOOP_SIZE).fill(1).reduce(acc => acc.then(fn), Promise.resolve(1)).then(result => {
    console.log('execution:', formatTime(process.hrtime(t1)), 'result', result)
})

