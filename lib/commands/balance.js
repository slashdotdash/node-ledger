var util = require('util'),
    Transform = require('stream').Transform,
    csv = require('csv-streamify'),
    EscapeQuotes = require('../escape-quotes').EscapeQuotes,
    CommodityParser = require('../commodityParser').CommodityParser;

function BalanceParser() {
  Transform.call(this, { objectMode: true });
}

util.inherits(BalanceParser, Transform);

BalanceParser.prototype._transform = function (chunk, encoding, done) {
  this.parse(chunk);
  done();
};

BalanceParser.prototype.parse = function(data) {
  try {
    var total = CommodityParser.parse(data[0].toString());
    
    var balance = {
      total: total,
      account: {
        fullname: data[1],
        shortname: data[2],
        depth: parseInt(data[3], 10)
      }
    };
    
    this.push(balance);
  } catch (ex) {
    this.emit('error', 'Failed to parse balance: ' + ex);
  }
};

// `ledger balance` output format to allow parsing as a CSV string
var format = '%(quoted(display_total)),%(quoted(account)),%(quoted(partial_account)),%(depth)\n%/';

// The balance command reports the current balance of all accounts.
module.exports.run = function(cli) {
  var args = ['balance', '--format', format],
      process = cli.exec(args);

  return process.stdout
    .pipe(new EscapeQuotes())
    .pipe(csv({ objectMode: true }))
    .pipe(new BalanceParser());
};