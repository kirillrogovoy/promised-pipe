const pipe = require('./index.js')
const fs = require('fs')

// Basic example with simple math
const inc = x => x + 1 // synchronous function
const mul3 = x => x * 3 // synchronous function
const div2promise = x => Promise.resolve(x / 2) // asynchronous function

const mathFn = pipe(
    inc,
    div2promise,
    mul3
)

mathFn(5).then(console.log) // 5 + 1 / 2 * 3 = 9

// Example with fs
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

// Example with ramda
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
