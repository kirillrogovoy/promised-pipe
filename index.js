// Dependencies
var pipe = require('ramda').pipe
var promised = require('q').promised

// Public intefrace
module.exports = asyncPipe

function asyncPipe() {
  var args = Array.prototype.slice.call(arguments);
  return pipe.apply(null, args.map(promised))
}
