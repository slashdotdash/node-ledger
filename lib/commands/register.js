var util = require('util'),
    Transform = require('stream').Transform,
    csv = require('csv-streamify'),
    EscapeQuotes = require('../escape-quotes').EscapeQuotes,
    CommodityParser = require('../commodityParser').CommodityParser;

function RegisterParser() {
  Transform.call(this, { objectMode: true });
  this.current = null;
}

util.inherits(RegisterParser, Transform);

RegisterParser.prototype._transform = function (chunk, encoding, done) {
  this.parse(chunk);
  done();
};

RegisterParser.prototype._flush = function(done) {
  this.emitCurrent();
  done();
};

RegisterParser.prototype.parse = function(data) {
  try {
    if (data[0].length !== 0) {
      this.emitCurrent();
      this.parseCurrent(data);
    }

    this.appendPosting(data);
  } catch (ex) {
    this.emit('error', 'Failed to parse balance: ' + ex);
  }
};

RegisterParser.prototype.emitCurrent = function() {
  if (this.current !== null) {
    // emit completed record        
    this.push(this.current);
    this.current = null;
  }
};

RegisterParser.prototype.parseCurrent = function(data) {
  this.current = {
    date: this.toDate(data[0]),
    effectiveDate: this.toDate(data[1]),
    code: data[2],
    cleared: data[3] === 'true',
    pending: data[4] === 'true',
    payee: data[5],
    postings: []
  };
};

RegisterParser.prototype.appendPosting = function(data) {
  var amount = CommodityParser.parse(data[7].toString());
  
  this.current.postings.push({
    account: data[6],
    commodity: amount
  });
};

RegisterParser.prototype.toDate = function(str) {
  if (str.length === 0) {
    return null;
  }
  
  var date = str.split('/');
  
  return new Date(Date.UTC(date[0], parseInt(date[1], 10) - 1, parseInt(date[2], 10)));
};

var initialFormat = [
  '%(quoted(date))',
  '%(effective_date ? quoted(effective_date) : "")',
  '%(code ? quoted(code) : "")',
  '%(cleared ? "true" : "false")',
  '%(pending ? "true" : "false")',
  '%(quoted(payee))',
  '%(quoted(display_account))',
  '%(quoted(amount))'
];
var subsequentFormat = [
  '%(quoted(display_account))',
  '%(quoted(amount))'
];

// The `ledger register` command displays all the postings occurring in a single account, line by line. 
module.exports.run = function(cli, opts) {
  var format = initialFormat.join(',') + '\n%/,,,,,,' + subsequentFormat.join(',') + '\n%/',
      args = ['register'],
      options = opts || {};

  // Allow filtering by a given account name
  if (options.account) {
    args.push('^' + options.account);
  }

  args.push('--format');
  args.push(format);

  var process = cli.exec(args);
  
  return process.stdout
    .pipe(new EscapeQuotes())
    .pipe(csv({ objectMode: true }))
    .pipe(new RegisterParser());
};