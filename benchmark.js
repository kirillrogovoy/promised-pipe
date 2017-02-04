const path = require('path')
const prettyTime = require('pretty-hrtime')
const pipe = require(path.join(__dirname, process.env.PROMISED_PIPE_LIB_FILE || 'index.js'))

const PIPE_SIZE = 1e3

const inc = x => x + 1
const fns = Array(PIPE_SIZE).fill(inc)
const formatTime = x => prettyTime(x, { precise: true })
let t1

// creation
t1 = process.hrtime()

for (let i = 0; i < 1e4 * 2; i++) {
    pipe.apply(null, fns)
}

console.log('creation:', formatTime(process.hrtime(t1)))

// execution
t1 = process.hrtime()

const fn = pipe.apply(null, fns)
for (let i = 0; i < 1e2 * 2; i++) {
    fn(1)
}

console.log('execution:', formatTime(process.hrtime(t1)))
