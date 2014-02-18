var util = require('util'),
    Transform = require('stream').Transform;

// Transform stream to replace \" with "" for valid CSV parsing
function EscapeQuotes() {
  Transform.call(this);
}

util.inherits(EscapeQuotes, Transform);

EscapeQuotes.prototype._transform = function (chunk, encoding, done) {
  this.push(chunk.toString().replace('\\"', '""'));
  done();
};

module.exports.EscapeQuotes = EscapeQuotes;